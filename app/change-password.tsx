
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
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword, isFirstLogin } = useAuth();
  const router = useRouter();

  const handleChangePassword = () => {
    console.log('Attempting to change password...');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    const success = changePassword(currentPassword, newPassword);
    if (success) {
      Alert.alert(
        'Success',
        'Password changed successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Password changed, navigating to home');
              router.replace('/(tabs)/(home)/');
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Current password is incorrect');
    }
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
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <IconSymbol name="lock.shield" size={64} color={colors.primary} />
            </View>
            <Text style={styles.title}>Change Password</Text>
            {isFirstLogin && (
              <View style={styles.warningBanner}>
                <IconSymbol name="exclamationmark.triangle" size={20} color={colors.warning} />
                <Text style={styles.warningText}>
                  You must change your password before continuing
                </Text>
              </View>
            )}
            <Text style={styles.subtitle}>
              {isFirstLogin 
                ? 'Please set a new secure password' 
                : 'Update your password'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textSecondary}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <IconSymbol
                    name={showCurrentPassword ? 'eye.slash' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textSecondary}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <IconSymbol
                    name={showNewPassword ? 'eye.slash' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
              <Text style={styles.hint}>Minimum 6 characters</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <IconSymbol
                    name={showConfirmPassword ? 'eye.slash' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.changeButton} onPress={handleChangePassword}>
              <Text style={styles.changeButtonText}>Change Password</Text>
            </Pressable>

            {!isFirstLogin && (
              <Pressable
                style={styles.cancelButton}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            )}
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    width: '100%',
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  changeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 2px 8px rgba(0, 123, 255, 0.3)',
    elevation: 3,
  },
  changeButtonText: {
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
