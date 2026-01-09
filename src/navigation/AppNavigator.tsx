/**
 * @file AppNavigator
 * @brief 앱 네비게이션 설정
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import TimerConfigScreen from '../screens/TimerConfigScreen';
import TimerScreen from '../screens/TimerScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ szIcon, bFocused }: { szIcon: string; bFocused: boolean }): React.JSX.Element
{
    return (
        <View style={styles.tabIconContainer}>
            <Text style={[styles.tabIcon, bFocused && styles.tabIconFocused]}>
                {szIcon}
            </Text>
        </View>
    );
}

function HomeTabs(): React.JSX.Element
{
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: '홈',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon szIcon="🏠" bFocused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: '기록',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon szIcon="📊" bFocused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: '설정',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon szIcon="⚙️" bFocused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator(): React.JSX.Element
{
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="MainTabs" component={HomeTabs} />
                <Stack.Screen name="TimerConfig" component={TimerConfigScreen} />
                <Stack.Screen
                    name="Timer"
                    component={TimerScreen}
                    options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                    name="Result"
                    component={ResultScreen}
                    options={{ gestureEnabled: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 20,
        opacity: 0.6,
    },
    tabIconFocused: {
        opacity: 1,
    },
});
