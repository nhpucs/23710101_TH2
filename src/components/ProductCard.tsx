import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '@constants/theme';
import { Product } from '@services/productApi';
import { toVnd, formatVnd } from '@stores/cartStore';

type Props = {
  item: Product;
  onPress: () => void;
  onAdd: () => void;
};

export default function ProductCard({ item, onPress, onAdd }: Props) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>{formatVnd(toVnd(item.price))}</Text>
          <Pressable style={styles.addBtn} onPress={onAdd} hitSlop={8}>
            <Text style={styles.addText}>+</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 6 },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
  },
  image: { width: '100%', height: 120, marginBottom: 8 },
  title: { color: COLORS.text, fontSize: 13, fontWeight: '600', minHeight: 36 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: { color: COLORS.primary, fontWeight: '800', fontSize: 14, flex: 1 },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { color: COLORS.surface, fontSize: 20, fontWeight: '800', lineHeight: 22 },
});
