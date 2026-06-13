import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { formatPrice, formatRating } from '../utils/formatters';

const COLORS = {
  primary: '#FF6B35',
  navy: '#0A1628',
  lightGray: '#F5F5F5',
  darkText: '#1A1A2E',
  white: '#FFFFFF',
  mediumGray: '#9E9E9E',
  starGold: '#FFB800',
};

const CARD_MARGIN = 6;
const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * (NUM_COLUMNS + 1) * 2) / NUM_COLUMNS;

const ProductCard = ({ product, onPress }) => {
  const {
    name,
    price,
    image,
    sponsorName,
    charityPercent,
    rating,
    reviewCount,
  } = product;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Sponsor Badge */}
        {sponsorName ? (
          <View style={styles.sponsorBadge}>
            <Text style={styles.sponsorBadgeText} numberOfLines={1}>
              {sponsorName}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>

        {/* Star Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>
            {'★'.repeat(Math.round(rating))}
            {'☆'.repeat(5 - Math.round(rating))}
          </Text>
          <Text style={styles.reviewCount}>({reviewCount})</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>{formatPrice(price)}</Text>

        {/* Charity Badge */}
        <View style={styles.charityBadge}>
          <Text style={styles.charityBadgeText}>❤️ {charityPercent}% to Charity</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sponsorBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: '70%',
  },
  sponsorBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    fontSize: 11,
    color: COLORS.starGold,
    letterSpacing: 1,
  },
  reviewCount: {
    fontSize: 10,
    color: COLORS.mediumGray,
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  charityBadge: {
    backgroundColor: '#FFF4F0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  charityBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ProductCard;
