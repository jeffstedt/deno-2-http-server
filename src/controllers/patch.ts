import z from "https://deno.land/x/zod@v3.21.4/index.ts";
import { respond } from "../utilities.ts";
import { MemoDatabase, TodoSchema } from "../database.ts";

export const handlePatch = async (req: Request, dbClient: MemoDatabase): Promise<Response> => {
  const url = new URL(req.url);
  const { pathname } = url;

  const idStr = pathname.slice("/api/todos/".length);
  const id = Number(idStr);

  if (Number.isNaN(id)) {
    return respond({ error: "Invalid id" }, 400);
  }

  try {
    const body = await req.json();
    const validatedBody = TodoSchema.parse(body);

    const updatedTodo = dbClient.todos.update(id, validatedBody);
    return respond(updatedTodo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return respond({ error: "Invalid data", issues: error.errors }, 400);
    }
    return respond({ error: "Unexpected error", issues: error }, 400);
  }
}