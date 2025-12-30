import { randomUUID } from "crypto";
import { circleId } from "@/server/domain/common/ids";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import { handleError, json, parseJson, requireString } from "@/app/api/_helpers";

export async function POST(request: Request) {
  try {
    const actorId = await getSessionUserId();
    const body = await parseJson<{ name?: unknown }>(request);
    const name = requireString(body.name, "name");
    const { circleService } = getServiceContainer();
    const circle = await circleService.createCircle({
      actorId,
      id: circleId(randomUUID()),
      name,
    });

    return json(circle, 201);
  } catch (error) {
    return handleError(error);
  }
}
