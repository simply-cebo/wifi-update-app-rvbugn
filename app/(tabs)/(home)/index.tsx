
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/contexts/ClientContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isAuthenticated, logout, adminName } = useAuth();
  const { clients, removeClient } = useClients();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const filteredClients = clients.filter(
    client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  const activeClients = filteredClients.filter(c => c.status === 'active').length;
  const expiringClients = filteredClients.filter(c => c.status === 'expiring').length;
  const expiredClients = filteredClients.filter(c => c.status === 'expired').length;

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

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleRemoveClient = (clientId: string, clientName: string) => {
    Alert.alert(
      'Remove Client',
      `Are you sure you want to remove ${clientName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeClient(clientId);
            Alert.alert('Success', `${clientName} has been removed`);
          },
        },
      ]
    );
  };

  const renderHeaderRight = () => (
    <Pressable onPress={logout} style={styles.headerButton}>
      <IconSymbol name="rectangle.portrait.and.arrow.right" color={colors.danger} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'WiFi Subscriptions',
            headerRight: renderHeaderRight,
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
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.adminName}>{adminName}</Text>
            </View>
            {Platform.OS !== 'ios' && (
              <Pressable onPress={logout} style={styles.logoutButton}>
                <IconSymbol name="rectangle.portrait.and.arrow.right" color={colors.danger} size={24} />
              </Pressable>
            )}
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { borderLeftColor: colors.success }]}>
              <Text style={styles.statNumber}>{activeClients}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: colors.warning }]}>
              <Text style={styles.statNumber}>{expiringClients}</Text>
              <Text style={styles.statLabel}>Expiring</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: colors.danger }]}>
              <Text style={styles.statNumber}>{expiredClients}</Text>
              <Text style={styles.statLabel}>Expired</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search clients..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>

          {/* Add Client Button */}
          <Pressable
            style={styles.addClientButton}
            onPress={() => router.push('/add-client')}
          >
            <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
            <Text style={styles.addClientButtonText}>Add New Client</Text>
          </Pressable>

          {/* Client List */}
          <View style={styles.clientsSection}>
            <Text style={styles.sectionTitle}>
              Clients ({filteredClients.length})
            </Text>
            {filteredClients.map(client => (
              <View key={client.id} style={styles.clientCard}>
                <Pressable
                  style={styles.clientCardContent}
                  onPress={() => router.push(`/client-detail?id=${client.id}`)}
                >
                  <View style={styles.clientHeader}>
                    <View style={styles.clientInfo}>
                      <Text style={styles.clientName}>{client.name}</Text>
                      <Text style={styles.clientEmail}>{client.email}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(client.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusLabel(client.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.clientDetails}>
                    <View style={styles.detailRow}>
                      <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {client.subscriptionDays} days remaining
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <IconSymbol name="phone" size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{client.phone}</Text>
                    </View>
                  </View>

                  <View style={styles.clientFooter}>
                    <Text style={styles.lastUpdate}>
                      Last updated: {new Date(client.lastUpdate).toLocaleDateString()}
                    </Text>
                    <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                  </View>
                </Pressable>

                {/* Remove Button */}
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemoveClient(client.id, client.name)}
                >
                  <IconSymbol name="trash" size={20} color={colors.danger} />
                </Pressable>
              </View>
            ))}

            {filteredClients.length === 0 && (
              <View style={styles.emptyState}>
                <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No clients found</Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting your search query
                </Text>
              </View>
            )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  adminName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  headerButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  addClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 123, 255, 0.3)',
    elevation: 3,
  },
  addClientButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  clientsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  clientCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    overflow: 'hidden',
  },
  clientCardContent: {
    padding: 16,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  clientDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  clientFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  lastUpdate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  removeButton: {
    backgroundColor: colors.highlight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
