export type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

export const mockTodoList: Todo[] = [
    {
        id: 1,
        title: 'Reactを勉強する',
        completed: false,
    },
    {
        id: 2,
        title: '夕食を作る',
        completed: false,
    },
    {
        id: 3,
        title: '部屋を掃除する',
        completed: true,
    },
];