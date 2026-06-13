import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import useStore from '../store/useStore';
import { CHARITIES, TRANSACTIONS } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

const COLORS = {
  primary: '#FF6B35',
  navy: '#0A1628',
  lightGray: '#F5F5F5',
  darkText: '#1A1A2E',
  white: '#FFFFFF',
  mediumGray: '#9E9E9E',
  progressBg: '#E8E8E8',
  cardBorder: '#F0F0F0',
};

const CampaignCard = ({ charity }) => {
  const { name, icon, description, raised, goal, beneficiaries } = charity;
  const progress = goal > 0 ? Math.min(raised / goal, 1) : 0;
  const progressPercent = Math.round(progress * 100);

  return (
    <View style={styles.campaignCard}>
      {/* Card Header */}
      <View style={styles.campaignHeader}>
        <Text style={styles.campaignIcon}>{icon}</Text>
        <View style={styles.campaignTitleGroup}>
          <Text style={styles.campaignName}>{name}</Text>
          <Text style={styles.campaignBeneficiaries}>
            {beneficiaries} beneficiaries
          </Text>
        </View>
        <View style={styles.campaignPercentBadge}>
          <Text style={styles.campaignPercentText}>{progressPercent}%</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.campaignDescription} numberOfLines={2}>
        {description}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Raised / Goal */}
      <View style={styles.campaignFooter}>
        <Text style={styles.raisedText}>
          <Text style={styles.raisedAmount}>{formatCurrency(raised)}</Text>
          {' raised'}
        </Text>
        <Text style={styles.goalText}>Goal: {formatCurrency(goal)}</Text>
      </View>
    </View>
  );
};

const TransactionItem = ({ item }) => (
  <View style={styles.txItem}>
    <Text style={styles.txIcon}>{item.campaignIcon}</Text>
    <View style={styles.txInfo}>
      <Text style={styles.txCampaign} numberOfLines={1}>
        {item.campaignName}
      </Text>
      <Text style={styles.txProduct} numberOfLines={1}>
        From: {item.productName}
      </Text>
      <Text style={styles.txDate}>{formatDate(item.date)}</Text>
    </View>
    <Text style={styles.txAmount}>{formatCurrency(item.amount)}</Text>
  </View>
);

export default function CharityScreen() {
  const totalDonated = useStore((state) => state.charity.totalDonated);
  const monthlyDonated = useStore((state) => state.charity.monthlyDonated);
  const monthlyGoal = useStore((state) => state.charity.monthlyGoal);
  const setCharityCampaigns = useStore((state) => state.setCharityCampaigns);
  const setCharityTransactions = useStore(
    (state) => state.setCharityTransactions
  );

  useEffect(() => {
    setCharityCampaigns(CHARITIES);
    setCharityTransactions(TRANSACTIONS);
  }, []);

  const totalProgress = monthlyGoal > 0 ? Math.min(monthlyDonated / monthlyGoal, 1) : 0;
  const totalProgressPercent = Math.round(totalProgress * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <Text style={styles.heroHeadline}>Every Purchase Helps ❤️</Text>
          <Text style={styles.heroSubtitle}>
            5% of every sale is donated to causes that matter
          </Text>
        </View>

        {/* Live Counter */}
        <View style={styles.counterCard}>
          <Text style={styles.counterLabel}>Total Community Donations</Text>
          <Text style={styles.counterAmount}>{formatCurrency(totalDonated)}</Text>
          <Text style={styles.counterSub}>donated to charity</Text>

          {/* Monthly Progress */}
          <View style={styles.monthlySection}>
            <View style={styles.monthlyHeader}>
              <Text style={styles.monthlyLabel}>This Month's Progress</Text>
              <Text style={styles.monthlyPercent}>{totalProgressPercent}%</Text>
            </View>
            <View style={styles.monthlyTrack}>
              <View
                style={[styles.monthlyFill, { width: `${totalProgressPercent}%` }]}
              />
            </View>
            <View style={styles.monthlyFooter}>
              <Text style={styles.monthlyRaised}>
                {formatCurrency(monthlyDonated)} raised
              </Text>
              <Text style={styles.monthlyGoalText}>
                Goal: {formatCurrency(monthlyGoal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Impact Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1,255</Text>
            <Text style={styles.statLabel}>Lives Impacted</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMiddle]}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Active Causes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5%</Text>
            <Text style={styles.statLabel}>Per Purchase</Text>
          </View>
        </View>

        {/* Campaign Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Campaigns</Text>
          {CHARITIES.map((charity) => (
            <CampaignCard key={charity.id} charity={charity} />
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          <FlatList
            data={TRANSACTIONS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionItem item={item} />}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.txDivider} />}
          />
        </View>

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
  scrollView: {
    flex: 1,
  },
  heroHeader: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },
  heroHeadline: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 20,
  },
  counterCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: 14,
    marginTop: -16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  counterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mediumGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  counterAmount: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  counterSub: {
    fontSize: 14,
    color: COLORS.mediumGray,
    marginBottom: 20,
  },
  monthlySection: {
    width: '100%',
  },
  monthlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  monthlyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  monthlyPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  monthlyTrack: {
    height: 10,
    backgroundColor: COLORS.progressBg,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  monthlyFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  monthlyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyRaised: {
    fontSize: 12,
    color: COLORS.mediumGray,
  },
  monthlyGoalText: {
    fontSize: 12,
    color: COLORS.mediumGray,
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
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
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
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 12,
  },
  campaignCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  campaignIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  campaignTitleGroup: {
    flex: 1,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  campaignBeneficiaries: {
    fontSize: 12,
    color: COLORS.mediumGray,
  },
  campaignPercentBadge: {
    backgroundColor: '#FFF4F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  campaignPercentText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  campaignDescription: {
    fontSize: 13,
    color: COLORS.mediumGray,
    lineHeight: 19,
    marginBottom: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.progressBg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  raisedText: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  raisedAmount: {
    fontWeight: '700',
    color: COLORS.darkText,
  },
  goalText: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
  },
  txDivider: {
    height: 6,
  },
  txIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txCampaign: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  txProduct: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginBottom: 2,
  },
  txDate: {
    fontSize: 11,
    color: COLORS.mediumGray,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bottomSpace: {
    height: 30,
  },
});
