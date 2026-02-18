/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { z } from "zod"
import startercode from "./startercode";

export interface Env{
	R2: R2Bucket;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const success = new Response("Success", {status: 200})
		const notFound = new Response("Not Found", {status: 404})
		const methodNotAllowed = new Response("Method Not Allowed")
		const invalidRequest = new Response("Invalid Request", {status: 400})

		const url = new URL(request.url)
		const path = url.pathname
		const method = request.method

		if (path === "/api") {
			if (method === "GET") {
				const params = url.searchParams
				const virtualboxId = params.get("virtualboxId")
				const fileId = params.get("fileId")

				if (virtualboxId) {
					const res = await env.R2.list({prefix: `projects/${virtualboxId}`})
					return new Response(JSON.stringify(res), {status: 200})
				} else if (fileId) {
					const obj = await env.R2.get(fileId)
					if (obj === null) {
						return new Response(`${fileId} not found`, {status: 404})
					}
					const headers = new Headers()
					headers.set("etag", obj.httpEtag)
					obj.writeHttpMetadata(headers)

					const text = await obj.text()

					return new Response(text, {
						headers
					})
				} else return invalidRequest

				if (!virtualboxId) {
					return invalidRequest
				}

			} else if (method === "POST") {
				const createSchema = z.object({
					fileId: z.string()
				})

				const body = await request.json()
				const {fileId} = createSchema.parse(body)

				await env.R2.put(fileId, "")

				return success
			} else return methodNotAllowed
		} else if (path === "/api/rename" && method === "POST") {
			const renameSchema = z.object({
				fileId: z.string(),
				newFileId: z.string(),
				data: z.string()
			})

			const body = await request.json()

			const {fileId, newFileId, data}= renameSchema.parse(body)

			await env.R2.delete(fileId)
			await env.R2.put(newFileId, data)

			return success
		} else if (path === "/api/save" && method === "POST") {
			const saveSchema = z.object({
				fileId: z.string(),
				data: z.string()
			})

			const body = await request.json 

			const {fileId, data} = saveSchema.parse(body)

			await env.R2.put(fileId, data)
		}else if (path === "/api/init" && method === "POST") {
			const initSchema = z.object({
				virtualboxId: z.string(),
				type: z.enum(["react", "node"])
			})

			const body = await request.json()

			const {virtualboxId, type}= initSchema.parse(body)

			await Promise.all(
				startercode[type].map(async (file) => {
					await env.R2.put(`projects/${virtualboxId}/${file.name}`, file.body)
				})
			)

			return success
		} else {
			return notFound
		}
	},
} satisfies ExportedHandler<Env>;
