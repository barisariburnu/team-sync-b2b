import { PermissionType } from "../enums/role.enum";
import { UnauthorizedException } from "./appError";
import { RolePermissions } from "./role-permission";

export const roleGuard = (role: keyof typeof RolePermissions, requiredPermissions: PermissionType[]) => {
    const rolePermissions = RolePermissions[role];

    // If the role doesn't exists or lacks required permissions, throw an error
    const hasPermission = requiredPermissions.every((permission) => rolePermissions.includes(permission));

    if (!hasPermission) {
        throw new UnauthorizedException("You do not have permission to perform this action");
    }
}