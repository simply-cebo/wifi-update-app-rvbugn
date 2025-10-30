
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useClients } from '@/contexts/ClientContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getClientById, updateClient, sendUpdateMessage } = useClients();
  
  const client = getClientById(id as string);
  
  const [subscriptionDays, setSubscriptionDays] = useState(
    client?.subscriptionDays.toString() || '0'
  );
  const [notes, setNotes] = useState(client?.notes || '');
  const [customMessage, setCustomMessage] = useState('');

  if (!client) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Client not found</Text>
      </View>
    );
  }

  const handleUpdateSubscription = () => {
    const days = parseInt(subscriptionDays, 10);
    if (isNaN(days) || days < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number of days');
      return;
    }

    updateClient(client.id, {
      subscriptionDays: days,
      notes: notes,
    });

    Alert.alert(
      'Success',
      `Subscription updated to ${days} days`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleSendMessage = () => {
    if (!customMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    sendUpdateMessage(client.id, customMessage);
    Alert.alert(
      'Message Sent',
      `Update message sent to ${client.name}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCustomMessage('');
            router.back();
          },
        },
      ]
    );
  };

  const handleQuickUpdate = (days: number) => {
    const newDays = client.subscriptionDays + days;
    if (newDays < 0) {
      Alert.alert('Error', 'Subscription days cannot be negative');
      return;
    }
    setSubscriptionDays(newDays.toString());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'expiring':
        return colors.warning;
      case 'expired':
        return colors.danger;
      default:
        return colors.secondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Client Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {client.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.clientHeaderInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(client.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {client.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <IconSymbol name="envelope" size={18} color={colors.textSecondary} />
                <Text style={styles.infoText}>{client.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <IconSymbol name="phone" size={18} color={colors.textSecondary} />
                <Text style={styles.infoText}>{client.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <IconSymbol name="calendar" size={18} color={colors.textSecondary} />
                <Text style={styles.infoText}>
                  Expires: {new Date(client.subscriptionEndDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Subscription Update Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Update Subscription</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Days Remaining</Text>
              <TextInput
                style={styles.input}
                value={subscriptionDays}
                onChangeText={setSubscriptionDays}
                keyboardType="number-pad"
                placeholder="Enter days"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.quickActions}>
              <Text style={styles.quickActionsLabel}>Quick Actions:</Text>
              <View style={styles.quickButtonsRow}>
                <Pressable
                  style={[styles.quickButton, { backgroundColor: colors.danger }]}
                  onPress={() => handleQuickUpdate(-7)}
                >
                  <Text style={styles.quickButtonText}>-7 days</Text>
                </Pressable>
                <Pressable
                  style={[styles.quickButton, { backgroundColor: colors.warning }]}
                  onPress={() => handleQuickUpdate(-1)}
                >
                  <Text style={styles.quickButtonText}>-1 day</Text>
                </Pressable>
                <Pressable
                  style={[styles.quickButton, { backgroundColor: colors.success }]}
                  onPress={() => handleQuickUpdate(7)}
                >
                  <Text style={styles.quickButtonText}>+7 days</Text>
                </Pressable>
                <Pressable
                  style={[styles.quickButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleQuickUpdate(30)}
                >
                  <Text style={styles.quickButtonText}>+30 days</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this client..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Pressable style={styles.updateButton} onPress={handleUpdateSubscription}>
              <IconSymbol name="checkmark.circle" size={20} color="#ffffff" />
              <Text style={styles.updateButtonText}>Update Subscription</Text>
            </Pressable>
          </View>

          {/* Send Message Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Send Update Message</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Custom Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={customMessage}
                onChangeText={setCustomMessage}
                placeholder="Enter message to send to client..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.messageTemplates}>
              <Text style={styles.quickActionsLabel}>Quick Templates:</Text>
              <Pressable
                style={styles.templateButton}
                onPress={() =>
                  setCustomMessage(
                    `Hi ${client.name}, your WiFi subscription has ${subscriptionDays} days remaining. Please renew soon to avoid service interruption.`
                  )
                }
              >
                <Text style={styles.templateButtonText}>Renewal Reminder</Text>
              </Pressable>
              <Pressable
                style={styles.templateButton}
                onPress={() =>
                  setCustomMessage(
                    `Hi ${client.name}, your WiFi subscription has been successfully renewed. Thank you for your payment!`
                  )
                }
              >
                <Text style={styles.templateButtonText}>Payment Confirmation</Text>
              </Pressable>
              <Pressable
                style={styles.templateButton}
                onPress={() =>
                  setCustomMessage(
                    `Hi ${client.name}, your WiFi subscription is expiring soon. Contact us to renew your service.`
                  )
                }
              >
                <Text style={styles.templateButtonText}>Expiration Warning</Text>
              </Pressable>
            </View>

            <Pressable style={styles.sendButton} onPress={handleSendMessage}>
              <IconSymbol name="paperplane" size={20} color="#ffffff" />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  clientHeaderInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  quickActions: {
    marginBottom: 16,
  },
  quickActionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  updateButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  messageTemplates: {
    marginBottom: 16,
  },
  templateButton: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
