/**
 * @file TimerScreen
 * @brief 타이머 실행 화면
 */

import React, { useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    AppState,
    AppStateStatus,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import { colors } from '../constants/colors';
import { useAppStore } from '../store';
import { formatTimeMMSS } from '../utils/formatTime';
import { handlePhaseEnd, isCountUpMode } from '../utils/timerLogic';
import { playAlert, alertCountdown } from '../utils/alerts';

export default function TimerScreen(): React.JSX.Element
{
    useKeepAwake();

    const navigation = useNavigation<any>();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const backgroundTimeRef = useRef<number>(0);

    const {
        timer,
        decrementTime,
        incrementTime,
        updateTimerState,
        setTimerStatus,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        saveWorkout,
    } = useAppStore();

    const { status, nRemainingTime, nCurrentRound, nTotalRounds, bIsWorkPhase, stConfig, mode, nElapsedTime } = timer;

    const tick = useCallback(() =>
    {
        if (isCountUpMode(mode))
        {
            incrementTime();

            if (stConfig?.stForTime?.nCapMinutes)
            {
                const nCap = stConfig.stForTime.nCapMinutes * 60;
                if (nRemainingTime >= nCap)
                {
                    setTimerStatus('finished');
                    playAlert('finish');
                }
            }
        }
        else
        {
            if (nRemainingTime <= 3 && nRemainingTime > 0)
            {
                alertCountdown(nRemainingTime);
            }

            if (nRemainingTime <= 1)
            {
                if (stConfig)
                {
                    const stNewState = handlePhaseEnd(stConfig, timer);

                    if (stNewState.status === 'finished')
                    {
                        playAlert('finish');
                        updateTimerState(stNewState);
                    }
                    else
                    {
                        const bWasWorkPhase = bIsWorkPhase;
                        const bIsNowWorkPhase = stNewState.bIsWorkPhase ?? bIsWorkPhase;

                        if (bWasWorkPhase !== bIsNowWorkPhase)
                        {
                            playAlert(bIsNowWorkPhase ? 'work' : 'rest');
                        }
                        else
                        {
                            playAlert('beep');
                        }

                        updateTimerState(stNewState);
                    }
                }
            }
            else
            {
                decrementTime();
            }
        }
    }, [mode, nRemainingTime, stConfig, timer, bIsWorkPhase]);

    useEffect(() =>
    {
        if (status === 'running')
        {
            intervalRef.current = setInterval(tick, 1000);
        }
        else
        {
            if (intervalRef.current)
            {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () =>
        {
            if (intervalRef.current)
            {
                clearInterval(intervalRef.current);
            }
        };
    }, [status, tick]);

    useEffect(() =>
    {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [status, nRemainingTime]);

    const handleAppStateChange = (nextAppState: AppStateStatus): void =>
    {
        if (nextAppState === 'background' && status === 'running')
        {
            backgroundTimeRef.current = Date.now();
        }
        else if (nextAppState === 'active' && backgroundTimeRef.current > 0)
        {
            const nElapsed = Math.floor((Date.now() - backgroundTimeRef.current) / 1000);
            syncAfterBackground(nElapsed);
            backgroundTimeRef.current = 0;
        }
    };

    const syncAfterBackground = (nElapsedSeconds: number): void =>
    {
        if (isCountUpMode(mode))
        {
            updateTimerState({
                nRemainingTime: nRemainingTime + nElapsedSeconds,
                nElapsedTime: nElapsedTime + nElapsedSeconds,
            });
        }
        else
        {
            const nNewTime = Math.max(0, nRemainingTime - nElapsedSeconds);
            updateTimerState({
                nRemainingTime: nNewTime,
                nElapsedTime: nElapsedTime + nElapsedSeconds,
            });

            if (nNewTime <= 0)
            {
                setTimerStatus('finished');
            }
        }
    };

    const handlePlayPause = (): void =>
    {
        if (status === 'idle')
        {
            startTimer();
            playAlert('beep');
        }
        else if (status === 'running')
        {
            pauseTimer();
        }
        else if (status === 'paused')
        {
            resumeTimer();
        }
    };

    const handleReset = (): void =>
    {
        resetTimer();
    };

    const handleFinish = (): void =>
    {
        if (stConfig)
        {
            const stWorkout = {
                szId: Date.now().toString(),
                szDate: new Date().toISOString(),
                mode: mode,
                stConfig: stConfig,
                nDuration: nElapsedTime,
                nRoundsCompleted: nCurrentRound,
            };
            saveWorkout(stWorkout);
        }
        navigation.navigate('Result');
    };

    const handleBack = (): void =>
    {
        resetTimer();
        navigation.goBack();
    };

    const getPhaseColor = (): string =>
    {
        if (mode === 'FOR_TIME' || mode === 'AMRAP')
        {
            return colors.accent;
        }
        return bIsWorkPhase ? colors.work : colors.rest;
    };

    const getPhaseText = (): string =>
    {
        if (mode === 'FOR_TIME')
        {
            return 'GO!';
        }
        if (mode === 'AMRAP')
        {
            return 'AMRAP';
        }
        return bIsWorkPhase ? 'WORK' : 'REST';
    };

    const getRoundText = (): string =>
    {
        if (mode === 'FOR_TIME')
        {
            return '';
        }
        if (mode === 'AMRAP')
        {
            return `Round ${nCurrentRound}`;
        }
        return `${nCurrentRound} / ${nTotalRounds}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>← 뒤로</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={[styles.phaseText, { color: getPhaseColor() }]}>
                    {getPhaseText()}
                </Text>

                <Text style={[styles.timerText, { color: getPhaseColor() }]}>
                    {formatTimeMMSS(nRemainingTime)}
                </Text>

                {getRoundText() !== '' && (
                    <Text style={styles.roundText}>{getRoundText()}</Text>
                )}
            </View>

            <View style={styles.controls}>
                {status === 'finished' ? (
                    <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                        <Text style={styles.finishButtonText}>완료</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetButtonText}>리셋</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.playPauseButton,
                                { backgroundColor: status === 'running' ? colors.warning : colors.primary },
                            ]}
                            onPress={handlePlayPause}
                        >
                            <Text style={styles.playPauseButtonText}>
                                {status === 'running' ? '일시정지' : '시작'}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {mode === 'AMRAP' && status === 'running' && (
                <TouchableOpacity
                    style={styles.roundButton}
                    onPress={() => updateTimerState({ nCurrentRound: nCurrentRound + 1 })}
                >
                    <Text style={styles.roundButtonText}>라운드 +1</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    backButton: {
        padding: 16,
    },
    backButtonText: {
        fontSize: 18,
        color: colors.textSecondary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phaseText: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: 8,
        marginBottom: 16,
    },
    timerText: {
        fontSize: 120,
        fontWeight: '200',
        fontVariant: ['tabular-nums'],
    },
    roundText: {
        fontSize: 24,
        color: colors.textSecondary,
        marginTop: 16,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 48,
        gap: 16,
    },
    resetButton: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    playPauseButton: {
        flex: 2,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    playPauseButtonText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    finishButton: {
        flex: 1,
        backgroundColor: colors.secondary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    finishButtonText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.background,
    },
    roundButton: {
        position: 'absolute',
        bottom: 120,
        alignSelf: 'center',
        backgroundColor: colors.surfaceLight,
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    roundButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
});
