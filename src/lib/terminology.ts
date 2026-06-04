/**
 * User-facing labels for route collection locations.
 * "Basurahan" is the familiar Visayan/Cebuano term for a garbage collection
 * point or dumpsite — clearer than "stop" for LGU staff and residents in Socorro.
 */
export const BASURAHAN = {
  one: "Basurahan",
  many: "Mga basurahan",
  withNumber: (sequence: number) => `Basurahan #${sequence}`,
  unnamed: "Basurahan",
  helper: "Garbage collection point (basurahan)",

  add: "Add basurahan",
  list: "Basurahan list",
  listAndMap: "Basurahan list & map",
  onRoute: "Basurahan on route",
  andPickups: "Basurahan & pickups",
  setLocation: "Set basurahan on map",
  setLocationDialogTitle: "Set basurahan location",

  total: "Total basurahan",
  completed: "Completed",
  missed: "Missed",
  pending: "Pending",
  missedCount: "Missed basurahan",
  missedStopsAnalytics: "Missed basurahan",

  progress: (done: number, total: number) =>
    `${done}/${total} basurahan done`,
  completedOf: (done: number, total: number) =>
    `${done} of ${total} basurahan completed`,

  markCompleted: "Mark completed",
  markMissed: "Mark missed",
  markMissedTitle: "Mark missed basurahan",
  logPickup: "Log pickup",
  confirmMissed: "Confirm missed",

  emptyOnRoute: "This route has no basurahan yet.",
  emptyCoordinates:
    "No basurahan coordinates available. Add latitude/longitude when planning the route to see locations on the map.",
  emptyPublicMap:
    "Basurahan locations for this route are not on the map yet. The LGU adds map points when coordinates are recorded for each basurahan.",
  mapLegend:
    "Basurahan on map (green = collected, gray = pending)",
  mapHint:
    "Basurahan with coordinates appear on the map (green = collected, gray = pending). Approximate locations within the municipality.",

  tapToLog:
    "Tap a basurahan to mark it as collected or missed.",
  scheduledForDay: "scheduled for that day",
  viewWithMap: "Choose one barangay to view route, basurahan, and map.",
} as const;
