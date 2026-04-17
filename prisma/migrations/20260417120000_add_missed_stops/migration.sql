-- CreateTable
CREATE TABLE "missed_stops" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "routeStopId" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "missed_stops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "missed_stops_routeId_idx" ON "missed_stops"("routeId");

-- CreateIndex
CREATE INDEX "missed_stops_routeStopId_idx" ON "missed_stops"("routeStopId");

-- AddForeignKey
ALTER TABLE "missed_stops" ADD CONSTRAINT "missed_stops_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missed_stops" ADD CONSTRAINT "missed_stops_routeStopId_fkey" FOREIGN KEY ("routeStopId") REFERENCES "route_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missed_stops" ADD CONSTRAINT "missed_stops_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
