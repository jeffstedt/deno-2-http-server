# Deno v2 Todo API

Battle testing Deno v2 with a simple REST API for managing todos.

## Features

-	CRUD Operations: Create, read, update, and delete todos.
-	Data Validation: Zod-based schema validation
-	In-Memory Database: Fast and lightweight for local development.


## Prerequisites
- [Deno](https://deno.com)

## Run the server
```sh
deno run dev
```

## Run tests
```sh
deno run test
```

## Endpoints

- GET /api/todos - Retrieves all todos.
- GET /api/todos/:id - Retrieves a specific todo by ID.
- POST /api/todos - Creates a new todo
- PUT /api/todos - Creates a new todo.
- PATCH /api/todos/:id - Updates a specific todo by ID.
- DELETE /api/todos/:id - Archives a specific todo by ID.