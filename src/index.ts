import { AppDataSource } from "./data-source";
import { Todo } from "./entity/Todo";
import * as express from "express";

AppDataSource.initialize()
  .then(async () => {
    // Generate 20 dummy todos
    const todos = [];
    for (let i = 0; i < 20; i++) {
      todos.push({
        title: `Todo ${i + 1}`,
        completed: Math.random() < 0.5, // Randomly set completed status
      });
    }

    // Clear existing data (optional, for clean seeding)
    await Todo.clear();

    // Insert dummy todos
    await Todo.save(todos);

    const app = express();
    const port = process.env.PORT || 3000; // Use environment variable or default port

    app.use(express.json()); // Parse incoming JSON data

    app.get("/todos", async (req, res) => {
      const todos = await Todo.find();
      res.json(todos);
    });

    app.post("/todos", async (req, res) => {
      const todo = await Todo.create(req.body);
      res.status(201).json(todo);
    });

    // GET /todos/:id
    app.get("/todos/:id", async (req, res) => {
      const todo = await Todo.findOneBy({ id: +req.params.id });
      if (!todo) return res.status(404).json({ message: "Todo not found" });
      res.json(todo);
    });

    // PUT /todos/:id
    app.put("/todos/:id", async (req, res) => {
      const todo = await Todo.findOneBy({ id: +req.params.id });
      if (!todo) return res.status(404).json({ message: "Todo not found" });
      await Todo.update(req.params.id, req.body);
      res.json(todo);
    });

    // DELETE /todos/:id
    app.delete("/todos/:id", async (req, res) => {
      const todo = await Todo.findOneBy({ id: +req.params.id });
      if (!todo) return res.status(404).json({ message: "Todo not found" });
      await todo.remove();
      res.status(204).send();
    });

    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => console.log(error));
