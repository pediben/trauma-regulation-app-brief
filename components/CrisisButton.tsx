import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Linking, StyleSheet, Pressable, Platform } from 'react-native';
import { colors, spacing, radius, typography } from '../constants/theme';

export function CrisisButton() {
  const [open, setOpen] = useState(false);
  const resources = [
    { label: '988 Suicide & Crisis Lifeline', sub: 'Call or text 988 (US)', href: 'tel:988' },
    { label: 'Crisis Text Line', sub: 'Text HOME to 741741', href: 'sms:741741?body=HOME' },
    { label: 'Find a Therapist', sub: 'Psychology Today directory', href: 'https://www.psychologytoday.com/us/therapists' },
    { label: 'Find an EMDR Therapist', sub: 'EMDRIA therapist finder', href: 'https://www.emdria.org/find-an-emdr-therapist/' },
  ];

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)} accessibilityLabel="Get help now">
        <Text style={styles.triggerText}>Need help now?</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>This is a lot right now.</Text>
            <Text style={styles.sheetBody}>You don't have to handle it alone. These people can help.</Text>
            {resources.map((r) => (
              <TouchableOpacity key={r.label} style={styles.resourceRow} onPress={() => Linking.openURL(r.href).catch(() => {})}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resourceLabel}>{r.label}</Text>
                  <Text style={styles.resourceSub}>{r.sub}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeBtnText}>I'm okay for now</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { alignSelf: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  triggerText: { ...typography.bodySmall, color: colors.textMuted, textDecorationLine: 'underline' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl },
  sheetTitle: { ...typography.heading2, marginBottom: spacing.sm },
  sheetBody: { ...typography.bodySmall, marginBottom: spacing.lg },
  resourceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  resourceLabel: { ...typography.body, fontWeight: '600' },
  resourceSub: { ...typography.bodySmall, marginTop: 2 },
  arrow: { fontSize: 22, color: colors.textMuted, marginLeft: spacing.sm },
  closeBtn: { marginTop: spacing.lg, backgroundColor: colors.surfaceHigh, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center' },
  closeBtnText: { ...typography.body, fontWeight: '600', color: colors.teal },
});
