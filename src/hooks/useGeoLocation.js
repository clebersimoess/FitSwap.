import { useState, useEffect } from 'react';

export default function useGeoLocation(options) {
  const [location, setLocation] = useState({ lat: null, lng: null, permission: null, error: null, name: null });
  useEffect(() => {
    let mounted = true;
    if (!('geolocation' in navigator)) {
      if (mounted) setLocation(s => ({ ...s, error: 'Geolocation not supported' }));
      return;
    }
    const handleSuccess = pos => {
      if (!mounted) return;
      setLocation(s => ({ ...s, lat: pos.coords.latitude, lng: pos.coords.longitude, permission: 'granted', error: null }));
    };
    const handleFail = err => {
      if (!mounted) return;
      setLocation(s => ({ ...s, error: err?.message || 'Failed to get location' }));
    };
    navigator.geolocation.getCurrentPosition(handleSuccess, handleFail, options);
    return () => { mounted = false; };
  }, [options]);
  return location;
}
