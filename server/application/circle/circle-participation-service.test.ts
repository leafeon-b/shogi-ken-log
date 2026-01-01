import { beforeEach, describe, expect, test, vi } from "vitest";
import { createCircleParticipationService } from "@/server/application/circle/circle-participation-service";
import { createAccessService } from "@/server/application/authz/access-service";
import type { CircleParticipationRepository } from "@/server/domain/models/circle/circle-participation-repository";
import type { CircleRepository } from "@/server/domain/models/circle/circle-repository";
import { circleId, userId } from "@/server/domain/common/ids";

const circleParticipationRepository = {
  listParticipants: vi.fn(),
  addParticipant: vi.fn(),
  updateParticipantRole: vi.fn(),
  removeParticipant: vi.fn(),
} satisfies CircleParticipationRepository;

const circleRepository = {
  findById: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} satisfies CircleRepository;

const accessService = {
  canViewCircle: vi.fn(),
  canAddCircleMember: vi.fn(),
  canChangeCircleMemberRole: vi.fn(),
  canTransferCircleOwnership: vi.fn(),
  canRemoveCircleMember: vi.fn(),
} as ReturnType<typeof createAccessService>;

const service = createCircleParticipationService({
  circleParticipationRepository,
  circleRepository,
  accessService,
});

const baseCircle = () => ({
  id: circleId("circle-1"),
  name: "Circle One",
  createdAt: new Date(),
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(circleRepository.findById).mockResolvedValue(baseCircle());
  vi.mocked(accessService.canViewCircle).mockResolvedValue(true);
  vi.mocked(accessService.canAddCircleMember).mockResolvedValue(true);
  vi.mocked(accessService.canChangeCircleMemberRole).mockResolvedValue(true);
  vi.mocked(accessService.canTransferCircleOwnership).mockResolvedValue(true);
  vi.mocked(accessService.canRemoveCircleMember).mockResolvedValue(true);
});

describe("Circle 参加者サービス", () => {
  test("listParticipants は一覧を返す", async () => {
    vi.mocked(
      circleParticipationRepository.listParticipants,
    ).mockResolvedValueOnce([
      { userId: userId("user-1"), role: "CircleOwner" },
    ]);

    const result = await service.listParticipants({
      actorId: "user-actor",
      circleId: circleId("circle-1"),
    });

    expect(circleParticipationRepository.listParticipants).toHaveBeenCalledWith(
      circleId("circle-1"),
    );
    expect(result).toEqual([{ userId: userId("user-1"), role: "CircleOwner" }]);
  });

  test("addParticipant は Owner がいない状態で Member を拒否する", async () => {
    vi.mocked(
      circleParticipationRepository.listParticipants,
    ).mockResolvedValueOnce([]);

    await expect(
      service.addParticipant({
        actorId: "user-actor",
        circleId: circleId("circle-1"),
        userId: userId("user-1"),
        role: "CircleMember",
      }),
    ).rejects.toThrow("Circle must have exactly one owner");

    expect(circleParticipationRepository.addParticipant).not.toHaveBeenCalled();
  });

  test("changeParticipantRole は Owner への変更を拒否する", async () => {
    await expect(
      service.changeParticipantRole({
        actorId: "user-actor",
        circleId: circleId("circle-1"),
        userId: userId("user-1"),
        role: "CircleOwner",
      }),
    ).rejects.toThrow("Use transferOwnership to assign owner");
  });

  test("transferOwnership は Owner を移譲する", async () => {
    vi.mocked(
      circleParticipationRepository.listParticipants,
    ).mockResolvedValueOnce([
      { userId: userId("user-1"), role: "CircleOwner" },
      { userId: userId("user-2"), role: "CircleMember" },
    ]);

    await service.transferOwnership({
      actorId: "user-actor",
      circleId: circleId("circle-1"),
      fromUserId: userId("user-1"),
      toUserId: userId("user-2"),
    });

    expect(
      circleParticipationRepository.updateParticipantRole,
    ).toHaveBeenCalledWith(
      circleId("circle-1"),
      userId("user-1"),
      "CircleManager",
    );
    expect(
      circleParticipationRepository.updateParticipantRole,
    ).toHaveBeenCalledWith(
      circleId("circle-1"),
      userId("user-2"),
      "CircleOwner",
    );
  });

  test("removeParticipant は Owner の削除を拒否する", async () => {
    vi.mocked(
      circleParticipationRepository.listParticipants,
    ).mockResolvedValueOnce([
      { userId: userId("user-1"), role: "CircleOwner" },
    ]);

    await expect(
      service.removeParticipant({
        actorId: "user-actor",
        circleId: circleId("circle-1"),
        userId: userId("user-1"),
      }),
    ).rejects.toThrow("Use transferOwnership to remove owner");

    expect(
      circleParticipationRepository.removeParticipant,
    ).not.toHaveBeenCalled();
  });
});
