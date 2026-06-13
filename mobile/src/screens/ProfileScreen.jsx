import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import useStore from '../store/useStore';
import { formatCurrency, getInitials } from '../utils/formatters';

const COLORS = {
  primary: '#FF6B35',
  navy: '#0A1628',
  lightGray: '#F5F5F5',
  darkText: '#1A1A2E',
  white: '#FFFFFF',
  mediumGray: '#9E9E9E',
  inputBorder: '#E0E0E0',
  dangerRed: '#E74C3C',
  successGreen: '#2ECC71',
};

const MENU_ITEMS = [
  { id: 'orders', icon: '📦', label: 'Order History', badge: null },
  { id: 'settings', icon: '⚙️', label: 'Settings', badge: null },
  { id: 'help', icon: '❓', label: 'Help & Support', badge: null },
  { id: 'about', icon: 'ℹ️', label: 'About DiscoverHEX', badge: null },
];

const CREATOR_MENU_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Creator Dashboard', badge: 'PRO' },
  { id: 'products', icon: '🏷️', label: 'My Products', badge: null },
  { id: 'earnings', icon: '💰', label: 'Earnings & Payouts', badge: null },
];

export default function ProfileScreen({ navigation }) {
  const currentUser = useStore((state) => state.user.currentUser);
  const isCreator = useStore((state) => state.user.isCreator);
  const userStats = useStore((state) => state.user.stats);
  const creatorStats = useStore((state) => state.user.creatorStats);
  const isLoading = useStore((state) => state.user.isLoading);
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter your email and password.');
      return;
    }
    setLoginError('');
    const result = await login(email.trim(), password);
    if (!result.success) {
      setLoginError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleMenuPress = (id) => {
    if (id === 'orders' || id === 'dashboard' || id === 'products' || id === 'earnings') {
      Alert.alert(
        'Coming Soon',
        'This feature is on its way! Stay tuned.',
        [{ text: 'OK' }]
      );
    } else if (id === 'help') {
      Alert.alert(
        'Help & Support',
        'For assistance, contact us at support@discoverhex.com',
        [{ text: 'OK' }]
      );
    } else if (id === 'about') {
      Alert.alert(
        'About DiscoverHEX',
        'DiscoverHEX v0.1.0\n\nA marketplace where every purchase gives back. 5% of all sales are donated to charitable causes.',
        [{ text: 'OK' }]
      );
    }
  };

  // ── NOT LOGGED IN ──────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.loginScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Brand */}
          <View style={styles.loginBrandSection}>
            <View style={styles.loginLogoCircle}>
              <Text style={styles.loginLogoText}>HEX</Text>
            </View>
            <Text style={styles.loginTitle}>Welcome Back</Text>
            <Text style={styles.loginSubtitle}>
              Sign in to track orders, save favorites, and see your impact
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.loginForm}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              style={[styles.input, loginError ? styles.inputError : null]}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.mediumGray}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setLoginError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Password</Text>
            <TextInput
              style={[styles.input, loginError ? styles.inputError : null]}
              placeholder="••••••••"
              placeholderTextColor={COLORS.mediumGray}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setLoginError('');
              }}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {loginError ? (
              <Text style={styles.loginError}>{loginError}</Text>
            ) : null}

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Create an Account</Text>
            </TouchableOpacity>

            <Text style={styles.demoHint}>
              💡 Demo tip: use any email with "creator" to unlock Creator mode
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── LOGGED IN ──────────────────────────────────────────────────────────────
  const displayName =
    currentUser.displayName ||
    currentUser.email?.split('@')[0] ||
    'HEX User';
  const initials = getInitials(displayName);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{currentUser.email}</Text>
          {isCreator && (
            <View style={styles.creatorBadge}>
              <Text style={styles.creatorBadgeText}>⭐ HEX Creator</Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.ordersCount}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMiddle]}>
            <Text style={styles.statValue}>
              {formatCurrency(userStats.totalSpent)}
            </Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>
              {formatCurrency(userStats.totalDonated)}
            </Text>
            <Text style={styles.statLabel}>Donated ❤️</Text>
          </View>
        </View>

        {/* Creator Section */}
        {isCreator && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Creator Dashboard</Text>
            <View style={styles.creatorStatsCard}>
              <View style={styles.creatorStatItem}>
                <Text style={styles.creatorStatValue}>
                  {formatCurrency(creatorStats.earnings)}
                </Text>
                <Text style={styles.creatorStatLabel}>Total Earnings</Text>
              </View>
              <View style={styles.creatorStatDivider} />
              <View style={styles.creatorStatItem}>
                <Text style={styles.creatorStatValue}>
                  {creatorStats.productsListed}
                </Text>
                <Text style={styles.creatorStatLabel}>Products Listed</Text>
              </View>
            </View>
            <View style={styles.menuCard}>
              {CREATOR_MENU_ITEMS.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuPress(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.badge && (
                      <View style={styles.menuBadge}>
                        <Text style={styles.menuBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <Text style={styles.menuChevron}>›</Text>
                  </TouchableOpacity>
                  {index < CREATOR_MENU_ITEMS.length - 1 && (
                    <View style={styles.menuDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Account Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuChevron}>›</Text>
                </TouchableOpacity>
                {index < MENU_ITEMS.length - 1 && (
                  <View style={styles.menuDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>DiscoverHEX v0.1.0</Text>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  // ── Login ────────────────────────────────────────────────────────────────
  loginScrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  loginBrandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginLogoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginLogoText: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginForm: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.darkText,
    backgroundColor: COLORS.lightGray,
  },
  inputError: {
    borderColor: COLORS.dangerRed,
  },
  loginError: {
    color: COLORS.dangerRed,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  signInButtonDisabled: {
    backgroundColor: COLORS.mediumGray,
    shadowColor: COLORS.mediumGray,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inputBorder,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginHorizontal: 12,
    fontWeight: '600',
  },
  registerButton: {
    borderWidth: 2,
    borderColor: COLORS.navy,
    borderRadius: 28,
    paddingVertical: 13,
    alignItems: 'center',
  },
  registerButtonText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
  },
  demoHint: {
    fontSize: 11,
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  // ── Logged In ────────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 10,
  },
  creatorBadge: {
    backgroundColor: 'rgba(255,107,53,0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  creatorBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardMiddle: {
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.mediumGray,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 10,
  },
  creatorStatsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  creatorStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  creatorStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  creatorStatLabel: {
    fontSize: 12,
    color: COLORS.mediumGray,
    fontWeight: '500',
  },
  creatorStatDivider: {
    width: 1,
    backgroundColor: COLORS.inputBorder,
    marginVertical: 4,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.darkText,
    fontWeight: '500',
  },
  menuBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  menuBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  menuChevron: {
    fontSize: 20,
    color: COLORS.mediumGray,
    fontWeight: '300',
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginLeft: 50,
  },
  signOutButton: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.dangerRed,
  },
  signOutText: {
    color: COLORS.dangerRed,
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.mediumGray,
    marginTop: 16,
  },
  bottomSpace: {
    height: 30,
  },
});
