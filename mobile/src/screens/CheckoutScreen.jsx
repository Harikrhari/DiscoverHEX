import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
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
  inputBorder: '#E0E0E0',
  successGreen: '#2ECC71',
  errorRed: '#E74C3C',
};

const initialAddress = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  zip: '',
};

export default function CheckoutScreen({ navigation, route }) {
  const cartItems = useStore((state) => state.cart.items);
  const clearCart = useStore((state) => state.clearCart);
  const addDonation = useStore((state) => state.addDonation);

  const {
    subtotal = 0,
    discountAmount = 0,
    charityAmount = 0,
    taxAmount = 0,
    total = 0,
  } = route?.params || {};

  const [address, setAddress] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const updateField = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!address.street.trim()) newErrors.street = 'Street address is required.';
    if (!address.city.trim()) newErrors.city = 'City is required.';
    if (!address.state.trim()) newErrors.state = 'State is required.';
    if (!address.zip.trim()) newErrors.zip = 'ZIP code is required.';
    else if (!/^\d{5}(-\d{4})?$/.test(address.zip.trim()))
      newErrors.zip = 'Enter a valid ZIP code.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setIsPlacing(true);

    // Simulate placing order
    await new Promise((r) => setTimeout(r, 1200));

    const orderId = `HEX-${Date.now().toString().slice(-6)}`;
    setOrderNumber(orderId);

    // Record charity donation
    if (charityAmount > 0) {
      addDonation(charityAmount, 'charity-001');
    }

    clearCart();
    setIsPlacing(false);
    setOrderPlaced(true);
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successOrderNumber}>Order #{orderNumber}</Text>
          <Text style={styles.successSubtitle}>
            Thank you for your purchase! A confirmation email has been sent to you.
          </Text>

          {charityAmount > 0 && (
            <View style={styles.successCharity}>
              <Text style={styles.successCharityIcon}>❤️</Text>
              <Text style={styles.successCharityText}>
                {formatPrice(charityAmount)} has been donated to charity on
                your behalf. Thank you for making a difference!
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              navigation.getParent()?.navigate('Home');
            }}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Checkout Form ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Shipping Address</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Jane Doe"
                placeholderTextColor={COLORS.mediumGray}
                value={address.fullName}
                onChangeText={(v) => updateField('fullName', v)}
                autoCapitalize="words"
                returnKeyType="next"
              />
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Street Address</Text>
              <TextInput
                style={[styles.input, errors.street && styles.inputError]}
                placeholder="123 Main Street, Apt 4B"
                placeholderTextColor={COLORS.mediumGray}
                value={address.street}
                onChangeText={(v) => updateField('street', v)}
                autoCapitalize="words"
                returnKeyType="next"
              />
              {errors.street ? (
                <Text style={styles.errorText}>{errors.street}</Text>
              ) : null}
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, styles.fieldFlex]}>
                <Text style={styles.fieldLabel}>City</Text>
                <TextInput
                  style={[styles.input, errors.city && styles.inputError]}
                  placeholder="New York"
                  placeholderTextColor={COLORS.mediumGray}
                  value={address.city}
                  onChangeText={(v) => updateField('city', v)}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {errors.city ? (
                  <Text style={styles.errorText}>{errors.city}</Text>
                ) : null}
              </View>

              <View style={[styles.fieldGroup, styles.fieldSmall, { marginLeft: 10 }]}>
                <Text style={styles.fieldLabel}>State</Text>
                <TextInput
                  style={[styles.input, errors.state && styles.inputError]}
                  placeholder="NY"
                  placeholderTextColor={COLORS.mediumGray}
                  value={address.state}
                  onChangeText={(v) => updateField('state', v.toUpperCase())}
                  autoCapitalize="characters"
                  maxLength={2}
                  returnKeyType="next"
                />
                {errors.state ? (
                  <Text style={styles.errorText}>{errors.state}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ZIP Code</Text>
              <TextInput
                style={[styles.input, errors.zip && styles.inputError]}
                placeholder="10001"
                placeholderTextColor={COLORS.mediumGray}
                value={address.zip}
                onChangeText={(v) => updateField('zip', v)}
                keyboardType="number-pad"
                maxLength={10}
                returnKeyType="done"
              />
              {errors.zip ? (
                <Text style={styles.errorText}>{errors.zip}</Text>
              ) : null}
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧾 Order Summary</Text>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.orderItemImage}
                  resizeMode="cover"
                />
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.orderItemQty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.orderItemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          {/* Price Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💳 Payment Summary</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
            </View>
            {discountAmount > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: COLORS.successGreen }]}>
                  Promo Discount
                </Text>
                <Text style={[styles.priceValue, { color: COLORS.successGreen }]}>
                  − {formatPrice(discountAmount)}
                </Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: COLORS.primary }]}>
                ❤️ Charity (5%)
              </Text>
              <Text style={[styles.priceValue, { color: COLORS.primary }]}>
                {formatPrice(charityAmount)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax (8.5%)</Text>
              <Text style={styles.priceValue}>{formatPrice(taxAmount)}</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>

          {/* Payment Placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💳 Payment</Text>
            <View style={styles.paymentPlaceholder}>
              <Text style={styles.paymentIcon}>🔒</Text>
              <Text style={styles.paymentTitle}>Secure Payment via Stripe</Text>
              <Text style={styles.paymentSubtitle}>
                Payment processing powered by Stripe. Your card details are
                encrypted and never stored on our servers.
              </Text>
              <View style={styles.paymentBadges}>
                <Text style={styles.paymentBadge}>Visa</Text>
                <Text style={styles.paymentBadge}>Mastercard</Text>
                <Text style={styles.paymentBadge}>Apple Pay</Text>
                <Text style={styles.paymentBadge}>Google Pay</Text>
              </View>
            </View>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              isPlacing && styles.placeOrderButtonDisabled,
            ]}
            onPress={handlePlaceOrder}
            disabled={isPlacing}
            activeOpacity={0.85}
          >
            <Text style={styles.placeOrderText}>
              {isPlacing ? 'Placing Order...' : `Place Order — ${formatPrice(total)}`}
            </Text>
          </TouchableOpacity>

          <Text style={styles.legalNote}>
            By placing your order you agree to our Terms of Service and Privacy
            Policy. 5% of your purchase total will be donated to charity.
          </Text>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginHorizontal: 14,
    marginTop: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldFlex: {
    flex: 1,
  },
  fieldSmall: {
    width: 80,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.darkText,
    backgroundColor: COLORS.lightGray,
  },
  inputError: {
    borderColor: COLORS.errorRed,
  },
  errorText: {
    color: COLORS.errorRed,
    fontSize: 11,
    marginTop: 4,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
    lineHeight: 18,
  },
  orderItemQty: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkText,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.mediumGray,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  totalDivider: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    marginVertical: 8,
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
  paymentPlaceholder: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 6,
  },
  paymentSubtitle: {
    fontSize: 12,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  paymentBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  paymentBadge: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    color: COLORS.mediumGray,
    fontWeight: '600',
    margin: 3,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 16,
    marginHorizontal: 14,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  placeOrderButtonDisabled: {
    backgroundColor: COLORS.mediumGray,
    shadowColor: COLORS.mediumGray,
  },
  placeOrderText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  legalNote: {
    fontSize: 11,
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 12,
    lineHeight: 16,
  },
  bottomSpace: {
    height: 30,
  },
  // Success screen
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  successOrderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.mediumGray,
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  successCharity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF4F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  successCharityIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  successCharityText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.darkText,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingHorizontal: 48,
    paddingVertical: 15,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
