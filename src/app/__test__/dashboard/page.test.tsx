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

jest.mock("notistack", () => ({
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: jest.fn(),
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

  describe("認証状態に応じたテスト", () => {
    it("ユーザーがログインしていない場合、nullを返すこと", () => {
      useAuthStateMock.mockReturnValue([null, false, null]);
      const { container } = render(<Dashboard />);
      expect(
        container.querySelector(".MuiCircularProgress-root")
      ).toBeInTheDocument();
    });

    it("Firebase認証のロード中の場合、ローディング表示されること", () => {
      useAuthStateMock.mockReturnValue([null, true, null]);
      const { container } = render(<Dashboard />);
      expect(
        container.querySelector(".MuiCircularProgress-root")
      ).toBeInTheDocument();
    });

    it("Firebase認証でエラーがある場合、CircularProgressが表示されること", () => {
      useAuthStateMock.mockReturnValue([null, false, new Error("認証エラー")]);
      const { container } = render(<Dashboard />);
      expect(
        container.querySelector(".MuiCircularProgress-root")
      ).toBeInTheDocument();
    });
  });

  describe("ログイン済みユーザーのデータ表示テスト", () => {
    beforeEach(() => {
      useAuthStateMock.mockReturnValue([mockUser, false, null]);
    });

    it("Todoデータが正常に取得された場合、TodoListが表示されること", () => {
      useSWRMock.mockImplementation(() => ({
        data: mockTodoList,
        error: null,
        isLoading: false,
      }));

      render(<Dashboard />);

      expect(
        screen.getByText(`${mockUser.email}でログイン中。`)
      ).toBeInTheDocument();

      mockTodoList.forEach((todo) => {
        expect(screen.getByText(todo.title)).toBeInTheDocument();
      });
    });

    it("Firestoreからのデータ読み込み中は、CircularProgressが表示されること", () => {
      useSWRMock.mockImplementation(() => ({
        data: null,
        error: null,
        isLoading: true,
      }));

      const { container } = render(<Dashboard />);
      expect(
        container.querySelector(".MuiCircularProgress-root")
      ).toBeInTheDocument();
    });

    it("Firestoreからのデータ取得でエラーが発生した場合、CircularProgressが表示されること", () => {
      useSWRMock.mockImplementation(() => ({
        data: null,
        error: new Error("データ取得エラー"),
        isLoading: false,
      }));

      const { container } = render(<Dashboard />);
      expect(
        container.querySelector(".MuiCircularProgress-root")
      ).toBeInTheDocument();
    });
  });
});
