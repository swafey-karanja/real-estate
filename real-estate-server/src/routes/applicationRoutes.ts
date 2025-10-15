import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createApplication,
  listApplications,
  updateApplicationStatus,
} from "../controllers/applicationControllers";

const router = express.Router();

router.post("/", authMiddleware(["tenant"]), createApplication);
router.get("/", authMiddleware(["manager", "tenant"]), listApplications);
router.put("/:id/status", authMiddleware(["manager"]), updateApplicationStatus);

export default router;
