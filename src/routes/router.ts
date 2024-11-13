import { MemoDatabase } from "../database.ts";
import { handleDelete, handleGet, handlePatch, handlePost } from "../controllers/index.ts";
import { respond } from "../utilities.ts";


export async function router(req: Request, dbClient: MemoDatabase): Promise<Response> {
  const { method, url } = req
  const { pathname } = new URL(url);

  if (pathname.startsWith("/api/todos") && method === "GET") {
    return handleGet(req, dbClient);
  } else if (pathname.startsWith("/api/todos") && (method === "POST" || method === "PUT")) {
    return handlePost(req, dbClient);
  } else if (pathname.startsWith("/api/todos") && method === "PATCH") {
    return handlePatch(req, dbClient);
  } else if (pathname.startsWith("/api/todos") && method === "DELETE") {
    return handleDelete(req, dbClient);
  } else if (pathname === "/health") {
    return respond({ status: "ok" })
  }

  return new Response("Not found", { status: 404 });
}