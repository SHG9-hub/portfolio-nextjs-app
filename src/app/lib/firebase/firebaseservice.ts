import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite"
import { db } from "./firebase"
import { enqueueSnackbar } from "notistack";

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
    userId: string;
}

const fetchUserTodo = async (userId: string): Promise<Todo[]> => {
    const todosCollectionRef = collection(db, "todos");
    const userTodoQuery = query(todosCollectionRef, where("userId", "==", userId));

    try {
        const querySnapshot = await getDocs(userTodoQuery);
        const todos = querySnapshot.docs.map((doc) => {
            return {
                ...doc.data(),
                id: doc.id,
            } as Todo;
        });
        return todos;
    } catch {
        throw new Error("データの取得に失敗しました。")
    }
};

const addTodo = async (todoData: Omit<Todo, 'id'>) => {
    try {
        await addDoc(collection(db, "todos"), todoData);
        return true;
    } catch {
        enqueueSnackbar('タスクの追加に失敗しました。もう一度お試しください。', { variant: 'error' });
        return false;
    }
}

const updateTodo = async (todoId: string, updates: { title?: string; completed?: boolean }) => {
    try {
        const todoRef = doc(db, "todos", todoId);
        await updateDoc(todoRef, updates);
        return true;
    } catch {
        enqueueSnackbar('タスクの更新に失敗しました。もう一度お試しください。', { variant: 'error' });
        return false;
    }
};

const deleteTodo = async (todoId: string) => {
    try {
        await deleteDoc(doc(db, "todos", todoId));
    } catch {
        enqueueSnackbar('タスクの削除に失敗しました。もう一度お試しください。', { variant: 'error' });
        return false;
    }
}

export { addTodo, fetchUserTodo, updateTodo, deleteTodo }