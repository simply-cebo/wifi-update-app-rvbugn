
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/contexts/ClientContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { adminName, logout } = useAuth();
  const { clients } = useClients();
  const router = useRouter();

  const activeClients = clients.filter(c => c.status === 'active').length;
  const expiringClients = clients.filter(c => c.status === 'expiring').length;
  const expiredClients = clients.filter(c => c.status === 'expired').length;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
          }}
        />
      )}
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {adminName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <Text style={styles.adminName}>{adminName}</Text>
            <Text style={styles.adminRole}>Administrator</Text>
          </View>

          {/* Statistics Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{clients.length}</Text>
                <Text style={styles.statLabel}>Total Clients</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.success }]}>
                  {activeClients}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.warning }]}>
                  {expiringClients}
                </Text>
                <Text style={styles.statLabel}>Expiring</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.danger }]}>
                  {expiredClients}
                </Text>
                <Text style={styles.statLabel}>Expired</Text>
              </View>
            </View>
          </View>

          {/* Settings Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Settings</Text>
            
            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol name="bell" size={24} color={colors.text} />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol name="gear" size={24} color={colors.text} />
                <Text style={styles.settingText}>Preferences</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol name="questionmark.circle" size={24} color={colors.text} />
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol name="info.circle" size={24} color={colors.text} />
                <Text style={styles.settingText}>About</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Logout Button */}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#ffffff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>WiFi Admin v1.0.0</Text>
            <Text style={styles.appInfoText}>© 2024 WiFi Management</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
  },
  adminName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  adminRole: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 12,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(220, 53, 69, 0.3)',
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
