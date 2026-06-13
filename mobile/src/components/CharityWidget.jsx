import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { formatCurrency } from '../utils/formatters';

const COLORS = {
  primary: '#FF6B35',
  navy: '#0A1628',
  lightGray: '#F5F5F5',
  darkText: '#1A1A2E',
  white: '#FFFFFF',
  mediumGray: '#9E9E9E',
  progressBg: '#E8E8E8',
};

const CharityWidget = ({ totalDonated, monthlyGoal, onViewAll }) => {
  const progress = monthlyGoal > 0 ? Math.min(totalDonated / monthlyGoal, 1) : 0;
  const progressPercent = Math.round(progress * 100);

  return (
    <View style={styles.card}>
      {/* Top accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.heartIcon}>❤️</Text>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Making a Difference</Text>
            <Text style={styles.subtitle}>Total Community Impact</Text>
          </View>
        </View>

        {/* Total donated amount */}
        <Text style={styles.amount}>{formatCurrency(totalDonated)}</Text>
        <Text style={styles.amountLabel}>donated to charity</Text>

        {/* Monthly progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Monthly Goal</Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.progressGoalRow}>
            <Text style={styles.progressGoalText}>
              {formatCurrency(totalDonated)} raised
            </Text>
            <Text style={styles.progressGoalText}>
              Goal: {formatCurrency(monthlyGoal)}
            </Text>
          </View>
        </View>

        {/* CTA link */}
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.linkText}>View All Campaigns →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accentBar: {
    height: 4,
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heartIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginTop: 1,
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  amountLabel: {
    fontSize: 13,
    color: COLORS.mediumGray,
    marginTop: 2,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.progressBg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressGoalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressGoalText: {
    fontSize: 11,
    color: COLORS.mediumGray,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'right',
  },
});

export default CharityWidget;
