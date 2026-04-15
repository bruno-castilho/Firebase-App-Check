import { env } from "@Firebase-App-Check/env/web";
import { initializeApp } from "firebase/app";
import {
	getToken,
	initializeAppCheck,
	ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

const firebaseApp = initializeApp({
	apiKey: env.VITE_FIREBASE_API_KEY,
	authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: env.VITE_FIREBASE_PROJECT_ID,
	appId: env.VITE_FIREBASE_APP_ID,
});

const appCheck = initializeAppCheck(firebaseApp, {
	provider: new ReCaptchaEnterpriseProvider(env.VITE_RECAPTCHA_SITE_KEY),
	isTokenAutoRefreshEnabled: true,
});

export async function getAppCheckToken(): Promise<string> {
	const result = await getToken(appCheck);
	return result.token;
}
