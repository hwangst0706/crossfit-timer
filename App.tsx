/**
 * @file App.tsx
 * @brief CrossFit Timer 앱 엔트리 포인트
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeAudio } from './src/utils/alerts';
import { colors } from './src/constants/colors';

export default function App(): React.JSX.Element
{
    useEffect(() =>
    {
        initializeAudio();
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" backgroundColor={colors.background} />
            <AppNavigator />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});
