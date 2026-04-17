// Socorro, Surigao del Norte — default for collection maps and location picking
export const SOCORRO_CENTER: [number, number] = [9.621, 125.964];
/** SouthWest, NorthEast — keeps picking panning within northern Mindanao */
export const SOCORRO_MAX_BOUNDS: [[number, number], [number, number]] = [
  [9.48, 125.78],
  [9.78, 126.12],
];

/** @deprecated Use SOCORRO_CENTER; kept as alias for route maps */
export const MAP_CENTER: [number, number] = SOCORRO_CENTER;
export const MAP_DEFAULT_ZOOM = 14;
