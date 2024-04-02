import {
	type AzureUser,
	type ITokenProvider,
	type ITokenResponse,
	ScopeType,
} from "@fluidframework/azure-client";
import { generateToken } from "@fluidframework/azure-service-utils";
import type { IFluidChatUser } from "../definitions";
import { localStorageManager, StorageKeys } from "./localStorage";
import { canWrite } from "./users";

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
		const tokenLifetimeFromLocalStorage = localStorageManager.get(
			StorageKeys.tokenLifetime,
		);
		this.tokenLifetimeMs = tokenLifetimeFromLocalStorage
			? Number.parseInt(tokenLifetimeFromLocalStorage)
			: undefined;
	}

	/**
	 * {@inheritDoc @fluidframework/routerlicious-driver#ITokenProvider.fetchOrdererToken}
	 */
	public async fetchOrdererToken(
		tenantId: string,
		documentId?: string,
		refresh?: boolean,
	): Promise<ITokenResponse> {
		return this.fetchToken(tenantId, documentId, refresh);
	}

	/**
	 * {@inheritDoc @fluidframework/routerlicious-driver#ITokenProvider.fetchStorageToken}
	 */
	public async fetchStorageToken(
		tenantId: string,
		documentId: string,
		refresh?: boolean,
	): Promise<ITokenResponse> {
		return this.fetchToken(tenantId, documentId, refresh);
	}

	private async fetchToken(
		tenantId: string,
		documentId?: string,
		refresh?: boolean,
	): Promise<ITokenResponse> {
		if (!this.cachedToken || refresh) {
			const token = this.signToken(tenantId, documentId);
			if (documentId) {
				this.cachedToken = token;
			}
			return {
				fromCache: false,
				jwt: token,
			};
		}
		return {
			fromCache: true,
			jwt: this.cachedToken,
		};
	}

	private signToken(tenantId: string, documentId: string | undefined): string {
		const scopes: ScopeType[] =
			canWrite(this.user.additionalDetails) || !documentId
				? [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite]
				: [ScopeType.DocRead];
		return generateToken(
			tenantId,
			this.tenantKey,
			scopes,
			documentId,
			this.user,
			this.tokenLifetimeMs
				? Math.round(this.tokenLifetimeMs / 1000)
				: undefined,
		);
	}
}
