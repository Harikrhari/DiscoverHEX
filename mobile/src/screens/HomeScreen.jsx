import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from '../components/ProductCard';
import CategoryChip from '../components/CategoryChip';
import CharityWidget from '../components/CharityWidget';
import useStore from '../store/useStore';
import { PRODUCTS, SPONSORS, CATEGORIES } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

const COLORS = {
  primary: '#FF6B35',
  navy: '#0A1628',
  lightGray: '#F5F5F5',
  darkText: '#1A1A2E',
  white: '#FFFFFF',
  mediumGray: '#9E9E9E',
  cardBg: '#FFFFFF',
};

const CATEGORY_ITEMS = [
  { label: 'Sports', icon: '🏃' },
  { label: 'Health', icon: '💊' },
  { label: 'Outdoor', icon: '⛺' },
  { label: 'Gadgets', icon: '📱' },
  { label: 'Lifestyle', icon: '✨' },
];

export default function HomeScreen({ navigation }) {
  const cartItemCount = useStore((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const totalDonated = useStore((state) => state.charity.totalDonated);
  const monthlyGoal = useStore((state) => state.charity.monthlyGoal);
  const setProducts = useStore((state) => state.setProducts);

  useEffect(() => {
    setProducts(PRODUCTS);
  }, []);

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured);
  const featuredSponsor = SPONSORS[0];

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleViewCharity = () => {
    navigation.getParent()?.navigate('Charity');
  };

  const handleCategoryPress = (category) => {
    navigation.getParent()?.navigate('Marketplace', {
      screen: 'MarketplaceMain',
      params: { initialCategory: category },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.logoPrimary}>Discover</Text>
          <Text style={styles.logoAccent}>HEX</Text>
        </Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.getParent()?.navigate('Cart')}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.navy]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <Text style={styles.heroTagline}>Discover. Shop. Give Back.</Text>
          <Text style={styles.heroSubtitle}>
            Every purchase supports a cause you care about
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => navigation.getParent()?.navigate('Marketplace')}
          >
            <Text style={styles.heroButtonText}>Shop Now →</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORY_ITEMS.map((cat) => (
              <CategoryChip
                key={cat.label}
                label={cat.label}
                icon={cat.icon}
                isActive={false}
                onPress={() => handleCategoryPress(cat.label)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate('Marketplace')}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => (
              <View style={styles.featuredCardWrapper}>
                <ProductCard
                  product={item}
                  onPress={() => handleProductPress(item)}
                />
              </View>
            )}
          />
        </View>

        {/* Charity Widget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Impact</Text>
          <CharityWidget
            totalDonated={totalDonated}
            monthlyGoal={monthlyGoal}
            onViewAll={handleViewCharity}
          />
        </View>

        {/* Sponsor Spotlight */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sponsor Spotlight</Text>
          <View style={styles.sponsorCard}>
            <View style={styles.sponsorLogoPlaceholder}>
              <Text style={styles.sponsorLogoText}>{featuredSponsor.name[0]}</Text>
            </View>
            <View style={styles.sponsorInfo}>
              <Text style={styles.sponsorName}>{featuredSponsor.name}</Text>
              <Text style={styles.sponsorTagline}>{featuredSponsor.tagline}</Text>
              <View style={styles.sponsorBadge}>
                <Text style={styles.sponsorBadgeText}>⭐ Featured Partner</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Creator CTA Banner */}
        <View style={styles.section}>
          <View style={styles.creatorBanner}>
            <View style={styles.creatorBannerContent}>
              <Text style={styles.creatorBannerTitle}>Join HEX Creators</Text>
              <Text style={styles.creatorBannerSubtitle}>
                List your products and earn while giving back to the community
              </Text>
              <TouchableOpacity style={styles.creatorButton}>
                <Text style={styles.creatorButtonText}>Become a Creator</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.creatorEmoji}>🚀</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoPrimary: {
    color: COLORS.white,
  },
  logoAccent: {
    color: COLORS.primary,
  },
  cartButton: {
    position: 'relative',
    padding: 6,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  heroBanner: {
    paddingHorizontal: 24,
    paddingVertical: 36,
    marginBottom: 8,
  },
  heroTagline: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 36,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    lineHeight: 20,
  },
  heroButton: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkText,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  featuredList: {
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  featuredCardWrapper: {
    width: 180,
    marginHorizontal: 4,
  },
  sponsorCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sponsorLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sponsorLogoText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
  },
  sponsorInfo: {
    flex: 1,
  },
  sponsorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  sponsorTagline: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginBottom: 8,
  },
  sponsorBadge: {
    backgroundColor: '#FFF4F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  sponsorBadgeText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  creatorBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.navy,
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  creatorBannerContent: {
    flex: 1,
    marginRight: 12,
  },
  creatorBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
  },
  creatorBannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
    marginBottom: 14,
  },
  creatorButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
    alignSelf: 'flex-start',
  },
  creatorButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  creatorEmoji: {
    fontSize: 48,
  },
  bottomPadding: {
    height: 24,
  },
});
