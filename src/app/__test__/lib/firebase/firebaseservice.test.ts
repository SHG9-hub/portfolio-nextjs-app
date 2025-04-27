import { fetchUserTodo, Todo, deleteTodo, addTodo, updateTodo } from "@/app/lib/firebase/firebaseservice";
import { mockTodoList } from "@/app/__test__/mocks/todo-mocks";

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

const collection = require("firebase/firestore/lite").collection;
const query = require("firebase/firestore/lite").query;
const where = require("firebase/firestore/lite").where;
const getDocs = require("firebase/firestore/lite").getDocs;
const doc = require("firebase/firestore/lite").doc;
const deleteDoc = require("firebase/firestore/lite").deleteDoc;
const addDoc = require("firebase/firestore/lite").addDoc;
const updateDoc = require("firebase/firestore/lite").updateDoc;

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

            collection.mockReturnValue("todos-collection");
            where.mockReturnValue("userId-condition");
            query.mockReturnValue("user-todos-query");
            getDocs.mockResolvedValue(mockQuerySnapshot);

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
            collection.mockReturnValue("todos-collection");
            where.mockReturnValue("userId-condition");
            query.mockReturnValue("user-todos-query");
            getDocs.mockRejectedValue(new Error("Firestore error"));

            await expect(fetchUserTodo("test-user-id")).rejects.toThrow("データの取得に失敗しました。");
        });
    });

    describe("addTodo", () => {
        it("新しいTodoを追加できること", async () => {
            collection.mockReturnValue("todos-collection");
            addDoc.mockResolvedValue({ id: "new-todo-id" });

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
            collection.mockReturnValue("todos-collection");
            addDoc.mockRejectedValue(new Error("Add error"));

            // alertをモック化
            window.alert = jest.fn();

            const newTodo = {
                title: "新しいタスク",
                completed: false,
                userId: "test-user-id"
            };

            const result = await addTodo(newTodo);

            expect(result).toBe(false);
            expect(window.alert).toHaveBeenCalledWith("タスクの追加に失敗しました。再度お試しください。");
        });
    });

    describe("updateTodo", () => {
        it("Todoを更新できること", async () => {
            doc.mockReturnValue("todo-doc-ref");
            updateDoc.mockResolvedValue(undefined);

            const todoId = "test-todo-id";
            const updates = { title: "更新されたタイトル", completed: true };

            const result = await updateTodo(todoId, updates);

            expect(doc).toHaveBeenCalledWith(expect.anything(), "todos", todoId);
            expect(updateDoc).toHaveBeenCalledWith("todo-doc-ref", updates);
            expect(result).toBe(true);
        });

        it("エラーが発生した場合、falseを返すこと", async () => {
            doc.mockReturnValue("todo-doc-ref");
            updateDoc.mockRejectedValue(new Error("Update error"));

            // alertをモック化
            window.alert = jest.fn();

            const todoId = "test-todo-id";
            const updates = { title: "更新されたタイトル" };

            const result = await updateTodo(todoId, updates);

            expect(result).toBe(false);
            expect(window.alert).toHaveBeenCalledWith("Todoの更新中にエラーが発生しました。");
        });
    });

    describe("deleteTodo", () => {
        it("Todoを削除できること", async () => {
            doc.mockReturnValue("todo-doc-ref");
            deleteDoc.mockResolvedValue(undefined);

            const todoId = "test-todo-id";
            await deleteTodo(todoId);

            expect(doc).toHaveBeenCalledWith(expect.anything(), "todos", todoId);
            expect(deleteDoc).toHaveBeenCalledWith("todo-doc-ref");
        });

        it("エラーが発生した場合、例外が伝播すること", async () => {
            doc.mockReturnValue("todo-doc-ref");
            deleteDoc.mockRejectedValue(new Error("削除エラー"));

            await expect(deleteTodo("test-todo-id")).rejects.toThrow("削除エラー");
        });
    });
}); 