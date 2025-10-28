import express from "express";
import {
  getTenant,
  createTenant,
  updateTenant,
  getTenantProperties,
  addToFavoriteProperties,
  removeFromFavoriteProperties,
} from "../controllers/tenantControllers";

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.post("/", createTenant);
router.get("/:cognitoId/current-properties", getTenantProperties);
router.post("/:cognitoId/favorites/:propertyId", addToFavoriteProperties);
router.delete(
  "/:cognitoId/favorites/:propertyId",
  removeFromFavoriteProperties
);

export default router;
