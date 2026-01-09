/**
 * @file Zustand 스토어
 * @brief 앱 전체 상태 관리
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TimerState,
    TimerConfig,
    TimerMode,
    TimerStatus,
    WorkoutRecord,
    Preset,
    Settings,
} from '../types';
import { getInitialTime, getTotalRounds } from '../utils/timerLogic';

interface AppState
{
    timer: TimerState;
    history: { aWorkouts: WorkoutRecord[] };
    settings: Settings;

    setTimerConfig: (stConfig: TimerConfig) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    resetTimer: () => void;
    decrementTime: () => void;
    incrementTime: () => void;
    setTimerStatus: (status: TimerStatus) => void;
    updateTimerState: (stPartial: Partial<TimerState>) => void;
    incrementRound: () => void;

    saveWorkout: (stWorkout: WorkoutRecord) => void;
    deleteWorkout: (szId: string) => void;
    clearHistory: () => void;

    savePreset: (stPreset: Preset) => void;
    deletePreset: (szId: string) => void;
    toggleSound: () => void;
    toggleVibration: () => void;
}

const initialTimerState: TimerState = {
    mode: 'EMOM',
    status: 'idle',
    nCurrentRound: 1,
    nTotalRounds: 1,
    nRemainingTime: 0,
    nElapsedTime: 0,
    bIsWorkPhase: true,
    stConfig: null,
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            timer: initialTimerState,

            history: {
                aWorkouts: [],
            },

            settings: {
                bSoundEnabled: true,
                bVibrationEnabled: true,
                aPresets: [],
            },

            setTimerConfig: (stConfig: TimerConfig) =>
            {
                const nInitialTime = getInitialTime(stConfig);
                const nTotalRounds = getTotalRounds(stConfig);

                set({
                    timer: {
                        ...initialTimerState,
                        mode: stConfig.mode,
                        stConfig,
                        nRemainingTime: nInitialTime,
                        nTotalRounds,
                        nCurrentRound: 1,
                        bIsWorkPhase: true,
                        nElapsedTime: 0,
                    },
                });
            },

            startTimer: () =>
            {
                set((state) => ({
                    timer: {
                        ...state.timer,
                        status: 'running',
                    },
                }));
            },

            pauseTimer: () =>
            {
                set((state) => ({
                    timer: {
                        ...state.timer,
                        status: 'paused',
                    },
                }));
            },

            resumeTimer: () =>
            {
                set((state) => ({
                    timer: {
                        ...state.timer,
                        status: 'running',
                    },
                }));
            },

            resetTimer: () =>
            {
                const { timer } = get();
                if (timer.stConfig)
                {
                    const nInitialTime = getInitialTime(timer.stConfig);
                    set({
                        timer: {
                            ...timer,
                            status: 'idle',
                            nCurrentRound: 1,
                            nRemainingTime: nInitialTime,
                            nElapsedTime: 0,
                            bIsWorkPhase: true,
                        },
                    });
                }
            },

            decrementTime: () =>
            {
                set((state) => ({
                    timer: {
                        ...state.timer,
                        nRemainingTime: Math.max(0, state.timer.nRemainingTime - 1),
                        nElapsedTime: state.timer.nElapsedTime + 1,
                    },
                }));
            },

            incrementTime: () =>
            {
                set((state) => ({
                    timer: {
                        ...state.timer,
                        nRemainingTime: state.timer.nRemainingTime + 1,
                        nElapsedTime: state.timer.nElapsedTime + 1,
                    },
                }));
            },

            setTimerStatus: (status: TimerStatus) =>
            {
                set((state) => ({
                    timer: {
                        ...state.timer,
                        status,
                    },
                }));
            },

            updateTimerState: (stPartial: Partial<TimerState>) =>
            {
                set((state) => ({
                    timer: {
                        ...state.timer,
                        ...stPartial,
                    },
                }));
            },

            incrementRound: () =>
            {
                set((state) => ({
                    timer: {
                        ...state.timer,
                        nCurrentRound: state.timer.nCurrentRound + 1,
                    },
                }));
            },

            saveWorkout: (stWorkout: WorkoutRecord) =>
            {
                set((state) => ({
                    history: {
                        aWorkouts: [stWorkout, ...state.history.aWorkouts].slice(0, 100),
                    },
                }));
            },

            deleteWorkout: (szId: string) =>
            {
                set((state) => ({
                    history: {
                        aWorkouts: state.history.aWorkouts.filter((w) => w.szId !== szId),
                    },
                }));
            },

            clearHistory: () =>
            {
                set({
                    history: {
                        aWorkouts: [],
                    },
                });
            },

            savePreset: (stPreset: Preset) =>
            {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        aPresets: [...state.settings.aPresets, stPreset],
                    },
                }));
            },

            deletePreset: (szId: string) =>
            {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        aPresets: state.settings.aPresets.filter((p) => p.szId !== szId),
                    },
                }));
            },

            toggleSound: () =>
            {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        bSoundEnabled: !state.settings.bSoundEnabled,
                    },
                }));
            },

            toggleVibration: () =>
            {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        bVibrationEnabled: !state.settings.bVibrationEnabled,
                    },
                }));
            },
        }),
        {
            name: 'crossfit-timer-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                history: state.history,
                settings: state.settings,
            }),
        }
    )
);
