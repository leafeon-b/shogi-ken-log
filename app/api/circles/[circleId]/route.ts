import { circleId } from "@/server/domain/common/ids";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import {
  handleError,
  json,
  parseJson,
  requireString,
} from "@/app/api/_helpers";

export async function GET(
  _request: Request,
  context: { params: Promise<{ circleId: string }> },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const circleIdValue = requireString(params.circleId, "circleId");
    const { circleService } = getServiceContainer();
    const circle = await circleService.getCircle(
      actorId,
      circleId(circleIdValue),
    );

    if (!circle) {
      return handleError(new Error("Circle not found"));
    }

    return json(circle);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ circleId: string }> },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const circleIdValue = requireString(params.circleId, "circleId");
    const body = await parseJson<{ name?: unknown }>(request);
    const name = requireString(body.name, "name");
    const { circleService } = getServiceContainer();
    const circle = await circleService.renameCircle(
      actorId,
      circleId(circleIdValue),
      name,
    );

    return json(circle);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ circleId: string }> },
) {
  try {
    const actorId = await getSessionUserId();
    const { circleService } = getServiceContainer();
    const params = await context.params;
    const circleIdValue = requireString(params.circleId, "circleId");
    const id = circleId(circleIdValue);
    await circleService.deleteCircle(actorId, id);
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
