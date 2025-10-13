import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getProperties,
  getPropertyById,
  createProperty,
} from "../controllers/propertyController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  createProperty
);

export default router;
