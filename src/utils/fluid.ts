import { AzureUser, ITokenProvider, ITokenResponse, ScopeType } from "@fluidframework/azure-client";
import { generateToken } from "@fluidframework/azure-service-utils";
import { IFluidChatUser } from "../definitions";
import { localStorageManager, StorageKeys } from "./localStorage";

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
        private readonly user: AzureUser<IFluidChatUser>,
    ) {
        const tokenLifetimeFromLocalStorage = localStorageManager.get(StorageKeys.tokenLifetime);
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
        const scopes: ScopeType[] = this.user.additionalDetails.permissions.includes("write")
            ? [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite]
            : [ScopeType.DocRead];
        return generateToken(
            tenantId,
            this.tenantKey,
            scopes,
            documentId,
            this.user,
            this.tokenLifetimeMs ? Math.round(this.tokenLifetimeMs / 1000) : undefined,
        )
    }
}
