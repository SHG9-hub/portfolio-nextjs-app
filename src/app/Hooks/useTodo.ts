import useSWR from "swr";
import { fetchUserTodo } from "../lib/firebase/firebaseservice";
import { enqueueSnackbar } from "notistack";

export const useTodo = (userId: string) => {
    const {
        data: todos,
        error: todosError,
    } = useSWR(userId, fetchUserTodo);

    if (todosError) {
        enqueueSnackbar('データの取得に失敗しました。', { variant: 'error' });
    }

    return {
        todos,
    }
}
