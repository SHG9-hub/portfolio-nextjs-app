import { AddTaskForm } from "./components/AddTaskForm";
import { TodoList } from "./components/TodoList";
import { mockTodoList } from "./data/mockdata";

export default function Home() {
  return (
    <main className="mx-auto mt-10 max-w-xl space-y-10">
      <h1 className="text-center text-4xl">Next.js Todoアプリ</h1>
      <div className="space-y-5">
        <AddTaskForm />
        <div className="rounded bg-slate-200 p-5">
          <TodoList todoList={mockTodoList} />
        </div>
      </div>
    </main>
  );
}
