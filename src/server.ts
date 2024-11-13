import { MemoDatabase } from "./database.ts";
import { router } from "./routes/router.ts";

Deno.serve({ port: 8080, hostname: "127.0.0.1" }, (req) => router(req, new MemoDatabase()));