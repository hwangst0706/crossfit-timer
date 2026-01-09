/**
 * @file ResultScreen
 * @brief 운동 완료 결과 화면
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { useAppStore } from '../store';
import { formatTimeMMSS, formatTimeReadable } from '../utils/formatTime';
import { TIMER_MODES } from '../constants/timerDefaults';

export default function ResultScreen(): React.JSX.Element
{
    const navigation = useNavigation<any>();
    const { timer, resetTimer } = useAppStore();
    const { mode, nElapsedTime, nCurrentRound, stConfig } = timer;

    const modeInfo = TIMER_MODES.find((m) => m.mode === mode);

    const handleDone = (): void =>
    {
        resetTimer();
        navigation.dispatch(StackActions.popToTop());
    };

    const handleRepeat = (): void =>
    {
        resetTimer();
        navigation.navigate('Timer');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>🎉</Text>
                <Text style={styles.title}>운동 완료!</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>운동 모드</Text>
                        <Text style={styles.statValue}>
                            {modeInfo?.szIcon} {modeInfo?.szTitle}
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>총 시간</Text>
                        <Text style={styles.statValue}>{formatTimeReadable(nElapsedTime)}</Text>
                    </View>

                    {mode !== 'FOR_TIME' && (
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>완료 라운드</Text>
                            <Text style={styles.statValue}>{nCurrentRound}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.encouragement}>수고하셨습니다! 💪</Text>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.repeatButton} onPress={handleRepeat}>
                    <Text style={styles.repeatButtonText}>다시 하기</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                    <Text style={styles.doneButtonText}>완료</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    icon: {
        fontSize: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 32,
    },
    statsContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        marginBottom: 24,
    },
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    statLabel: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    encouragement: {
        fontSize: 20,
        color: colors.accent,
        fontWeight: '600',
    },
    buttons: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 48,
        gap: 16,
    },
    repeatButton: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    repeatButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    doneButton: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    doneButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
});
