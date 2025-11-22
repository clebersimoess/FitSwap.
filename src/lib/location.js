export async function getUserLocation(options = { enableHighAccuracy: true }) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err),
      options
    );
  });
}

export async function reverseGeocode(lat, lng) {
  const url = https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)};
  const res = await fetch(url, { headers: { 'User-Agent': 'FitSwapApp/1.0 (contact@fitswap.org)' } });
  if (!res.ok) throw new Error('Reverse geocode failed');
  const data = await res.json();
  return data.display_name || ${data.address?.city || data.address?.town || data.address?.village || ''}.trim();
}
