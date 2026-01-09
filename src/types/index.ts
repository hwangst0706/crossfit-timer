/**
 * @file 타입 정의
 * @brief CrossFit Timer 앱의 모든 타입 정의
 */

export type TimerMode = 'EMOM' | 'AMRAP' | 'TABATA' | 'FOR_TIME' | 'CUSTOM_INTERVAL';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface EmomConfig
{
    nMinutes: number;
    nIntervalSeconds: number;
}

export interface AmrapConfig
{
    nMinutes: number;
}

export interface TabataConfig
{
    nRounds: number;
    nWorkSeconds: number;
    nRestSeconds: number;
}

export interface ForTimeConfig
{
    nCapMinutes?: number;
}

export interface CustomIntervalConfig
{
    nRounds: number;
    nWorkMinutes: number;
    nWorkSeconds: number;
    nRestMinutes: number;
    nRestSeconds: number;
}

export interface TimerConfig
{
    mode: TimerMode;
    stEmom?: EmomConfig;
    stAmrap?: AmrapConfig;
    stTabata?: TabataConfig;
    stForTime?: ForTimeConfig;
    stCustomInterval?: CustomIntervalConfig;
}

export interface TimerState
{
    mode: TimerMode;
    status: TimerStatus;
    nCurrentRound: number;
    nTotalRounds: number;
    nRemainingTime: number;
    nElapsedTime: number;
    bIsWorkPhase: boolean;
    stConfig: TimerConfig | null;
}

export interface WorkoutRecord
{
    szId: string;
    szDate: string;
    mode: TimerMode;
    stConfig: TimerConfig;
    nDuration: number;
    nRoundsCompleted: number;
    szNotes?: string;
}

export interface Preset
{
    szId: string;
    szName: string;
    stConfig: TimerConfig;
    szCreatedAt: string;
}

export interface Settings
{
    bSoundEnabled: boolean;
    bVibrationEnabled: boolean;
    aPresets: Preset[];
}

export interface TimerModeInfo
{
    mode: TimerMode;
    szTitle: string;
    szDescription: string;
    szIcon: string;
}
