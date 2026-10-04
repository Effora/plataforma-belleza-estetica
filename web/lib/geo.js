/** Distancia en km (Haversine). */
export const distanceKm = (aLat, aLng, bLat, bLng) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const x = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

export const withDistance = (items, here) => {
  if (!here) {
    return items.map((s) => ({ ...s, dist: s.km }));
  }
  return items
    .map((s) => ({
      ...s,
      dist: Math.round(distanceKm(here[0], here[1], s.ll[0], s.ll[1]) * 10) / 10,
    }))
    .sort((a, b) => a.dist - b.dist);
};

export const DEFAULT_HERE = [4.65, -74.065]; // Bogotá centro (fallback demo)
