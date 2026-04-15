import type { FastifyReply, FastifyRequest } from "fastify";
import { appCheck } from "../lib/firebase-admin.js";

export async function verifyAppCheck(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	const token = request.headers["x-firebase-appcheck"];

	if (!token || typeof token !== "string") {
		await reply.status(401).send({ error: "Token ausente" });
		return;
	}

	try {
		await appCheck.verifyToken(token);
	} catch {
		await reply.status(403).send({ error: "Token inválido" });
	}
}
