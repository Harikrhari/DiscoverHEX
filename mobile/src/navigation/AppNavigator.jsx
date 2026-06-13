import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import CharityScreen from '../screens/CharityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import useStore from '../store/useStore';

const COLORS = {
  primary: '#FF6B35',
  navy: '#0A1628',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkText: '#1A1A2E',
  mediumGray: '#9E9E9E',
};

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MarketplaceStack = createStackNavigator();
const CartStack = createStackNavigator();
const CharityStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const TAB_ICONS = {
  Home: { icon: '🏠', label: 'Home' },
  Marketplace: { icon: '🛍️', label: 'Shop' },
  Cart: { icon: '🛒', label: 'Cart' },
  Charity: { icon: '❤️', label: 'Charity' },
  Profile: { icon: '👤', label: 'Profile' },
};

const TabBarIcon = ({ name, focused, badgeCount }) => {
  const tab = TAB_ICONS[name];
  return (
    <View style={styles.tabIconWrapper}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
        {tab.icon}
      </Text>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : String(badgeCount)}
          </Text>
        </View>
      )}
    </View>
  );
};

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.navy },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontWeight: '700', fontSize: 18 },
  headerBackTitleVisible: false,
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </HomeStack.Navigator>
  );
}

function MarketplaceStackNavigator() {
  return (
    <MarketplaceStack.Navigator screenOptions={screenOptions}>
      <MarketplaceStack.Screen
        name="MarketplaceMain"
        component={MarketplaceScreen}
        options={{ title: 'Marketplace' }}
      />
      <MarketplaceStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </MarketplaceStack.Navigator>
  );
}

function CartStackNavigator() {
  return (
    <CartStack.Navigator screenOptions={screenOptions}>
      <CartStack.Screen
        name="CartMain"
        component={CartScreen}
        options={{ title: 'My Cart' }}
      />
      <CartStack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </CartStack.Navigator>
  );
}

function CharityStackNavigator() {
  return (
    <CharityStack.Navigator screenOptions={screenOptions}>
      <CharityStack.Screen
        name="CharityMain"
        component={CharityScreen}
        options={{ title: 'Charity' }}
      />
    </CharityStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </ProfileStack.Navigator>
  );
}

export default function AppNavigator() {
  const cartItemCount = useStore((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.mediumGray,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={route.name}
              focused={focused}
              badgeCount={route.name === 'Cart' ? cartItemCount : 0}
            />
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen
          name="Marketplace"
          component={MarketplaceStackNavigator}
          options={{ tabBarLabel: 'Shop' }}
        />
        <Tab.Screen
          name="Cart"
          component={CartStackNavigator}
          options={{ tabBarLabel: 'Cart' }}
        />
        <Tab.Screen
          name="Charity"
          component={CharityStackNavigator}
          options={{ tabBarLabel: 'Charity' }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.navy,
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
