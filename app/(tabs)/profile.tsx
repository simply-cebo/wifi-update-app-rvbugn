
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
  const { adminName, username, logout } = useAuth();
  const { clients } = useClients();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const expiringClients = clients.filter(c => c.status === 'expiring').length;
  const expiredClients = clients.filter(c => c.status === 'expired').length;

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
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            </View>
            <Text style={styles.adminName}>{adminName}</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalClients}</Text>
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

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <Pressable style={styles.menuItem} onPress={handleChangePassword}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="lock.shield" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Change Password</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>

            <Pressable 
              style={styles.menuItem}
              onPress={() => router.push('/add-client')}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol name="person.badge.plus" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Add Client</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <View style={styles.infoCard}>
              <IconSymbol name="wifi" size={32} color={colors.primary} />
              <Text style={styles.appName}>WiFi Admin</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                Manage WiFi subscriptions and keep your clients updated
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#ffffff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
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
  avatarContainer: {
    marginBottom: 16,
  },
  adminName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(220, 38, 38, 0.3)',
    elevation: 3,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
