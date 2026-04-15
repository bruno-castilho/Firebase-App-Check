import { env } from "@Firebase-App-Check/env/server";
import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import { verifyAppCheck } from "./hooks/verify-app-check.js";

const baseCorsConfig = {
	origin: env.CORS_ORIGIN,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"X-Firebase-AppCheck",
	],
	credentials: true,
	maxAge: 86400,
};

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyCors, baseCorsConfig);

fastify.get("/", async () => {
	return "OK";
});

fastify.get("/test-app-check", { preHandler: verifyAppCheck }, async () => {
	return { message: "Sucesso" };
});

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log("Server running on port 3000");
});
