import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, VARIANT, examStamp } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useAuthStore } from '@stores/authStore';

export default function LoginScreen() {
  const [value, setValue] = useState('');
  const login = useAuthStore(s => s.login);
  const isPhone = VARIANT.authField === 'phone';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.box}>
        <Text style={styles.title}>KTXGO</Text>
        <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType={isPhone ? 'phone-pad' : 'email-address'}
          autoCapitalize="none"
          placeholder={
            isPhone
              ? `Số điện thoại — ${STUDENT.mssv}`
              : `Email — ${STUDENT.mssv}@student.edu.vn`
          }
          placeholderTextColor={COLORS.textLight}
        />
        <Pressable
          style={styles.button}
          onPress={() => login(`ktxgo-${STUDENT.mssv}-${examStamp()}`)}>
          <Text style={styles.buttonText}>Vào cửa hàng</Text>
        </Pressable>
        <Text style={styles.note}>Auth Stack · chưa có token</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  box: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 40, fontWeight: '900', color: COLORS.primary, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.text, textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: COLORS.surface, fontSize: 16, fontWeight: '700' },
  note: { marginTop: 16, textAlign: 'center', color: COLORS.textLight, fontSize: 12 },
});
