import express from "express";
import {
  createManager,
  getManager,
  updateManager,
} from "../controllers/managerController";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.get("/", createManager);

export default router;
