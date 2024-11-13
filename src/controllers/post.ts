import z from "https://deno.land/x/zod@v3.21.4/index.ts";
import { MemoDatabase, TodoSchema } from "../database.ts";
import { respond } from "../utilities.ts";

export const handlePost = async (req: Request, dbClient: MemoDatabase): Promise<Response> => {
  try {
    const body = await req.json();
    const validatedBody = TodoSchema.parse(body);

    const newTodo = dbClient.todos.add(validatedBody);
    return respond(newTodo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return respond({ error: "Invalid data", issues: error.errors }, 400);
    }
    return respond({ error: "Unexpected error", issues: error }, 400);
  }
};