/**
 * @file HomeScreen
 * @brief 메인 화면 - 타이머 모드 선택
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { TIMER_MODES } from '../constants/timerDefaults';
import { TimerMode } from '../types';

export default function HomeScreen(): React.JSX.Element
{
    const navigation = useNavigation<any>();

    const handleModeSelect = (mode: TimerMode): void =>
    {
        navigation.navigate('TimerConfig', { mode });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <View style={styles.header}>
                <Text style={styles.title}>CrossFit Timer</Text>
                <Text style={styles.subtitle}>운동 모드를 선택하세요</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {TIMER_MODES.map((modeInfo) => (
                    <TouchableOpacity
                        key={modeInfo.mode}
                        style={[
                            styles.modeCard,
                            { borderLeftColor: getModeColor(modeInfo.mode) },
                        ]}
                        onPress={() => handleModeSelect(modeInfo.mode)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.modeIconContainer}>
                            <Text style={styles.modeIcon}>{modeInfo.szIcon}</Text>
                        </View>
                        <View style={styles.modeInfo}>
                            <Text style={styles.modeTitle}>{modeInfo.szTitle}</Text>
                            <Text style={styles.modeDescription}>{modeInfo.szDescription}</Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

function getModeColor(mode: TimerMode): string
{
    switch (mode)
    {
        case 'EMOM':
            return colors.emom;
        case 'AMRAP':
            return colors.amrap;
        case 'TABATA':
            return colors.tabata;
        case 'FOR_TIME':
            return colors.forTime;
        case 'CUSTOM_INTERVAL':
            return colors.customInterval;
        default:
            return colors.primary;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    modeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 12,
        padding: 20,
        borderLeftWidth: 4,
    },
    modeIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    modeIcon: {
        fontSize: 24,
    },
    modeInfo: {
        flex: 1,
    },
    modeTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    modeDescription: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    chevron: {
        fontSize: 28,
        color: colors.textSecondary,
        marginLeft: 8,
    },
});
