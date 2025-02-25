import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceSchema } from "../validation/workspace.validation";
import { HTTP_STATUS } from "../config/http.config";
import { createWorkspaceService } from "../services/workspace.service";

export const createWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;
    const { workspace } = await createWorkspaceService(userId, body);

    return res.status(HTTP_STATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace,
    });
});

