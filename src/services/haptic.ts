import { Vibration } from 'react-native';
import { VARIANT } from '@constants/student';

export function hapticOnAdd() {
  try {
    Vibration.vibrate(VARIANT.hapticOnAdd === 'impact' ? 40 : 10);
  } catch {
    // bỏ qua nếu máy không hỗ trợ rung
  }
}
