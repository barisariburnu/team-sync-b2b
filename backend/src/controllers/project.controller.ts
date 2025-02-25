import { Request, Response } from "express";
import { createProjectService, getProjectsInWorkspaceService } from "../services/project.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createProjectSchema } from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";
import { HTTP_STATUS } from "../config/http.config";
import ProjectModel from "../models/project.model";

export const createProjectController = asyncHandler(async (req: Request, res: Response) => {
    const body = createProjectSchema.parse(req.body);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_PROJECT]);

    const { project } = await createProjectService(userId, workspaceId, body);

    return res.status(HTTP_STATUS.CREATED).json({
        message: "Project created successfully",
        project,
    });
});

export const getAllProjectsInWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
    const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber as string) : 1;

    const { projects, totalCount, totalPages, skip } = await getProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

    return res.status(HTTP_STATUS.OK).json({
        message: "Projects fetched successfully",
        projects,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages,
            skip,
            limit: pageSize,
        },
    });
});

