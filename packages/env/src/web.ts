import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_SERVER_URL: z.url(),
		VITE_FIREBASE_API_KEY: z.string().min(1),
		VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
		VITE_FIREBASE_PROJECT_ID: z.string().min(1),
		VITE_FIREBASE_APP_ID: z.string().min(1),
		VITE_RECAPTCHA_SITE_KEY: z.string().min(1),
	},
	runtimeEnv: (import.meta as any).env,
	emptyStringAsUndefined: true,
});
