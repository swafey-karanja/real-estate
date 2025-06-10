import express from "express";
import { createManager, getManager } from "../controllers/managerController";

const router = express.Router();

router.get("/:cognitoId", getManager);
router.get("/", createManager);

export default router;
