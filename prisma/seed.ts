import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

// Socorro, Surigao del Norte - 14 barangays (4-6 near center are collection areas)
const SOCORRO_BARANGAYS = [
  { name: "Albino Taruc", description: "Poblacion area, Socorro" },
  { name: "Del Pilar", description: "Barangay Del Pilar, Socorro" },
  { name: "Helene", description: "Barangay Helene, Socorro" },
  { name: "Honrado", description: "Barangay Honrado, Socorro" },
  { name: "Navarro", description: "Barangay Navarro, Socorro" },
  { name: "Nueva Estrella", description: "Barangay Nueva Estrella, Socorro" },
  { name: "Pamosaingan", description: "Barangay Pamosaingan, Socorro" },
  { name: "Rizal", description: "Barangay Rizal, Socorro" },
  { name: "Salog", description: "Barangay Salog, Socorro" },
  { name: "San Roque", description: "Barangay San Roque, Socorro" },
  { name: "Santa Cruz", description: "Barangay Santa Cruz, Socorro" },
  { name: "Sering", description: "Barangay Sering, Socorro" },
  { name: "Songkoy", description: "Barangay Songkoy, Socorro" },
  { name: "Sudlon", description: "Barangay Sudlon, Socorro" },
];

// Barangays near center with garbage collection (4-6 areas)
const COLLECTION_BARANGAYS = [
  "Albino Taruc",
  "Del Pilar",
  "Navarro",
  "Rizal",
  "Songkoy",
];

async function main() {
  const passwordHash = await hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@socorro.gov.ph" },
    update: {},
    create: {
      name: "Municipal Admin",
      email: "admin@socorro.gov.ph",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const dispatcher = await prisma.user.upsert({
    where: { email: "dispatcher@socorro.gov.ph" },
    update: {},
    create: {
      name: "Socorro Dispatcher",
      email: "dispatcher@socorro.gov.ph",
      password: passwordHash,
      role: "DISPATCHER",
    },
  });

  const driver1 = await prisma.user.upsert({
    where: { email: "driver1@socorro.gov.ph" },
    update: {},
    create: {
      name: "Juan Dela Cruz",
      email: "driver1@socorro.gov.ph",
      password: passwordHash,
      role: "DRIVER",
    },
  });

  const driver2 = await prisma.user.upsert({
    where: { email: "driver2@socorro.gov.ph" },
    update: {},
    create: {
      name: "Pedro Santos",
      email: "driver2@socorro.gov.ph",
      password: passwordHash,
      role: "DRIVER",
    },
  });

  // Create all Socorro barangays as areas
  const barangays: Record<string, { id: string }> = {};
  for (const b of SOCORRO_BARANGAYS) {
    const area = await prisma.area.upsert({
      where: { name: b.name },
      update: { description: b.description },
      create: {
        name: b.name,
        description: b.description,
      },
    });
    barangays[b.name] = { id: area.id };
  }

  // Create trucks for Socorro LGU
  const truck1 = await prisma.truck.upsert({
    where: { code: "SOCORRO-01" },
    update: {},
    create: {
      code: "SOCORRO-01",
      plateNumber: "SUR 1234",
      capacityKg: 5000,
      status: "ACTIVE",
      currentAreaId: barangays["Albino Taruc"]?.id,
    },
  });

  const truck2 = await prisma.truck.upsert({
    where: { code: "SOCORRO-02" },
    update: {},
    create: {
      code: "SOCORRO-02",
      plateNumber: "SUR 5678",
      capacityKg: 5000,
      status: "ACTIVE",
      currentAreaId: barangays["Navarro"]?.id,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Skip route creation if routes already exist for today (idempotent re-seed)
  const existingToday = await prisma.route.count({
    where: {
      scheduledDate: { gte: today, lt: new Date(today.getTime() + 86400000) },
    },
  });
  if (existingToday > 0) {
    // eslint-disable-next-line no-console
    console.log("  Routes for today already exist, skipping route creation.");
  } else {
    // Create sample routes for collection barangays (today)
    const routeNames = [
    { barangay: "Albino Taruc", name: "Albino Taruc - Morning Route" },
    { barangay: "Del Pilar", name: "Del Pilar - Morning Route" },
    { barangay: "Navarro", name: "Navarro - Morning Route" },
    { barangay: "Rizal", name: "Rizal - Morning Route" },
    { barangay: "Songkoy", name: "Songkoy - Morning Route" },
    ];

    for (let i = 0; i < routeNames.length; i++) {
      const { barangay, name } = routeNames[i];
      const areaId = barangays[barangay]?.id;
      if (!areaId) continue;

      const truck = i % 2 === 0 ? truck1 : truck2;
      const driver = i % 2 === 0 ? driver1 : driver2;

      const route = await prisma.route.create({
        data: {
          name,
          scheduledDate: today,
          status: i === 0 ? "IN_PROGRESS" : "PLANNED",
          truckId: truck.id,
          areaId,
          driverId: driver.id,
          stops: {
            create: [
              {
                sequence: 1,
                name: `${barangay} - Zone A`,
                address: `Brgy. ${barangay}, Socorro`,
                type: "RESIDENTIAL",
                expectedVolumeKg: 300,
              },
              {
                sequence: 2,
                name: `${barangay} - Zone B`,
                address: `Brgy. ${barangay}, Socorro`,
                type: "RESIDENTIAL",
                expectedVolumeKg: 400,
              },
              {
                sequence: 3,
                name: `${barangay} - Market Area`,
                address: `Brgy. ${barangay}, Socorro`,
                type: "COMMERCIAL",
                expectedVolumeKg: 500,
              },
            ],
          },
        },
        include: { stops: true },
      });

      // Demo: first route has one completed pickup
      if (i === 0 && route.stops[0]) {
        await prisma.pickupLog.create({
          data: {
            routeId: route.id,
            routeStopId: route.stops[0].id,
            completedById: driver.id,
            completedAt: new Date(),
            actualVolumeKg: 280,
            notes: "Regular collection - Socorro LGU",
          },
        });
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log("Socorro Garbage Tracking - Seed data created:");
  // eslint-disable-next-line no-console
  console.log("  Barangays:", SOCORRO_BARANGAYS.length);
  // eslint-disable-next-line no-console
  console.log("  Collection areas:", COLLECTION_BARANGAYS.length);
  // eslint-disable-next-line no-console
  console.log("  Admin: admin@socorro.gov.ph / password123");
  // eslint-disable-next-line no-console
  console.log("  Dispatcher: dispatcher@socorro.gov.ph / password123");
  // eslint-disable-next-line no-console
  console.log("  Driver 1: driver1@socorro.gov.ph / password123");
  // eslint-disable-next-line no-console
  console.log("  Driver 2: driver2@socorro.gov.ph / password123");
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
