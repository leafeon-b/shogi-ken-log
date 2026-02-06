import type { SessionService } from "@/server/domain/services/auth/session-service";
import { UnauthorizedError } from "@/server/domain/common/errors";

export const createGetSession = (sessionService: SessionService) => {
  return () => sessionService.getSession();
};

export const createGetSessionUserId = (sessionService: SessionService) => {
  return async (): Promise<string> => {
    const session = await sessionService.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      throw new UnauthorizedError();
    }

    return userId;
  };
};
