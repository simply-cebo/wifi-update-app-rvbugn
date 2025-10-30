
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = tabs.findIndex((tab) => pathname.includes(tab.name));
  const animatedIndex = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  React.useEffect(() => {
    const newIndex = tabs.findIndex((tab) => pathname.includes(tab.name));
    if (newIndex >= 0) {
      animatedIndex.value = withSpring(newIndex, {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [pathname, tabs, animatedIndex]);

  const handleTabPress = (route: string) => {
    console.log('Tab pressed:', route);
    router.push(route as any);
  };

  const tabWidth = containerWidth / tabs.length;

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animatedIndex.value,
            tabs.map((_, i) => i),
            tabs.map((_, i) => i * tabWidth)
          ),
        },
      ],
    };
  });

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.safeArea,
        {
          bottom: bottomMargin,
        },
      ]}
    >
      <BlurView
        intensity={80}
        tint={theme.dark ? 'dark' : 'light'}
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius: borderRadius,
            backgroundColor: theme.dark
              ? 'rgba(28, 28, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            {
              width: tabWidth,
              backgroundColor: colors.primary,
            },
          ]}
        />
        {tabs.map((tab, index) => {
          const isActive = pathname.includes(tab.name);
          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tab, { width: tabWidth }]}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={tab.icon as any}
                size={24}
                color={isActive ? '#ffffff' : colors.text}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? '#ffffff' : colors.text,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    borderRadius: 24,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
