import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, ROOM_LABEL, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useCartStore, toVnd, formatVnd } from '@stores/cartStore';

export default function CartScreen() {
  const items = useCartStore(s => s.items);
  const changeQty = useCartStore(s => s.changeQty);
  const remove = useCartStore(s => s.remove);
  const total = useCartStore(s => s.totalAmount());
  const shipFee = useCartStore(s => s.shipFee);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GIỎ HÀNG</Text>
      </View>
      <View style={styles.body}>
        <FlatList
          data={items}
          keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Giỏ trống — vào tab Cửa hàng bấm "+" để thêm món.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemSub}>
                  ×{item.qty} · {formatVnd(toVnd(item.price) * item.qty)}
                </Text>
              </View>
              <Pressable style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)}>
                <Text style={styles.qtyText}>−</Text>
              </Pressable>
              <Pressable style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)}>
                <Text style={styles.qtyText}>+</Text>
              </Pressable>
              <Pressable style={styles.delBtn} onPress={() => remove(item.id)}>
                <Text style={styles.delText}>Xoá</Text>
              </Pressable>
            </View>
          )}
          ListFooterComponent={
            <View>
              <View style={styles.shipBox}>
                <Text style={styles.shipRoom}>Giao đến {ROOM_LABEL}</Text>
                {shipFee != null ? (
                  <Text style={styles.shipFee}>
                    Phí ship: {formatVnd(shipFee)} (công thức {VARIANT.shipFormula})
                  </Text>
                ) : (
                  <Text style={styles.shipHint}>Chưa có vị trí — vào tab Tôi để ước tính ship</Text>
                )}
              </View>
              <Text style={styles.total}>Tổng hàng: {formatVnd(total)}</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  header: { paddingVertical: 14, alignItems: 'center' },
  headerText: { color: COLORS.surface, fontSize: 18, fontWeight: '800' },
  body: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 12 },
  empty: { textAlign: 'center', color: COLORS.textLight, marginVertical: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 10,
  },
  itemInfo: { flex: 1, marginRight: 8 },
  itemTitle: { color: COLORS.text, fontWeight: '700' },
  itemSub: { color: COLORS.textLight, marginTop: 4 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  qtyText: { color: COLORS.primary, fontSize: 18, fontWeight: '800' },
  delBtn: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 32,
    justifyContent: 'center',
    marginLeft: 8,
  },
  delText: { color: COLORS.surface, fontWeight: '700' },
  shipBox: {
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    padding: 12,
    marginTop: 4,
  },
  shipRoom: { color: COLORS.text, fontWeight: '700' },
  shipFee: { color: COLORS.secondary, fontWeight: '700', marginTop: 4 },
  shipHint: { color: COLORS.textLight, marginTop: 4 },
  total: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 14,
  },
});
