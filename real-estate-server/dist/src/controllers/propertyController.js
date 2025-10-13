"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = exports.getPropertyById = exports.getProperties = void 0;
const client_1 = require("@prisma/client");
const wkt_1 = require("@terraformer/wkt");
const prisma = new client_1.PrismaClient();
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { favoriteIds, priceMin, priceMax, beds, baths, propertyType, squareFeetMin, squareFeetMax, amenities, availableFrom, latitude, longitude, } = req.query;
        let whereConditions = [];
        if (favoriteIds) {
            const favoriteIdsArray = favoriteIds.split(",").map(Number);
            whereConditions.push(client_1.Prisma.sql `p.id IN (${client_1.Prisma.join(favoriteIdsArray)})`);
        }
        if (priceMin) {
            whereConditions.push(client_1.Prisma.sql `p."pricePerMonth" >= ${Number(priceMin)}`);
        }
        if (priceMax) {
            whereConditions.push(client_1.Prisma.sql `p."pricePerMonth" <= ${Number(priceMax)}`);
        }
        if (beds && beds !== "any") {
            whereConditions.push(client_1.Prisma.sql `p.beds = ${Number(beds)}`);
        }
        if (baths && baths !== "any") {
            whereConditions.push(client_1.Prisma.sql `p.baths = ${Number(baths)}`);
        }
        if (squareFeetMin) {
            whereConditions.push(client_1.Prisma.sql `p."squareFeet" >= ${Number(squareFeetMin)}`);
        }
        if (squareFeetMax) {
            whereConditions.push(client_1.Prisma.sql `p."squareFeet" <= ${Number(squareFeetMax)}`);
        }
        if (propertyType && propertyType !== "any") {
            whereConditions.push(client_1.Prisma.sql `p."propertyType" = ${propertyType}::"PropertyType"`);
        }
        if (amenities) {
            const amenitiesArray = amenities.split(",");
            whereConditions.push(client_1.Prisma.sql `p.amenitiesArray @> ${amenitiesArray}`);
        }
        if (availableFrom && availableFrom !== "any") {
            const availableFromDate = typeof availableFrom === "string" ? availableFrom : null;
            if (availableFromDate) {
                const date = new Date(availableFromDate);
                if (!isNaN(date.getTime())) {
                    whereConditions.push(client_1.Prisma.sql `EXISTS (
                    SELECT 1 FROM "Lease" l
                    WHERE l."propertyId" = p.id
                    AND l."startdate" <= ${date.toISOString()}
                )`);
                }
            }
        }
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
            const radiusInKm = 1000;
            const degrees = radiusInKm / 111; // Roughly 111 km per degree latitude
            whereConditions.push(client_1.Prisma.sql `ST_DWithin(
            l.coordinates::geometry,
            ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326), ${degrees}
        )`);
        }
        const completeQuery = client_1.Prisma.sql `
        SELECT
            p.*,
            json_build_object(
                'id', l.id,
                'address', l.address,
                'city', l.city,
                'state', l.state,
                'country', l.country,
                'postalCode', l."postalCode",
                'coordinates', json_build_object(
                    'latitude', ST_Y(l.coordinates::geometry),
                    'longitude', ST_X(l.coordinates::geometry)
            )
            )as location
        FROM "Property" p
        JOIN "Location" l ON p."locationId" = l.id
        ${whereConditions.length
            ? client_1.Prisma.sql `WHERE ${client_1.Prisma.join(whereConditions, " AND ")}`
            : client_1.Prisma.empty}
        `;
        const properties = yield prisma.$queryRaw(completeQuery);
        res.json(properties);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving properties: ${error.message}` });
    }
});
exports.getProperties = getProperties;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const property = yield prisma.property.findUnique({
            where: { id: Number(id) },
            include: { location: true },
        });
        if (property) {
            const coordinates = yield prisma.$queryRaw `
        SELECT ST_AsText(location.coordinates) as coordinates from "Location" where id = ${property.location.id}`;
            const geoJSON = (0, wkt_1.wktToGeoJSON)(((_a = coordinates[0]) === null || _a === void 0 ? void 0 : _a.coordinates) || "");
            const longitude = geoJSON.coordinates[0];
            const latitude = geoJSON.coordinates[1];
            const propertyWithCoordinates = Object.assign(Object.assign({}, property), { location: Object.assign(Object.assign({}, property.location), { coordinates: { latitude, longitude } }) });
            res.json(propertyWithCoordinates);
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving properties: ${error.message}` });
    }
});
exports.getPropertyById = getPropertyById;
const createProperty = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.createProperty = createProperty;
