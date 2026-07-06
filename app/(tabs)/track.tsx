import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { StateCard, stateColor, stateLabel } from '../../components/StateCard';
import { CrisisButton } from '../../components/CrisisButton';
import { useCheckIns } from '../../hooks/useCheckIns';
import type { NervousSystemState } from '../../constants/exercises';

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function WindowOfToleranceBar({ checkIns }: { checkIns: { state: NervousSystemState; timestamp: number }[] }) {
  const recent = checkIns.slice(0, 20);
  if (recent.length === 0) return null;
  const stateY: Record<NervousSystemState, number> = { activated: 0, calm: 1, shutdown: 2 };
  return (
    <View style={barStyles.container}>
      <Text style={barStyles.title}>Window of Tolerance — last 20 check-ins</Text>
      <View style={barStyles.track}>
        <View style={barStyles.zones}>
          <View style={[barStyles.zone, { backgroundColor: `${colors.activated}22`, flex: 1 }]}>
            <Text style={barStyles.zoneLabel}>Activated</Text>
          </View>
          <View style={[barStyles.zone, { backgroundColor: `${colors.calm}22`, flex: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: `${colors.calm}44` }]}>
            <Text style={[barStyles.zoneLabel, { color: colors.calm }]}>In Window ✓</Text>
          </View>
          <View style={[barStyles.zone, { backgroundColor: `${colors.shutDown}22`, flex: 1 }]}>
            <Text style={barStyles.zoneLabel}>Shut Down</Text>
          </View>
        </View>
        <View style={barStyles.dotsRow}>
          {recent.map((ci, i) => {
            const y = stateY[ci.state];
            return (
              <View key={i} style={barStyles.dotCol}>
                <View style={{ flex: y, minHeight: 0 }} />
                <View style={[barStyles.dot, { backgroundColor: stateColor(ci.state) }]} />
                <View style={{ flex: 2 - y, minHeight: 0 }} />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  container: { marginBottom: spacing.xl },
  title: { ...typography.label, marginBottom: spacing.sm },
  track: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  zones: { flexDirection: 'column' },
  zone: { padding: spacing.xs, paddingLeft: spacing.sm },
  zoneLabel: { ...typography.label, color: colors.textMuted, fontSize: 10 },
  dotsRow: { flexDirection: 'row', height: 60, paddingHorizontal: spacing.xs, gap: 4, paddingVertical: spacing.xs },
  dotCol: { flex: 1, flexDirection: 'column', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export default function TrackTab() {
  const { checkIns, addCheckIn, clearAll } = useCheckIns();
  const [checkInState, setCheckInState] = useState<NervousSystemState | null>(null);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  function handleCheckIn() {
    if (!checkInState) return;
    addCheckIn(checkInState);
    setJustCheckedIn(true);
    setTimeout(() => { setJustCheckedIn(false); setCheckInState(null); }, 2000);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Track</Text>
        <Text style={styles.sub}>Quick check-in to see your patterns over time.</Text>
        <View style={styles.checkInCard}>
          <Text style={styles.sectionLabel}>How are you right now?</Text>
          {(['activated', 'calm', 'shutdown'] as NervousSystemState[]).map((state) => (
            <StateCard key={state} state={state} compact selected={checkInState === state}
              onPress={() => setCheckInState(checkInState === state ? null : state)} />
          ))}
          <TouchableOpacity style={[styles.saveBtn, !checkInState && styles.saveBtnDisabled]}
            onPress={handleCheckIn} disabled={!checkInState}>
            <Text style={styles.saveBtnText}>{justCheckedIn ? '✓ Saved' : 'Save check-in'}</Text>
          </TouchableOpacity>
        </View>
        {checkIns.length > 0 && (
          <>
            <WindowOfToleranceBar checkIns={checkIns} />
            <Text style={styles.sectionLabel}>Recent check-ins</Text>
            {checkIns.slice(0, 15).map((ci) => (
              <View key={ci.id} style={styles.historyRow}>
                <View style={[styles.historyDot, { backgroundColor: stateColor(ci.state) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyLabel}>{stateLabel(ci.state)}</Text>
                  <Text style={styles.historyTime}>{formatTime(ci.timestamp)}</Text>
                </View>
              </View>
            ))}
            {checkIns.length > 15 && <Text style={styles.moreNote}>+ {checkIns.length - 15} more check-ins</Text>}
            <TouchableOpacity style={styles.clearBtn} onPress={() => Alert.alert('Clear all check-ins?', 'This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearAll },
            ])}>
              <Text style={styles.clearText}>Clear history</Text>
            </TouchableOpacity>
          </>
        )}
        {checkIns.length === 0 && (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No check-ins yet</Text>
            <Text style={styles.emptyBody}>After a few check-ins you'll start to see your patterns.</Text>
          </View>
        )}
        <CrisisButton />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  heading: { ...typography.heading1, marginBottom: spacing.xs },
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  checkInCard: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  sectionLabel: { ...typography.label, marginBottom: spacing.md },
  saveBtn: { marginTop: spacing.md, backgroundColor: colors.teal, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: colors.surfaceHigh },
  saveBtnText: { ...typography.body, fontWeight: '700', color: colors.bg },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  historyDot: { width: 12, height: 12, borderRadius: 6 },
  historyLabel: { ...typography.body, fontWeight: '500' },
  historyTime: { ...typography.bodySmall, marginTop: 2 },
  moreNote: { ...typography.bodySmall, textAlign: 'center', marginTop: spacing.md },
  clearBtn: { marginTop: spacing.lg, alignSelf: 'center', padding: spacing.sm },
  clearText: { ...typography.bodySmall, color: colors.textMuted, textDecorationLine: 'underline' },
  emptyHistory: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyIcon: { fontSize: 40, marginBottom: spacing.md },
  emptyTitle: { ...typography.heading3, marginBottom: spacing.sm },
  emptyBody: { ...typography.bodySmall, textAlign: 'center', lineHeight: 22 },
});
