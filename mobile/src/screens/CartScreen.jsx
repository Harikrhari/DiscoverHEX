import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import useStore from '../store/useStore';
import { formatPrice } from '../utils/formatters';

const COLORS = {
  primary: '#FF6B35',
  navy: '#0A1628',
  lightGray: '#F5F5F5',
  darkText: '#1A1A2E',
  white: '#FFFFFF',
  mediumGray: '#9E9E9E',
  dangerRed: '#E74C3C',
  successGreen: '#2ECC71',
  inputBorder: '#E0E0E0',
};

const TAX_RATE = 0.085;
const CHARITY_PERCENT = 0.05;

export default function CartScreen({ navigation }) {
  const cartItems = useStore((state) => state.cart.items);
  const promoCode = useStore((state) => state.cart.promoCode);
  const promoDiscount = useStore((state) => state.cart.promoDiscount);
  const removeItem = useStore((state) => state.removeItem);
  const updateQty = useStore((state) => state.updateQty);
  const applyPromo = useStore((state) => state.applyPromo);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Computed values
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = subtotal * promoDiscount;
  const discountedSubtotal = subtotal - discountAmount;
  const charityAmount = discountedSubtotal * CHARITY_PERCENT;
  const taxAmount = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + taxAmount;

  const handleRemoveItem = (item) => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(item.id),
        },
      ]
    );
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    if (!promoInput.trim()) {
      setPromoError('Please enter a promo code.');
      return;
    }
    const result = applyPromo(promoInput.trim());
    if (result.success) {
      setPromoSuccess(
        `Code applied! ${Math.round(result.discount * 100)}% discount`
      );
      setPromoInput('');
    } else {
      setPromoError(result.error || 'Invalid promo code.');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigation.navigate('Checkout', {
      subtotal,
      discountAmount,
      charityAmount,
      taxAmount,
      total,
    });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.itemCharity}>❤️ 5% to charity</Text>

        {/* Quantity Controls */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQty(item.id, item.quantity - 1)}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQty(item.id, item.quantity + 1)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemTotal}>
        {formatPrice(item.price * item.quantity)}
      </Text>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some products to get started!
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.getParent()?.navigate('Marketplace')}
      >
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View>
            {/* Promo Code Section */}
            <View style={styles.promoSection}>
              <Text style={styles.promoTitle}>Promo Code</Text>
              {promoCode ? (
                <View style={styles.appliedPromo}>
                  <Text style={styles.appliedPromoText}>
                    ✓ {promoCode} applied — {Math.round(promoDiscount * 100)}% off
                  </Text>
                </View>
              ) : (
                <View style={styles.promoInputRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter promo code"
                    placeholderTextColor={COLORS.mediumGray}
                    value={promoInput}
                    onChangeText={(text) => {
                      setPromoInput(text);
                      setPromoError('');
                      setPromoSuccess('');
                    }}
                    autoCapitalize="characters"
                    returnKeyType="done"
                    onSubmitEditing={handleApplyPromo}
                  />
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleApplyPromo}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
              {promoError ? (
                <Text style={styles.promoError}>{promoError}</Text>
              ) : null}
              {promoSuccess ? (
                <Text style={styles.promoSuccess}>{promoSuccess}</Text>
              ) : null}
              {!promoCode && (
                <Text style={styles.promoHint}>
                  Try: HEX10, HEX20, or GIVEBACK
                </Text>
              )}
            </View>

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabelDiscount}>
                    Promo Discount ({Math.round(promoDiscount * 100)}%)
                  </Text>
                  <Text style={styles.summaryValueDiscount}>
                    − {formatPrice(discountAmount)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelCharity}>❤️ Charity (5%)</Text>
                <Text style={styles.summaryValueCharity}>
                  {formatPrice(charityAmount)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Tax (8.5%)
                </Text>
                <Text style={styles.summaryValue}>{formatPrice(taxAmount)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>

              <Text style={styles.charityNote}>
                ❤️ {formatPrice(charityAmount)} of your purchase goes to charity
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutButtonText}>
                Proceed to Checkout — {formatPrice(total)}
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomSpace} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  listContent: {
    padding: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    lineHeight: 19,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  itemCharity: {
    fontSize: 11,
    color: COLORS.primary,
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkText,
    lineHeight: 22,
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkText,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  removeButtonText: {
    fontSize: 18,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkText,
    marginLeft: 8,
  },
  promoSection: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 10,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.darkText,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: COLORS.navy,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  appliedPromo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 10,
  },
  appliedPromoText: {
    color: COLORS.successGreen,
    fontWeight: '700',
    fontSize: 14,
  },
  promoError: {
    color: COLORS.dangerRed,
    fontSize: 12,
    marginTop: 6,
  },
  promoSuccess: {
    color: COLORS.successGreen,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  promoHint: {
    fontSize: 11,
    color: COLORS.mediumGray,
    marginTop: 6,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.mediumGray,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  summaryLabelDiscount: {
    fontSize: 14,
    color: COLORS.successGreen,
  },
  summaryValueDiscount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.successGreen,
  },
  summaryLabelCharity: {
    fontSize: 14,
    color: COLORS.primary,
  },
  summaryValueCharity: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.darkText,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.darkText,
  },
  charityNote: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginBottom: 28,
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  shopNowText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpace: {
    height: 24,
  },
});
