import useSWR, { mutate } from "swr";
import { addTodo, fetchUserTodo, updateTodo } from "../lib/firebase/firebaseservice";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export const useTodo = (userId: string) => {
    const [inputValue, setInputValue] = useState("");

    const {
        data: todos,
        error: todosError,
    } = useSWR(userId, fetchUserTodo);

    if (todosError) {
        enqueueSnackbar('データの取得に失敗しました。', { variant: 'error' });
    }

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        await addTodo({ title: inputValue, completed: false, userId: userId });
        setInputValue("");
        mutate(userId);
    };

    return {
        todos,

        inputValue,
        setInputValue,
        handleAddTodo
    }
}
