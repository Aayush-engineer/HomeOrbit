import { Request,Response } from "express";
import { PrismaClient,Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";



import { v2 as cloudinary } from 'cloudinary';
import { Location } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const getProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("i am on the properties route");
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

    console.log("property which i am searching req.body->",req.query);

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
      whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
    }

    if (baths && baths !== "any") {
      whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
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

    if (amenities && amenities !== "any") {
      const amenitiesArray = (amenities as string).split(",");
      whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
    }

    if (availableFrom && availableFrom !== "any") {
      const availableFromDate =
        typeof availableFrom === "string" ? availableFrom : null;
      if (availableFromDate) {
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(
            Prisma.sql`EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`
          );
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusInKilometers = 1000;
      const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

      whereConditions.push(
        Prisma.sql`ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`
      );
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
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${
        whereConditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
          : Prisma.empty
      }
    `;

    const properties = await prisma.$queryRaw(completeQuery);

    console.log("property i am geting after search",properties);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const getProperty = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const property = await prisma.property.findUnique({
            where: { id: Number(id)},
            include: {
                location: true,
            },
        });

        if (property) {
            const coordinates: { coordinates: string }[] =
              await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;
            const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
            const longitude = geoJSON.coordinates[0];
            const latitude = geoJSON.coordinates[1];

            const propertyWithCoordinates = {
                ...property,
                location: {
                ...property.location,
                coordinates: {
                    longitude,
                    latitude,
                },
                },
            };
            res.json(propertyWithCoordinates);
        }
    } catch (err: any) {
        res.status(500).json({ message: `Error retrieving property: ${err.message}` });
    }
};

export const createProperty = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        console.log("i am on the create propertyes");
        const files = req.files as Express.Multer.File[];
        console.log("the files was",files,req.body);

        const {
            address,
            city,
            state,
            country,
            postalCode,
            managerCognitoId,
            ...propertyData
        } = req.body;
        console.log("property which i am creating my req.body ->", req.body);

        const photoUrls = await Promise.all(
            files.map((file) => new Promise<string>((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'properties',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result?.secure_url || '');
                    }
                    );

                    stream.end(file.buffer); // send file buffer into the stream
                })
            )
        );

        const query = `${address}, ${city}, ${postalCode}, ${country}`;

        const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${process.env.OPENCAGE_API_KEY}`;

        const geocodingResponse = await axios.get(openCageUrl);
        const geoData = geocodingResponse.data;

        if (!geoData.results || !geoData.results.length) {
            console.warn("Geocoding failed — no coordinates returned");
            res.status(400).json({ message: "Unable to geocode the address" });
            return;
        }

        const { lat, lng } = geoData.results[0].geometry;
        const latitude = lat;
        const longitude = lng;

        console.log("property info which i am creating",address,city,state,country,postalCode,longitude,latitude);
        
        const [location] = await prisma.$queryRaw<Location[]>`
            INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
            VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
            RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
        `;  
        
        const newProperty = await prisma.property.create({
            data: {
                ...propertyData,
                photoUrls,
                locationId: location.id,
                managerCognitoId,
                amenities:
                typeof propertyData.amenities === "string"
                    ? propertyData.amenities.split(",")
                    : [],
                highlights:
                typeof propertyData.highlights === "string"
                    ? propertyData.highlights.split(",")
                    : [],
                isPetsAllowed: propertyData.isPetsAllowed === "true",
                isParkingIncluded: propertyData.isParkingIncluded === "true",
                pricePerMonth: parseFloat(propertyData.pricePerMonth),
                securityDeposit: parseFloat(propertyData.securityDeposit),
                applicationFee: parseFloat(propertyData.applicationFee),
                beds: parseInt(propertyData.beds),
                baths: parseFloat(propertyData.baths),
                squareFeet: parseInt(propertyData.squareFeet),
            },
            include: {
                location: true,
                manager: true,
            },
        });
        console.log("my new property i am creating", newProperty);
        res.status(201).json(newProperty);
    } catch(err: any) {
        console.error("CREATE PROPERTY ERROR:", err); 
        res.status(500).json({ message: `Error creating property: ${err.message}` });
    }
};

