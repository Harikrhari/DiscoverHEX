import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import ProductCard from '../components/ProductCard';
import useStore from '../store/useStore';
import { PRODUCTS } from '../data/mockData';
import { formatPrice } from '../utils/formatters';

const COLORS = {
  primary: '#FF6B35',
  navy: '#0A1628',
  lightGray: '#F5F5F5',
  darkText: '#1A1A2E',
  white: '#FFFFFF',
  mediumGray: '#9E9E9E',
  charityBg: '#FFF4F0',
  successGreen: '#2ECC71',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 300;

export default function ProductDetailScreen({ navigation, route }) {
  const product = route?.params?.product;
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useStore((state) => state.addItem);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const {
    id,
    name,
    price,
    image,
    description,
    category,
    rating,
    reviewCount,
    sponsorName,
    charityPercent,
    charityCategory,
  } = product;

  const charityAmount = ((price * charityPercent) / 100).toFixed(2);
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === category && p.id !== id
  ).slice(0, 6);

  const handleAddToCart = () => {
    addItem(product, 1);
    setAddedToCart(true);
    Alert.alert(
      'Added to Cart!',
      `${name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        {
          text: 'View Cart',
          onPress: () => navigation.getParent()?.navigate('Cart'),
        },
      ]
    );
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${name} on DiscoverHEX — ${formatPrice(price)} and 5% goes to charity! discoverhex://product/${id}`,
        title: name,
      });
    } catch {
      // Share cancelled or failed — silent
    }
  };

  const renderRelatedProduct = ({ item }) => (
    <View style={styles.relatedCardWrapper}>
      <ProductCard
        product={item}
        onPress={() =>
          navigation.push('ProductDetail', { product: item })
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {/* Share Button Overlay */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.shareIcon}>⬆️</Text>
          </TouchableOpacity>
          {/* Category badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{category}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          {/* Sponsor Badge */}
          {sponsorName ? (
            <View style={styles.sponsorBadge}>
              <Text style={styles.sponsorBadgeText}>
                ⭐ Sponsored by {sponsorName}
              </Text>
            </View>
          ) : null}

          {/* Name & Price */}
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.productPrice}>{formatPrice(price)}</Text>

          {/* Rating Row */}
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>
              {'★'.repeat(Math.round(rating))}
              {'☆'.repeat(5 - Math.round(rating))}
            </Text>
            <Text style={styles.ratingText}>
              {rating.toFixed(1)} ({reviewCount} reviews)
            </Text>
          </View>

          {/* Charity Callout */}
          <View style={styles.charityCallout}>
            <View style={styles.charityCalloutHeader}>
              <Text style={styles.charityCalloutIcon}>❤️</Text>
              <Text style={styles.charityCalloutTitle}>
                5% Goes to {charityCategory}
              </Text>
            </View>
            <Text style={styles.charityCalloutText}>
              Your purchase of {formatPrice(price)} will donate{' '}
              <Text style={styles.charityHighlight}>${charityAmount}</Text> to
              the {charityCategory} cause. Together we make a difference.
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>About This Product</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          {/* Product Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{category}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Charity %</Text>
              <Text style={styles.detailValue}>{charityPercent}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cause</Text>
              <Text style={styles.detailValue}>{charityCategory}</Text>
            </View>
            {sponsorName && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Sponsor</Text>
                <Text style={styles.detailValue}>{sponsorName}</Text>
              </View>
            )}
          </View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>Related Products</Text>
              <FlatList
                data={relatedProducts}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
                renderItem={renderRelatedProduct}
              />
            </View>
          )}

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>

      {/* Sticky Add to Cart Button */}
      <View style={styles.stickyFooter}>
        <View style={styles.footerPriceBox}>
          <Text style={styles.footerPriceLabel}>Price</Text>
          <Text style={styles.footerPrice}>{formatPrice(price)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            addedToCart && styles.addedButton,
          ]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Text style={styles.addToCartText}>
            {addedToCart ? '✓ Added!' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.mediumGray,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  shareButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  shareIcon: {
    fontSize: 20,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  sponsorBadge: {
    backgroundColor: '#FFF4F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  sponsorBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.darkText,
    lineHeight: 28,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    fontSize: 16,
    color: '#FFB800',
    letterSpacing: 2,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  charityCallout: {
    backgroundColor: COLORS.charityBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  charityCalloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  charityCalloutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  charityCalloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  charityCalloutText: {
    fontSize: 13,
    color: COLORS.darkText,
    lineHeight: 20,
  },
  charityHighlight: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  detailsSection: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  relatedSection: {
    marginBottom: 16,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 10,
  },
  relatedList: {
    paddingRight: 16,
  },
  relatedCardWrapper: {
    width: 160,
    marginRight: 4,
  },
  bottomSpace: {
    height: 80,
  },
  stickyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  footerPriceBox: {
    marginRight: 16,
  },
  footerPriceLabel: {
    fontSize: 11,
    color: COLORS.mediumGray,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.darkText,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: COLORS.successGreen,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
