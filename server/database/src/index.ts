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

import { eq } from "drizzle-orm";
import { user } from "./schema";
import { json } from "itty-router-extras";
import { drizzle } from "drizzle-orm/d1";
import z from "zod";
import * as schema from "./schema"

export interface Env {
	DB: D1Database;
	STORAGE: any;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const success = new Response("Success", {status: 200})
		const notFound = new Response("Not Found", {status: 404})
		const methodNotAllowed = new Response("Method Not Allowed", {status: 405})
		const invalidRequest = new Response("Invalid Request", {status: 400})

		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		const db = drizzle(env.DB, {schema});

		if (path === "/api/virtualbox") {
			if (method === "GET") {
				const params = url.searchParams
				if (params.has("id")) {
					const id = params.get("id") as string
					const res = await db.query.virtualbox.findFirst({
						where: (virtualbox, {eq}) => eq(virtualbox.id, id)
					})
					return json(res ?? {})
				} else {
					const res = await db.select().from(schema.virtualbox).all()
					return json(res ?? {})
				}
			} else if (method === "DELETE") {
				const params = url.searchParams
				if (params.has("id")) {
					const id = params.get("id") as string
					const res = await db.delete(schema.virtualbox).where(eq(schema.virtualbox.id, id)).get()
					return success
				} else {
					return invalidRequest
				}
			} else if (method === "PUT") {
				const initSchema = z.object({
					id: z.string(),
					name: z.string().optional(),
					visibility: z.enum(["public", "private"]).optional()
				})

				const body = await request.json()
				const {id, name, visibility} = initSchema.parse(body)

				const vb = await db.update(schema.virtualbox).set({ name, visibility}).where(eq(schema.virtualbox.id, id)).returning().get()

				return success
			} else if (method === "POST") {
				const initSchema = z.object({
					type: z.enum(["react", "node"]),
					name: z.string(),
					userId: z.string(),
					visibility: z.enum(["public", "private"])
				})

				const body = await request.json()
				const {type, name, userId, visibility} = initSchema.parse(body)

				const vb = await db.insert(schema.virtualbox).values({type, name, userId, visibility}).returning().get()

				const initStorageRequest = new Request(`https://storage.mzli.workers.dev/api/init`, {
					method: "POST",
					body: JSON.stringify({virtualboxId: vb.id, type}),
					headers: {
						"Content-Type": "application/json"
					}
				})

				await env.STORAGE.fetch(initStorageRequest)
				return new Response(vb.id, {status: 200})
			}
		} else if (path === "/api/user") {
			if (method === "GET") {
				const params = url.searchParams;

				if (params.has("id")) {
					const id = params.get("id") as string;
					const res = await db.query.user.findFirst({
						where: (user, {eq}) => eq(user.id, id),
						with: {
							virtualbox: true
						}
					})
					return json(res ?? {})
				} else {
					const res = await db.select().from(user).all();
					return new Response(JSON.stringify(res));
				}
			} else if (method === "POST") {
				const userSchema = z.object({
					id: z.string(),
					name: z.string(),
					email: z.string().email()
				})

				const body = await request.json();

				const {id, name, email} = userSchema.parse(body);

				const res = await db.insert(user).values({id, name, email}).returning().get();
				return json({res});
			} else {
				return new Response("Method Not Found", {status: 405})
			}
		} else {
			return new Response("Not Found", {status: 404});
		}
	}
} satisfies ExportedHandler<Env>;
