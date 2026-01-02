import { z } from "zod";
import {
  CircleRole,
  CircleSessionRole,
} from "@/server/domain/services/authz/roles";

const circleRoleValues = [
  CircleRole.CircleOwner,
  CircleRole.CircleManager,
  CircleRole.CircleMember,
] as const;

export const circleRoleSchema = z.enum(circleRoleValues);
export type CircleRoleDto = z.infer<typeof circleRoleSchema>;

const circleSessionRoleValues = [
  CircleSessionRole.CircleSessionOwner,
  CircleSessionRole.CircleSessionManager,
  CircleSessionRole.CircleSessionMember,
] as const;

export const circleSessionRoleSchema = z.enum(circleSessionRoleValues);
export type CircleSessionRoleDto = z.infer<typeof circleSessionRoleSchema>;
