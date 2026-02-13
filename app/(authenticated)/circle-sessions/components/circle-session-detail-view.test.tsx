// @vitest-environment jsdom
import type { CircleSessionDetailViewModel } from "@/server/presentation/view-models/circle-session-detail";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CircleSessionDetailView } from "./circle-session-detail-view";

const pushMock = vi.fn();

vi.mock("@/lib/trpc/client", () => ({
  trpc: {
    circleSessions: {
      delete: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
          data: null,
          error: null,
        }),
      },
    },
    matches: {
      create: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
          data: null,
          error: null,
        }),
      },
      update: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
          data: null,
          error: null,
        }),
      },
      delete: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
          data: null,
          error: null,
        }),
      },
    },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

afterEach(() => {
  cleanup();
  pushMock.mockClear();
});

function buildDetail(
  overrides: Partial<CircleSessionDetailViewModel> = {},
): CircleSessionDetailViewModel {
  return {
    circleSessionId: "session-1",
    circleId: "circle-1",
    circleName: "テスト研究会",
    title: "第1回例会",
    dateTimeLabel: "2025-04-01 10:00〜18:00",
    locationLabel: null,
    memoText: null,
    sessionDateInput: "2025-04-01",
    startsAtInput: "2025-04-01T10:00",
    endsAtInput: "2025-04-01T18:00",
    viewerRole: "owner",
    canCreateCircleSession: false,
    canDeleteCircleSession: false,
    participations: [],
    matches: [],
    ...overrides,
  };
}

describe("CircleSessionDetailView 複製ボタン", () => {
  describe("表示条件", () => {
    it("canCreateCircleSession: true の場合、複製ボタンが表示される", () => {
      render(
        <CircleSessionDetailView
          detail={buildDetail({ canCreateCircleSession: true })}
        />,
      );

      expect(
        screen.getByRole("button", { name: /複製/ }),
      ).toBeDefined();
    });

    it("canCreateCircleSession: false の場合、複製ボタンが表示されない", () => {
      render(
        <CircleSessionDetailView
          detail={buildDetail({ canCreateCircleSession: false })}
        />,
      );

      expect(screen.queryByRole("button", { name: /複製/ })).toBeNull();
    });
  });

  describe("遷移先URL", () => {
    it("クリック時に正しいベースURLとパラメータで router.push が呼ばれる", async () => {
      const user = userEvent.setup();
      render(
        <CircleSessionDetailView
          detail={buildDetail({
            canCreateCircleSession: true,
            circleId: "circle-1",
            title: "第1回例会",
            startsAtInput: "2025-04-01T10:00",
            endsAtInput: "2025-04-01T18:00",
          })}
        />,
      );

      await user.click(screen.getByRole("button", { name: /複製/ }));

      expect(pushMock).toHaveBeenCalledOnce();
      const url = pushMock.mock.calls[0][0] as string;
      expect(url).toContain("/circles/circle-1/sessions/new");
      const params = new URLSearchParams(url.split("?")[1]);
      expect(params.get("title")).toBe("第1回例会");
      expect(params.get("startsAt")).toBe("2025-04-01T10:00");
      expect(params.get("endsAt")).toBe("2025-04-01T18:00");
      expect(params.has("location")).toBe(false);
      expect(params.has("note")).toBe(false);
    });

    it("locationLabel がある場合、location パラメータが含まれる", async () => {
      const user = userEvent.setup();
      render(
        <CircleSessionDetailView
          detail={buildDetail({
            canCreateCircleSession: true,
            locationLabel: "将棋会館",
          })}
        />,
      );

      await user.click(screen.getByRole("button", { name: /複製/ }));

      const url = pushMock.mock.calls[0][0] as string;
      const params = new URLSearchParams(url.split("?")[1]);
      expect(params.get("location")).toBe("将棋会館");
    });

    it("memoText がある場合、note パラメータが含まれる", async () => {
      const user = userEvent.setup();
      render(
        <CircleSessionDetailView
          detail={buildDetail({
            canCreateCircleSession: true,
            memoText: "持ち物: 将棋盤",
          })}
        />,
      );

      await user.click(screen.getByRole("button", { name: /複製/ }));

      const url = pushMock.mock.calls[0][0] as string;
      const params = new URLSearchParams(url.split("?")[1]);
      expect(params.get("note")).toBe("持ち物: 将棋盤");
    });

    it("locationLabel と memoText の両方がある場合、両パラメータが含まれる", async () => {
      const user = userEvent.setup();
      render(
        <CircleSessionDetailView
          detail={buildDetail({
            canCreateCircleSession: true,
            locationLabel: "将棋会館",
            memoText: "持ち物: 将棋盤",
          })}
        />,
      );

      await user.click(screen.getByRole("button", { name: /複製/ }));

      const url = pushMock.mock.calls[0][0] as string;
      const params = new URLSearchParams(url.split("?")[1]);
      expect(params.get("location")).toBe("将棋会館");
      expect(params.get("note")).toBe("持ち物: 将棋盤");
    });
  });
});
