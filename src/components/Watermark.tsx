import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STUDENT, VARIANT, examStamp } from '@constants/student';
import { COLORS } from '@constants/theme';

export const WATERMARK_TEXT = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${examStamp()}`;

export default function Watermark() {
  const insets = useSafeAreaInsets();
  const pad = VARIANT.watermarkAtTop
    ? { paddingTop: insets.top + 4 }
    : { paddingBottom: insets.bottom + 4 };
  return (
    <View style={[styles.bar, pad]}>
      <Text style={styles.text} numberOfLines={1}>
        {WATERMARK_TEXT}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.text,
    paddingTop: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  text: { color: COLORS.surface, fontSize: 12, fontWeight: '700' },
});
