import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider, useLanguage } from './src/i18n/LanguageContext';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import JournalScreen from './src/screens/JournalScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.tabIcon, { color: focused ? colors.tabActive : colors.tabInactive }]}>
      {label}
    </Text>
  );
}

function TabNavigator() {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('tabHome'),
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarLabel: t('tabJournal'),
          tabBarIcon: ({ focused }) => <TabIcon label="📝" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: t('tabHistory'),
          tabBarIcon: ({ focused }) => <TabIcon label="📅" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('tabSettings'),
          tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBarBg,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 4,
    paddingTop: 4,
    height: 56,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabIcon: {
    fontSize: 22,
  },
});
