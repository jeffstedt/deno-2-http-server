import { MemoDatabase } from "../database.ts";
import { respond } from "../utilities.ts";

export const handleGet = (req: Request, dbClient: MemoDatabase): Response => {
  const url = new URL(req.url);
  const { pathname } = url;

  if (pathname === "/api/todos") {
    return respond(dbClient.todos.getAllWhereNotArchived());
  }

  const idStr = pathname.slice("/api/todos/".length);
  const id = Number(idStr);

  if (Number.isNaN(id)) {
    return respond({ error: "Invalid id" }, 400);
  }

  return respond(dbClient.todos.getById(id));
}