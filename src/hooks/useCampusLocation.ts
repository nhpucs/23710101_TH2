import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

export type PermStatus = 'idle' | 'granted' | 'denied' | 'blocked';

// Cổng KTX (IUH - 12 Nguyễn Văn Bảo, Gò Vấp)
const KTX_GATE = { latitude: 10.8221, longitude: 106.6869 };

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function calcShipFee(km: number) {
  return VARIANT.shipFormula === 'A'
    ? BASE_SHIP_FEE + Math.round(km * 2000)
    : BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
}

const { ACCESS_FINE_LOCATION: FINE, ACCESS_COARSE_LOCATION: COARSE } =
  PermissionsAndroid.PERMISSIONS;

async function requestPermission(): Promise<PermStatus> {
  if (Platform.OS !== 'android') {
    return 'granted';
  }
  const res = await PermissionsAndroid.requestMultiple([FINE, COARSE]);
  const values = [res[FINE], res[COARSE]];
  if (values.includes(PermissionsAndroid.RESULTS.GRANTED)) {
    return 'granted';
  }
  if (values.includes(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)) {
    return 'blocked';
  }
  return 'denied';
}

function getPosition(highAccuracy: boolean, timeout: number) {
  return new Promise<{ latitude: number; longitude: number }>((resolve, reject) =>
    Geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err),
      { enableHighAccuracy: highAccuracy, timeout, maximumAge: 10000 },
    ),
  );
}

export function useCampusLocation() {
  const [status, setStatus] = useState<PermStatus>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const km = useCartStore(s => s.shipKm);
  const fee = useCartStore(s => s.shipFee);
  const setShip = useCartStore(s => s.setShip);

  // Đã cấp quyền từ trước thì hiện granted luôn
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    Promise.all([PermissionsAndroid.check(FINE), PermissionsAndroid.check(COARSE)]).then(
      ([fine, coarse]) => {
        if (fine || coarse) {
          setStatus('granted');
        }
      },
    );
  }, []);

  const locate = useCallback(async () => {
    setError(null);
    const perm = await requestPermission();
    setStatus(perm);
    if (perm !== 'granted') {
      return;
    }
    setLoading(true);
    try {
      let coords;
      try {
        coords = await getPosition(false, 8000);
      } catch {
        coords = await getPosition(true, 20000); // emulator không có NETWORK → fallback GPS
      }
      const d = haversineKm(coords.latitude, coords.longitude, KTX_GATE.latitude, KTX_GATE.longitude);
      setShip(d, calcShipFee(d));
    } catch {
      setError('Không lấy được vị trí. Kiểm tra SET LOCATION trên emulator.');
    } finally {
      setLoading(false);
    }
  }, [setShip]);

  return { status, loading, error, km, fee, locate };
}
