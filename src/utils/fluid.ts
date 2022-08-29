import { ITokenProvider, ITokenResponse, IUser as IAzureUser, ScopeType } from "@fluidframework/azure-client";
import { generateToken } from "@fluidframework/azure-service-utils";
import { IUser } from "../definitions";
import { localStorageManager, tokenLifetimeKey } from "./localStorage";

export class CustomInsecureTokenProvider implements ITokenProvider {
    private readonly tokenLifetimeMs: number | undefined;
    private cachedToken: string | undefined;

    constructor(
        /**
         * Private server tenantKey for generating tokens.
         */
        private readonly tenantKey: string,

        /**
         * User with whom generated tokens will be associated.
         */
        private readonly user: IUser,
    ) {
        const tokenLifetimeFromLocalStorage = localStorageManager.get(tokenLifetimeKey);
        this.tokenLifetimeMs = tokenLifetimeFromLocalStorage ? Number.parseInt(tokenLifetimeFromLocalStorage) : undefined;
    }

    /**
     * {@inheritDoc @fluidframework/routerlicious-driver#ITokenProvider.fetchOrdererToken}
     */
    public async fetchOrdererToken(tenantId: string, documentId?: string, refresh?: boolean): Promise<ITokenResponse> {
        if (!this.cachedToken || refresh) {
            return {
                fromCache: false,
                jwt: this.signToken(tenantId, documentId),
            };
        }
        return {
            fromCache: true,
            jwt: this.cachedToken,
        };
    }

    /**
     * {@inheritDoc @fluidframework/routerlicious-driver#ITokenProvider.fetchStorageToken}
     */
    public async fetchStorageToken(tenantId: string, documentId: string, refresh?: boolean): Promise<ITokenResponse> {
        if (!this.cachedToken || refresh) {
            return {
                fromCache: false,
                jwt: this.signToken(tenantId, documentId),
            };
        }
        return {
            fromCache: true,
            jwt: this.cachedToken,
        };
    }

    private signToken(tenantId: string, documentId: string): string {
        const scopes: ScopeType[] = this.user.permissions.includes("write")
            ? [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite]
            : [ScopeType.DocRead];
        const user: IAzureUser = {
            id: this.user.id,
        };
        return generateToken(
            tenantId,
            this.tenantKey,
            scopes,
            documentId,
            user,
            this.tokenLifetimeMs ? Math.round(this.tokenLifetimeMs / 1000) : undefined,
        )
    }
}