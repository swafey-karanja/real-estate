import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      latitude,
      longitude,
    } = req.query;

    let whereConditions: Prisma.Sql[] = [];

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);
      whereConditions.push(
        Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
      );
    }

    if (priceMin) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
      );
    }

    if (priceMax) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
      );
    }

    if (beds && beds !== "any") {
      whereConditions.push(Prisma.sql`p.beds = ${Number(beds)}`);
    }

    if (baths && baths !== "any") {
      whereConditions.push(Prisma.sql`p.baths = ${Number(baths)}`);
    }

    if (squareFeetMin) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
      );
    }

    if (squareFeetMax) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
      );
    }

    if (propertyType && propertyType !== "any") {
      whereConditions.push(
        Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
      );
    }

    if (amenities) {
      const amenitiesArray = (amenities as string).split(",");
      whereConditions.push(Prisma.sql`p.amenitiesArray @> ${amenitiesArray}`);
    }

    if (availableFrom && availableFrom !== "any") {
      const availableFromDate =
        typeof availableFrom === "string" ? availableFrom : null;
      if (availableFromDate) {
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(Prisma.sql`EXISTS (
                    SELECT 1 FROM "Lease" l
                    WHERE l."propertyId" = p.id
                    AND l."startdate" <= ${date.toISOString()}
                )`);
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lon = parseFloat(longitude as string);
      const radiusInKm = 1000;
      const degrees = radiusInKm / 111; // Roughly 111 km per degree latitude

      whereConditions.push(Prisma.sql`ST_DWithin(
            l.coordinates::geometry,
            ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326), ${degrees}
        )`);
    }

    const completeQuery = Prisma.sql`
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
        ${
          whereConditions.length
            ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
            : Prisma.empty
        }
        `;

    const properties = await prisma.$queryRaw(completeQuery);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const getPropertyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { location: true },
    });

    if (property) {
      const coordinates: { coordinates: string }[] = await prisma.$queryRaw`
        SELECT ST_AsText(location.coordinates) as coordinates from "Location" where id = ${property.location.id}`;

      const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
      const longitude = geoJSON.coordinates[0];
      const latitude = geoJSON.coordinates[1];

      const propertyWithCoordinates = {
        ...property,
        location: {
          ...property.location,
          coordinates: { latitude, longitude },
        },
      };
      res.json(propertyWithCoordinates);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const createProperty = async () => {};
