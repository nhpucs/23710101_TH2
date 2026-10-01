import { Text, StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStack from '@navigation/ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

const Tab = createBottomTabNavigator();
const tabIcon = (glyph: string) => () => <Text style={styles.icon}>{glyph}</Text>;

export default function MainTabs() {
  const totalQty = useCartStore(s => s.totalQuantity());

  const shop = (
    <Tab.Screen key="shop" name="ShopTab" component={ShopStack} options={{ title: 'Cửa hàng', tabBarIcon: tabIcon('🏪') }} />
  );
  const cart = (
    <Tab.Screen
      key="cart"
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Giỏ',
        tabBarIcon: tabIcon('🛒'),
        tabBarBadge: totalQty > 0 ? totalQty : undefined,
        tabBarBadgeStyle: { backgroundColor: COLORS.secondary },
      }}
    />
  );
  const me = <Tab.Screen key="me" name="MeTab" component={MeScreen} options={{ title: 'Tôi', tabBarIcon: tabIcon('👤') }} />;

  const ordered = VARIANT.tabOrder === 'shopFirst' ? [shop, cart, me] : [cart, shop, me];

  return (
    <Tab.Navigator
      safeAreaInsets={VARIANT.watermarkAtTop ? undefined : { bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '700' },
        tabBarStyle: { height: 64, paddingTop: 4 },
      }}>
      {ordered}
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({ icon: { fontSize: 20 } });
