import z from "https://deno.land/x/zod@v3.21.4/index.ts";
import { MemoDatabase, TodoSchema } from "../database.ts";
import { respond } from "../utilities.ts";

const sendEmails = (todo: z.infer<typeof TodoSchema>, sharedWith: string[]) => {
  // await emailService.send({
  //   to: sharedWith,
  //   subject: `Todo shared with you: ${todo.text}`,
  //   body: `You have been shared a todo: ${todo.text}.`,
  // });

  const token = Deno.env.get("EMAIL_SERVICE_SECRET_TOKEN");

  if (!token) {
    throw new Error("Email service token is not set");
  }

  console.log(`Sending email with token: ${token}`);
  console.log(`Sending emails to: ${sharedWith.join(", ")}`);
  console.log(`Todo details: ${JSON.stringify(todo)}`);
  return Promise.resolve();
};

const handleShare = async (
  req: Request,
  dbClient: MemoDatabase,
  validatedBody: z.infer<typeof TodoSchema>
): Promise<Response> => {
  const pattern = new URLPattern({ pathname: "/api/todos/:id/share" });
  const match = pattern.exec(req.url);
  const id = Number(match?.pathname.groups.id);

  if (Number.isNaN(id)) {
    return respond({ error: "Invalid id" }, 400);
  }

  try {
    const existingTodo = dbClient.todos.getById(id);
    if (!existingTodo) {
      return respond({ error: "Todo not found" }, 404);
    }

    // Important: Check that todo hasn't been shared with the same user

    const updatedTodo = dbClient.todos.update(id, {
      ...existingTodo,
      sharedWith: validatedBody.sharedWith,
    });

    if (!updatedTodo) {
      return respond({ error: "Todo not found or cannot be updated" }, 404);
    }

    await sendEmails(updatedTodo, updatedTodo.sharedWith!);
    return respond(updatedTodo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return respond({ error: "Invalid data", issues: error.errors }, 400);
    }
    return respond({ error: "Unexpected error", issues: error }, 400);
  }
};

export const handlePost = async (req: Request, dbClient: MemoDatabase): Promise<Response> => {
  try {
    const body = await req.json();
    const validatedBody = TodoSchema.parse(body);

    const url = new URL(req.url);
    const { pathname } = url;

    if (pathname.endsWith("/share")) {
      const result = await handleShare(req, dbClient, validatedBody);
      return result;
    }

    const newTodo = dbClient.todos.add(validatedBody);
    return respond(newTodo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return respond({ error: "Invalid data", issues: error.errors }, 400);
    }
    return respond({ error: "Unexpected error", issues: error }, 400);
  }
};