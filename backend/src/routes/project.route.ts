import { Router } from "express";
import { createProjectController, getAllProjectsInWorkspaceController } from "../controllers/project.controller";

const ProjectRoutes = Router();

ProjectRoutes.post("/workspace/:workspaceId/create", createProjectController);

ProjectRoutes.get("/workspace/:workspaceId/all", getAllProjectsInWorkspaceController);

export default ProjectRoutes;