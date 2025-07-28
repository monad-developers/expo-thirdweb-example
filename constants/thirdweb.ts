import { createThirdwebClient } from "thirdweb";
import { monadTestnet } from "thirdweb/chains";

let _client: ReturnType<typeof createThirdwebClient> | null = null;

export const getClient = () => {
	if (!_client) {
		const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID;
		if (!clientId) {
			throw new Error("EXPO_PUBLIC_THIRDWEB_CLIENT_ID is not set");
		}
		_client = createThirdwebClient({
			clientId,
		});
	}
	return _client;
};

export const hasClientId = () => {
	return !!process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID;
};

export const chain = monadTestnet;