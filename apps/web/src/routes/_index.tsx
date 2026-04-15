import { env } from "@Firebase-App-Check/env/web";
import axios from "axios";
import { useState } from "react";
import { getAppCheckToken } from "@/lib/firebase";

type ApiResult =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success"; data: unknown }
	| { status: "error"; message: string };

const apiClient = axios.create({
	baseURL: env.VITE_SERVER_URL,
});

export default function Home() {
	const [result, setResult] = useState<ApiResult>({ status: "idle" });

	async function handleWithoutToken() {
		setResult({ status: "loading" });
		try {
			const response = await apiClient.get("/test-app-check");
			setResult({ status: "success", data: response.data });
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setResult({
					status: "error",
					message: `${error.response?.status ?? "?"}: ${JSON.stringify(error.response?.data)}`,
				});
			} else {
				setResult({ status: "error", message: "Erro desconhecido" });
			}
		}
	}

	async function handleWithToken() {
		setResult({ status: "loading" });
		try {
			const token = await getAppCheckToken();
			console.log(token);
			const response = await apiClient.get("/test-app-check", {
				headers: { "X-Firebase-AppCheck": token },
			});
			setResult({ status: "success", data: response.data });
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setResult({
					status: "error",
					message: `${error.response?.status ?? "?"}: ${JSON.stringify(error.response?.data)}`,
				});
			} else {
				setResult({ status: "error", message: "Erro desconhecido" });
			}
		}
	}

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-4 font-medium">Firebase App Check</h2>
					<div className="mb-4 flex gap-3">
						<button
							type="button"
							onClick={() => void handleWithoutToken()}
							disabled={result.status === "loading"}
							className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
						>
							Requisição sem token
						</button>
						<button
							type="button"
							onClick={() => void handleWithToken()}
							disabled={result.status === "loading"}
							className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
						>
							Requisição com token
						</button>
					</div>
					{result.status === "loading" && (
						<p className="text-gray-500 text-sm">Carregando...</p>
					)}
					{result.status === "success" && (
						<pre className="rounded bg-gray-100 p-3 text-sm dark:bg-gray-800">
							{JSON.stringify(result.data, null, 2)}
						</pre>
					)}
					{result.status === "error" && (
						<p className="text-red-500 text-sm">{result.message}</p>
					)}
				</section>
			</div>
		</div>
	);
}
