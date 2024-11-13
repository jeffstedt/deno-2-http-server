import { assertEquals, assertExists } from "@std/assert";
import { router } from "./routes/router.ts";
import { MemoDatabase } from "./database.ts";

const dbClient = new MemoDatabase();

const mockRequest = async (method: string, url: string, body: object = {}): Promise<Response> => {
  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (method !== "GET") init.body = JSON.stringify(body);
  const req = new Request(url, init);
  return await router(req, dbClient);
};

// Happy case tests
Deno.test("GET /api/todos returns all todos", async () => {
  const response = await mockRequest("GET", "http://localhost:8080/api/todos");
  assertEquals(response.status, 200);

  const data = await response.json();
  assertEquals(Array.isArray(data), true);
  assertExists(data[0].id);
});

Deno.test("GET /api/todos/:id returns a specific todo", async () => {
  const response = await mockRequest("GET", "http://localhost:8080/api/todos/1");
  assertEquals(response.status, 200);

  const data = await response.json();
  assertEquals(data.id, 1);
});

const methods = ["POST", "PUT"];
methods.forEach((method) => {
  Deno.test(`${method} /api/todos creates a new todo`, async () => {
    const newTodo = { text: "New task", completed: false };
    const response = await mockRequest(method, "http://localhost:8080/api/todos", newTodo);

    assertEquals(response.status, 200);

    const data = await response.json();

    assertEquals(data.text, newTodo.text);
    assertExists(data.id);
  });
});

Deno.test("DELETE /api/todos/:id archives a specific todo", async () => {
  const response = await mockRequest("DELETE", "http://localhost:8080/api/todos/1");
  assertEquals(response.status, 200);

  const data = await response.json();
  assertExists(data.archivedAt);
});

// Error case tests
Deno.test("PATCH /api/todos/:id fails when not matching schema", async () => {
  const updateData = { completed: true };
  const response = await mockRequest("PATCH", "http://localhost:8080/api/todos/1", updateData);
  assertEquals(response.status, 400);
});