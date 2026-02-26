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

async function main() {
  const passwordHash = await hash("password123", 10);

const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const dispatcher = await prisma.user.upsert({
    where: { email: "dispatcher@example.com" },
    update: {},
    create: {
      name: "Dispatcher",
      email: "dispatcher@example.com",
      password: passwordHash,
      role: "DISPATCHER",
    },
  });

  const driver = await prisma.user.upsert({
    where: { email: "driver@example.com" },
    update: {},
    create: {
      name: "Driver",
      email: "driver@example.com",
      password: passwordHash,
      role: "DRIVER",
    },
  });

  const area = await prisma.area.upsert({
    where: { name: "Central Area" },
    update: {},
    create: {
      name: "Central Area",
      description: "Default service area",
    },
  });

  const truck = await prisma.truck.upsert({
    where: { code: "TRUCK-1" },
    update: {},
    create: {
      code: "TRUCK-1",
      plateNumber: "ABC-1234",
      capacityKg: 5000,
      status: "ACTIVE",
      currentAreaId: area.id,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const route = await prisma.route.create({
    data: {
      name: "Morning Route - Central",
      scheduledDate: today,
      status: "PLANNED",
      truckId: truck.id,
      areaId: area.id,
      driverId: driver.id,
      stops: {
        create: [
          {
            sequence: 1,
            name: "Market Street",
            address: "Market St.",
            expectedVolumeKg: 500,
          },
          {
            sequence: 2,
            name: "River Side",
            address: "Riverside Rd.",
            expectedVolumeKg: 700,
          },
          {
            sequence: 3,
            name: "Hilltop",
            address: "Hilltop Ave.",
            expectedVolumeKg: 600,
          },
        ],
      },
    },
    include: {
      stops: true,
    },
  });

  // Optionally seed one completed pickup for demo
  const firstStop = route.stops[0];
  if (firstStop) {
    await prisma.pickupLog.create({
      data: {
        routeId: route.id,
        routeStopId: firstStop.id,
        completedById: driver.id,
        completedAt: new Date(),
        actualVolumeKg: 480,
        notes: "Demo pickup",
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed data created:");
  // eslint-disable-next-line no-console
  console.log(`  Admin: ${admin.email} / password123`);
  // eslint-disable-next-line no-console
  console.log(`  Dispatcher: ${dispatcher.email} / password123`);
  // eslint-disable-next-line no-console
  console.log(`  Driver: ${driver.email} / password123`);
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

