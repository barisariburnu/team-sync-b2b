import { Router } from "express";
import { createWorkspaceController, getAllWorkpacesUserIsMemberController, getWorkspaceByIdController, getWorkspaceMembersController } from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);

workspaceRoutes.get("/all", getAllWorkpacesUserIsMemberController);

workspaceRoutes.get("/members/:id", getWorkspaceMembersController);

workspaceRoutes.get("/:id", getWorkspaceByIdController);

export default workspaceRoutes;


