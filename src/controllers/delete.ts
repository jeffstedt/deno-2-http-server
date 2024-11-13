import { MemoDatabase } from "../database.ts";
import { respond } from "../utilities.ts";

export const handleDelete = (req: Request, dbClient: MemoDatabase): Response => {
  const url = new URL(req.url);
  const { pathname } = url;

  const idStr = pathname.slice("/api/todos/".length);
  const id = Number(idStr);

  if (Number.isNaN(id)) {
    return respond({ error: "Invalid id, must be a number" }, 400);
  }

  const todoExists = Boolean(dbClient.todos.getById(id));

  if (!todoExists) {
    return respond({ error: "Todo not found" }, 404);
  }

  const archivedTodo = dbClient.todos.archive(id);
  return respond(archivedTodo);
}