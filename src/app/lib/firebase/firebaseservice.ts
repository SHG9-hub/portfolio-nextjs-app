import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite"
import { db } from "./firebase"

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
    } catch (error) {
        throw new Error("データの取得に失敗しました。")
    }
};

const addTodo = async (todoData: Omit<Todo, 'id'>) => {
    try {
        await addDoc(collection(db, "todos"), todoData);
        return true;
    } catch (error) {
        alert("タスクの追加に失敗しました。再度お試しください。")
        return false;
    }
}

const updataTodoTitle = async (todoId: string, updataTitle: string) => {
    try {
        await updateDoc(doc(db, "todos", todoId), { title: updataTitle });
        return true;
    } catch (error) {
        alert("Todoの更新中にエラーが発生しました。");
        return false;
    }
}

const updataTodoState = async (todoId: string, completed: boolean) => {
    try {
        await updateDoc(doc(db, "todos", todoId), { completed: completed })
    } catch (error) {
        alert("Todoの完了中にエラーが発生しました。");
    }
}

export { addTodo, fetchUserTodo, updataTodoTitle, updataTodoState }