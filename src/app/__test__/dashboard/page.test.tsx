import { render, screen } from "@testing-library/react";
import Dashboard from "@/app/dashboard/page";
import { mockUser } from "@/app/__test__/mocks/firebase-mocks";
import { mockTodoList } from "@/app/__test__/mocks/todo-mocks";

jest.mock("@/app/lib/firebase/firebaseservice", () => ({
  fetchUserTodo: jest.fn(),
}));

jest.mock("@/app/lib/firebase/firebase", () => ({
  auth: {},
  db: {},
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("swr", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      data: null,
      error: null,
      isLoading: false,
    })),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe("Dashboardページのテスト", () => {
  const useAuthStateMock = require("react-firebase-hooks/auth").useAuthState;
  const useSWRMock = require("swr").default;

  beforeEach(() => {
    useAuthStateMock.mockReset();
    useSWRMock.mockReset();
    useSWRMock.mockImplementation(() => ({
      data: null,
      error: null,
      isLoading: false,
    }));
  });

  it("ユーザーがログインしていない場合、nullを返すこと", () => {
    useAuthStateMock.mockReturnValue([null, false, null]);
    const { container } = render(<Dashboard />);
    expect(container.firstChild).toBeNull();
  });

  it("Firebase認証のロード中の場合、ローディングメッセージが表示されること", () => {
    useAuthStateMock.mockReturnValue([null, true, null]);
    render(<Dashboard />);
    expect(screen.getByText("ロード中...")).toBeInTheDocument();
  });

  it("Firebase認証でエラーがある場合、エラーメッセージが表示されること", () => {
    useAuthStateMock.mockReturnValue([null, false, new Error("認証エラー")]);
    render(<Dashboard />);
    expect(
      screen.getByText("エラーが発生しました。もう一度お試しください。")
    ).toBeInTheDocument();
  });

  it("Todoデータが正常に取得された場合、TodoListが表示されること", () => {
    useAuthStateMock.mockReturnValue([mockUser, false, null]);
    useSWRMock.mockImplementation(() => ({
      data: mockTodoList,
      error: null,
      isLoading: false,
    }));

    render(<Dashboard />);

    expect(
      screen.getByText(`ようこそ, ${mockUser.email}!`)
    ).toBeInTheDocument();

    mockTodoList.forEach((todo) => {
      expect(screen.getByText(todo.title)).toBeInTheDocument();
    });
  });

  it("Firestoreからのデータ読み込み中は、ローディングメッセージが表示されること", () => {
    useAuthStateMock.mockReturnValue([mockUser, false, null]);
    useSWRMock.mockImplementation(() => ({
      data: null,
      error: null,
      isLoading: true,
    }));

    render(<Dashboard />);

    expect(screen.getByText("データを読み込み中...")).toBeInTheDocument();
  });

  it("Firestoreからのデータ取得でエラーが発生した場合、エラーメッセージが表示されること", () => {
    useAuthStateMock.mockReturnValue([mockUser, false, null]);
    useSWRMock.mockImplementation(() => ({
      data: null,
      error: new Error("データ取得エラー"),
      isLoading: false,
    }));

    render(<Dashboard />);

    expect(screen.getByText("データ取得エラー")).toBeInTheDocument();
  });
});
