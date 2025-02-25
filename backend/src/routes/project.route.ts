import { Router } from "express";
import { createProjectController, getAllProjectsInWorkspaceController, getProjectAnalyticsController, getProjectByIdAndWorkspaceIdController } from "../controllers/project.controller";

const ProjectRoutes = Router();

ProjectRoutes.post("/workspace/:workspaceId/create", createProjectController);

ProjectRoutes.get("/workspace/:workspaceId/all", getAllProjectsInWorkspaceController);

ProjectRoutes.get("/:id/workspace/:workspaceId/analytics", getProjectAnalyticsController);

ProjectRoutes.get("/:id/workspace/:workspaceId", getProjectByIdAndWorkspaceIdController);

export default ProjectRoutes;