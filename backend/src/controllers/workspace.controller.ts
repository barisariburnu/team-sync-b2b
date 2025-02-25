import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { HTTP_STATUS } from "../config/http.config";
import { createWorkspaceService, getAllWorkpacesUserIsMemberService, getWorkspaceByIdService, getWorkspaceMembersService } from "../services/workspace.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";

export const createWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;
    const { workspace } = await createWorkspaceService(userId, body);

    return res.status(HTTP_STATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace,
    });
});

export const getAllWorkpacesUserIsMemberController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaces = await getAllWorkpacesUserIsMemberService(userId);

    return res.status(HTTP_STATUS.OK).json({
        workspaces,
    });
});

export const getWorkspaceByIdController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    await getMemberRoleInWorkspace(userId, workspaceId);
    
    const {workspace} = await getWorkspaceByIdService(workspaceId);

    return res.status(HTTP_STATUS.OK).json({
        message: "Workspace fethed successfully",
        workspace,
    });
});

export const getWorkspaceMembersController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    return res.status(HTTP_STATUS.OK).json({
        message: "Workspace members retrieved successfully",
        members,
        roles,
    });
});