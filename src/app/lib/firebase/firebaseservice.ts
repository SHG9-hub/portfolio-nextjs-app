import { collection, doc, getDocs, query, where } from "firebase/firestore/lite"
import { db } from "./firebase"

export type Todo = {
    id: string;
    title: string;
    completed: boolean;
}

export const fetchUserTodo = async (userId: string): Promise<Todo[]> => {
    const todosCollectionRef = collection(db, "todos");
    const userTodoQuery = query(todosCollectionRef, where("userId", "==", userId));

    try {
        const querySnapshot = await getDocs(userTodoQuery);
        const todos = querySnapshot.docs.map((doc) => {
            const data = doc.data() as Todo;
            return {
                ...data,
                id: doc.id,
            };
        });
        return todos;
    } catch (error) {
        throw new Error("データの取得に失敗しました。")
    }
};