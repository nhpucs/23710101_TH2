import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuthStack from '@navigation/AuthStack';
import MainTabs from '@navigation/MainTabs';
import Watermark from '@components/Watermark';
import { useAuthStore } from '@stores/authStore';
import { VARIANT } from '@constants/student';

export default function RootNavigator() {
  const token = useAuthStore(s => s.token);
  return (
    <View style={styles.root}>
      {VARIANT.watermarkAtTop && <Watermark />}
      <View style={styles.root}>{token ? <MainTabs /> : <AuthStack />}</View>
      {!VARIANT.watermarkAtTop && <Watermark />}
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
