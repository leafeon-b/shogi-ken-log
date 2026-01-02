import { getSessionUserId } from "@/server/application/auth/session";
import { getServiceContainer } from "@/server/application/service-container";

export const createContext = async () => {
  const actorId = await getSessionUserId();
  const services = getServiceContainer();

  return {
    actorId,
    ...services,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
