import { Dict, dictToArray } from "./utilities.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

export const TodoSchema = z.object({
  id: z.number().optional(),
  text: z.string().min(1, "Text is required"),
  completed: z.boolean(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  archivedAt: z.string().nullish(),
});

export type Todo = z.infer<typeof TodoSchema>;

const stage = Deno.env.get("STAGE");

class Todos {
  private now = new Date().toISOString(); // UTC time
  private todos: Dict<Todo> = stage?.toLowerCase() === "local" ? {
    1: { text: "Buy milk", completed: false, createdAt: this.now },
    2: { text: "Buy eggs", completed: true, createdAt: this.now },
    3: { text: "Buy flour", completed: true, createdAt: this.now },
    4: { text: "Make pancakes", completed: true, createdAt: this.now },
  } : {};

  constructor() {
    const existingIds = Object.keys(this.todos).map(Number);
    this.nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }

  private nextId: number;

  private isSelectableAndMutable(id: number): boolean {
    return this.todos[id] && !this.todos[id].archivedAt
  }

  private getAll(): Todo[] {
    return dictToArray(this.todos);
  }

  getAllWhereNotArchived(): Todo[] {
    return this.getAll().filter(({ archivedAt }) => !archivedAt);
  }

  getById(id: number): Todo | undefined {
    if (!this.isSelectableAndMutable(id)) {
      return undefined
    }

    return { id, ...this.todos[id] };
  }

  add(todo: Todo): Todo {
    const newTodo = { ...todo, id: this.nextId, createdAt: new Date().toISOString() };
    this.todos[this.nextId] = newTodo
    this.nextId++;
    return newTodo;
  }

  update(id: number, todo: Todo): Todo | undefined {
    if (!this.isSelectableAndMutable(id)) {
      return undefined
    }

    if (this.todos[id]) {
      this.todos[id] = { ...this.todos[id], id, ...todo, updatedAt: new Date().toISOString() };
      return this.todos[id];
    }
  }

  archive(id: number): Todo | undefined {
    if (!this.isSelectableAndMutable(id)) {
      return undefined
    }

    if (this.todos[id]) {
      this.todos[id].archivedAt = new Date().toISOString();
      return this.todos[id];
    }
  }

}

export class MemoDatabase {
  public todos: Todos = new Todos()
}