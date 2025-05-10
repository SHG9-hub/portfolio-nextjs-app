import { Todo } from "@/app/lib/firebase/firebaseservice";
import { Task } from "./Task";

type TodoListProps = {
  todoList: Todo[];
};

export const TodoList = (props: TodoListProps) => {
  return (
    <div className="space-y-3">
      {props.todoList.map((todo: Todo) => (
        <Task todo={todo} key={todo.id} />
      ))}
    </div>
  );
};
