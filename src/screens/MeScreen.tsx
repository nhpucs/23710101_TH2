import React from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, examStamp } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { useAuthStore } from '@stores/authStore';
import { formatVnd } from '@stores/cartStore';

export default function MeScreen() {
  const { status, loading, error, km, fee, locate } = useCampusLocation();
  const logout = useAuthStore(s => s.logout);
  const blocked = status === 'blocked';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>TÔI · LOCATION</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{STUDENT.hoTen}</Text>
        <Text style={styles.sub}>
          {STUDENT.mssv} · #{examStamp()}
        </Text>

        <View style={styles.card}>
          <Text style={[styles.perm, status === 'granted' ? styles.ok : styles.bad]}>
            Quyền: {status}
          </Text>
          <Text style={styles.line}>
            ≈ {km != null ? km.toFixed(1) : '--'} km tới cổng KTX
          </Text>
          <Text style={styles.label}>Phí ship ước tính</Text>
          <Text style={styles.fee}>{fee != null ? formatVnd(fee) : '--'}</Text>
          {error && <Text style={styles.err}>{error}</Text>}
        </View>

        <Pressable style={styles.primaryBtn} onPress={locate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.primaryText}>Lấy vị trí ước tính ship</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.outlineBtn, !blocked && styles.disabled]}
          disabled={!blocked}
          onPress={() => Linking.openSettings()}>
          <Text style={styles.outlineText}>Mở Cài đặt (blocked)</Text>
        </Pressable>

        <Pressable style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.primaryText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  header: { paddingVertical: 14, alignItems: 'center' },
  headerText: { color: COLORS.surface, fontSize: 18, fontWeight: '800' },
  body: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  name: { color: COLORS.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  sub: { color: COLORS.textLight, textAlign: 'center', marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 16,
  },
  perm: { fontWeight: '800', fontSize: 15 },
  ok: { color: COLORS.success },
  bad: { color: COLORS.error },
  line: { color: COLORS.text, marginTop: 6 },
  label: { color: COLORS.textLight, marginTop: 10 },
  fee: { color: COLORS.secondary, fontSize: 24, fontWeight: '900' },
  err: { color: COLORS.error, marginTop: 8 },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryText: { color: COLORS.surface, fontWeight: '700', fontSize: 16 },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  outlineText: { color: COLORS.primary, fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.4 },
  logoutBtn: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
});
