import React from 'react';
import { View, Text, Image, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@navigation/ShopStack';
import { STUDENT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useProducts } from '@services/productApi';
import { useCartStore, toVnd, formatVnd } from '@stores/cartStore';
import { hapticOnAdd } from '@services/haptic';

type Props = NativeStackScreenProps<ShopStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  const { id } = route.params;
  const { data } = useProducts();
  const add = useCartStore(s => s.add);
  const product = data?.find(p => String(p.id) === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.light}>Không tìm thấy món #{id}</Text>
      </View>
    );
  }

  const onAdd = () => {
    add({ id: product.id, title: product.title, price: product.price, image: product.image });
    hapticOnAdd();
    Alert.alert('Đã thêm vào giỏ', `${product.title}\nMSSV ${STUDENT.mssv}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatVnd(toVnd(product.price))}</Text>
        <Text style={styles.ship}>Giao nội khu · nhận tận phòng</Text>
        <Text style={styles.desc} numberOfLines={3}>
          {product.description}
        </Text>
        <Pressable style={styles.button} onPress={onAdd}>
          <Text style={styles.buttonText}>Thêm vào giỏ · Haptic</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  image: { width: '100%', height: 240, marginBottom: 12 },
  title: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  price: { color: COLORS.primary, fontSize: 22, fontWeight: '900', marginTop: 8 },
  ship: { color: COLORS.success, marginTop: 6, fontWeight: '600' },
  desc: { color: COLORS.textLight, marginTop: 10, lineHeight: 20 },
  light: { color: COLORS.textLight },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: COLORS.surface, fontSize: 16, fontWeight: '700' },
});
