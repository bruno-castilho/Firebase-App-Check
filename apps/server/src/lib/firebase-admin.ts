import { env } from "@Firebase-App-Check/env/server";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";

const adminApp =
	getApps().length === 0
		? initializeApp({ projectId: env.FIREBASE_PROJECT_ID })
		: getApps()[0]!;

export const appCheck = getAppCheck(adminApp);
