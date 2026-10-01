import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@navigation/ShopStack';
import ProductCard from '@components/ProductCard';
import { STUDENT, DEBOUNCE_MS, ROOM_LABEL } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useProducts, Product } from '@services/productApi';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { useCartStore } from '@stores/cartStore';
import { hapticOnAdd } from '@services/haptic';

type Props = NativeStackScreenProps<ShopStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [text, setText] = useState('');
  const debounced = useDebouncedValue(text, DEBOUNCE_MS);
  const { data, isPending, isError, refetch, isRefetching } = useProducts();
  const add = useCartStore(s => s.add);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return (data ?? []).filter(p => p.title.toLowerCase().includes(q));
  }, [data, debounced]);

  const onAdd = (p: Product) => {
    add({ id: p.id, title: p.title, price: p.price, image: p.image });
    hapticOnAdd();
  };

  let body;
  if (isPending) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.info}>Đang tải món...</Text>
      </View>
    );
  } else if (isError) {
    body = (
      <View style={styles.center}>
        <Text style={styles.errMssv}>{STUDENT.mssv}</Text>
        <Text style={styles.info}>Không tải được dữ liệu món.</Text>
        <Pressable style={styles.retry} onPress={() => refetch()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  } else {
    body = (
      <FlashList
        data={filtered}
        numColumns={2}
        estimatedItemSize={250}
        keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => navigation.navigate('Detail', { id: String(item.id) })}
            onAdd={() => onAdd(item)}
          />
        )}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.info}>Không có món phù hợp.</Text>}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>KTXGO</Text>
        <Text style={styles.room}>Giao tận {ROOM_LABEL}</Text>
      </View>
      <View style={styles.body}>
        <TextInput
          style={styles.search}
          value={text}
          onChangeText={setText}
          placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
          placeholderTextColor={COLORS.textLight}
        />
        {body}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  brand: { color: COLORS.surface, fontSize: 24, fontWeight: '900' },
  room: { color: COLORS.border, fontSize: 14, marginTop: 2 },
  body: { flex: 1, backgroundColor: COLORS.background },
  search: {
    margin: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
  },
  list: { paddingHorizontal: 6, paddingBottom: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  info: { color: COLORS.textLight, marginTop: 8, textAlign: 'center' },
  errMssv: { color: COLORS.error, fontSize: 22, fontWeight: '900' },
  retry: {
    marginTop: 12,
    backgroundColor: COLORS.error,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: COLORS.surface, fontWeight: '700' },
});
