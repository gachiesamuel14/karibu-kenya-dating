function toRad(v) { return (v * Math.PI) / 180; }

function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)));
}

function requestLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

function nearestCounty(coords) {
  if (!coords) return "Nairobi";
  let best = "Nairobi";
  let bestD = Infinity;
  Object.entries(COUNTY_COORDS).forEach(([name, pair]) => {
    const d = haversineKm(coords, { lat: pair[0], lng: pair[1] });
    if (d < bestD) { bestD = d; best = name; }
  });
  return best;
}
