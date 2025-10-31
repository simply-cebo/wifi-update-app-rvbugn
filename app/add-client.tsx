
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useClients } from '@/contexts/ClientContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddClientScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subscriptionDays, setSubscriptionDays] = useState('30');
  const [notes, setNotes] = useState('');
  const { addClient } = useClients();
  const router = useRouter();

  const handleAddClient = () => {
    console.log('Attempting to add client...');
    
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const days = parseInt(subscriptionDays, 10);
    if (isNaN(days) || days < 0) {
      Alert.alert('Error', 'Please enter a valid number of days');
      return;
    }

    // Determine status based on days
    let status: 'active' | 'expiring' | 'expired';
    if (days <= 0) {
      status = 'expired';
    } else if (days <= 7) {
      status = 'expiring';
    } else {
      status = 'active';
    }

    const newClient = {
      name,
      email,
      phone,
      subscriptionDays: days,
      subscriptionEndDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      status,
      notes: notes || 'New client',
    };

    addClient(newClient);
    
    Alert.alert(
      'Success',
      `${name} has been added successfully`,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('Client added, navigating back');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </Pressable>
            <Text style={styles.title}>Add New Client</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter client name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Subscription Days *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter number of days"
                placeholderTextColor={colors.textSecondary}
                value={subscriptionDays}
                onChangeText={setSubscriptionDays}
                keyboardType="number-pad"
              />
              <Text style={styles.hint}>
                Number of days the subscription is valid for
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any notes about this client"
                placeholderTextColor={colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Pressable style={styles.addButton} onPress={handleAddClient}>
              <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Client</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  form: {
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 123, 255, 0.3)',
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
