/**
 * @file 타이머 기본값
 * @brief 각 타이머 모드의 기본 설정값
 */

import { TimerConfig, TimerModeInfo } from '../types';

export const DEFAULT_EMOM_CONFIG: TimerConfig = {
    mode: 'EMOM',
    stEmom: {
        nMinutes: 10,
        nIntervalSeconds: 60,
    },
};

export const DEFAULT_AMRAP_CONFIG: TimerConfig = {
    mode: 'AMRAP',
    stAmrap: {
        nMinutes: 12,
    },
};

export const DEFAULT_TABATA_CONFIG: TimerConfig = {
    mode: 'TABATA',
    stTabata: {
        nRounds: 8,
        nWorkSeconds: 20,
        nRestSeconds: 10,
    },
};

export const DEFAULT_FOR_TIME_CONFIG: TimerConfig = {
    mode: 'FOR_TIME',
    stForTime: {
        nCapMinutes: undefined,
    },
};

export const DEFAULT_CUSTOM_INTERVAL_CONFIG: TimerConfig = {
    mode: 'CUSTOM_INTERVAL',
    stCustomInterval: {
        nRounds: 5,
        nWorkMinutes: 1,
        nWorkSeconds: 0,
        nRestMinutes: 0,
        nRestSeconds: 30,
    },
};

export const TIMER_MODES: TimerModeInfo[] = [
    {
        mode: 'EMOM',
        szTitle: 'EMOM',
        szDescription: 'Every Minute On the Minute',
        szIcon: '⏱️',
    },
    {
        mode: 'AMRAP',
        szTitle: 'AMRAP',
        szDescription: 'As Many Rounds As Possible',
        szIcon: '🔄',
    },
    {
        mode: 'TABATA',
        szTitle: 'Tabata',
        szDescription: '20초 운동 / 10초 휴식',
        szIcon: '🔥',
    },
    {
        mode: 'FOR_TIME',
        szTitle: 'For Time',
        szDescription: '스톱워치 (시간 측정)',
        szIcon: '⏰',
    },
    {
        mode: 'CUSTOM_INTERVAL',
        szTitle: 'Custom',
        szDescription: '커스텀 인터벌',
        szIcon: '⚙️',
    },
];

export function getDefaultConfig(mode: string): TimerConfig
{
    switch (mode)
    {
        case 'EMOM':
            return { ...DEFAULT_EMOM_CONFIG };
        case 'AMRAP':
            return { ...DEFAULT_AMRAP_CONFIG };
        case 'TABATA':
            return { ...DEFAULT_TABATA_CONFIG };
        case 'FOR_TIME':
            return { ...DEFAULT_FOR_TIME_CONFIG };
        case 'CUSTOM_INTERVAL':
            return { ...DEFAULT_CUSTOM_INTERVAL_CONFIG };
        default:
            return { ...DEFAULT_EMOM_CONFIG };
    }
}
