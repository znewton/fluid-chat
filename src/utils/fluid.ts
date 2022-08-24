import { ITokenProvider, ITokenResponse, IUser, ScopeType } from "@fluidframework/azure-client";
import { generateToken } from "@fluidframework/azure-service-utils";
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
        return generateToken(
            tenantId,
            this.tenantKey,
            [
                ScopeType.DocRead,
                ScopeType.DocWrite,
                ScopeType.SummaryWrite,
            ],
            documentId,
            this.user,
            this.tokenLifetimeMs ? Math.round(this.tokenLifetimeMs / 1000) : undefined,
        )
    }
}