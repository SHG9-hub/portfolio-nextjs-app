import { fetchUserTodo, deleteTodo, addTodo, updateTodo } from "@/app/lib/firebase/firebaseservice";
import { mockTodoList } from "@/app/__test__/mocks/todo-mocks";
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore/lite";

jest.mock("firebase/firestore/lite", () => ({
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
}));

jest.mock("@/app/lib/firebase/firebase", () => ({
    db: {}
}));

describe("firebaseservice関数のテスト", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("fetchUserTodo", () => {
        it("ユーザーIDに基づいてTodoを取得できること", async () => {
            const mockQuerySnapshot = {
                docs: mockTodoList.map((todo) => ({
                    id: todo.id,
                    data: () => ({
                        title: todo.title,
                        completed: todo.completed,
                    }),
                })),
            };

            (collection as jest.Mock).mockReturnValue("todos-collection");
            (where as jest.Mock).mockReturnValue("userId-condition");
            (query as jest.Mock).mockReturnValue("user-todos-query");
            (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

            const userId = "test-user-id";
            const result = await fetchUserTodo(userId);

            expect(collection).toHaveBeenCalledWith(expect.anything(), "todos");
            expect(where).toHaveBeenCalledWith("userId", "==", userId);
            expect(query).toHaveBeenCalledWith("todos-collection", "userId-condition");
            expect(getDocs).toHaveBeenCalledWith("user-todos-query");

            expect(result).toHaveLength(mockTodoList.length);
            result.forEach((todo, index) => {
                expect(todo.id).toBe(mockTodoList[index].id);
                expect(todo.title).toBe(mockTodoList[index].title);
                expect(todo.completed).toBe(mockTodoList[index].completed);
            });
        });

        it("エラーが発生した場合、適切なエラーをスローすること", async () => {
            (collection as jest.Mock).mockReturnValue("todos-collection");
            (where as jest.Mock).mockReturnValue("userId-condition");
            (query as jest.Mock).mockReturnValue("user-todos-query");
            (getDocs as jest.Mock).mockRejectedValue(new Error("Firestore error"));

            await expect(fetchUserTodo("test-user-id")).rejects.toThrow("データの取得に失敗しました。");
        });
    });

    describe("addTodo", () => {
        it("新しいTodoを追加できること", async () => {
            (collection as jest.Mock).mockReturnValue("todos-collection");
            (addDoc as jest.Mock).mockResolvedValue({ id: "new-todo-id" });

            const newTodo = {
                title: "新しいタスク",
                completed: false,
                userId: "test-user-id"
            };

            const result = await addTodo(newTodo);

            expect(collection).toHaveBeenCalledWith(expect.anything(), "todos");
            expect(addDoc).toHaveBeenCalledWith("todos-collection", newTodo);
            expect(result).toBe(true);
        });

        it("エラーが発生した場合、falseを返すこと", async () => {
            (collection as jest.Mock).mockReturnValue("todos-collection");
            (addDoc as jest.Mock).mockRejectedValue(new Error("Add error"));

            const newTodo = {
                title: "新しいタスク",
                completed: false,
                userId: "test-user-id"
            };

            const result = await addTodo(newTodo);

            expect(result).toBe(false);
        });
    });

    describe("updateTodo", () => {
        it("Todoを更新できること", async () => {
            (doc as jest.Mock).mockReturnValue("todo-doc-ref");
            (updateDoc as jest.Mock).mockResolvedValue(undefined);

            const todoId = "test-todo-id";
            const updates = { title: "更新されたタイトル", completed: true };

            const result = await updateTodo(todoId, updates);

            expect(doc).toHaveBeenCalledWith(expect.anything(), "todos", todoId);
            expect(updateDoc).toHaveBeenCalledWith("todo-doc-ref", updates);
            expect(result).toBe(true);
        });

        it("エラーが発生した場合、falseを返すこと", async () => {
            (doc as jest.Mock).mockReturnValue("todo-doc-ref");
            (updateDoc as jest.Mock).mockRejectedValue(new Error("Update error"));

            const todoId = "test-todo-id";
            const updates = { title: "更新されたタイトル" };

            const result = await updateTodo(todoId, updates);

            expect(result).toBe(false);
        });
    });

    describe("deleteTodo", () => {
        it("Todoを削除できること", async () => {
            (doc as jest.Mock).mockReturnValue("todo-doc-ref");
            (deleteDoc as jest.Mock).mockResolvedValue(undefined);

            const todoId = "test-todo-id";
            await deleteTodo(todoId);

            expect(doc).toHaveBeenCalledWith(expect.anything(), "todos", todoId);
            expect(deleteDoc).toHaveBeenCalledWith("todo-doc-ref");
        });

        it("エラーが発生した場合、falseを返すこと", async () => {
            (doc as jest.Mock).mockReturnValue("todo-doc-ref");
            (deleteDoc as jest.Mock).mockRejectedValue(new Error("削除エラー"));

            const result = await deleteTodo("test-todo-id");
            expect(result).toBe(false);
        });
    });
}); 