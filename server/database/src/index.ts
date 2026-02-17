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
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const success = new Response("Success", {status: 200})
		const notFound = new Response("Not Found", {status: 404})
		const methodNotAllowed = new Response("Method Not Allowed")

		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		const db = drizzle(env.DB, {schema});

		if (path === "/api/virtualbox/create" && method === "POST") {
			const initSchema = z.object({
				type: z.enum(["react", "node"]),
				name: z.string(),
				userId: z.string()
			})

			const body = await request.json()
			const {type, name, userId} = initSchema.parse(body)

			const vb = await db.insert(schema.virtualbox).values({type, name, userId}).returning().get()

			console.log("vb:", vb)

			await fetch("https://storage.mzli.workers.dev/api/init", {
				method: "POST",
				body: JSON.stringify({virtualboxId: vb.id, type}),
				headers: {"Content-Type": "application/json"}
			})

			return success
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
