/**
 * @file 타이머 로직 유틸리티
 * @brief 각 타이머 모드의 초기화 및 페이즈 전환 로직
 */

import { TimerConfig, TimerState, TimerMode } from '../types';
import { toTotalSeconds } from './formatTime';

/**
 * @brief 타이머 모드에 따른 초기 시간 계산
 * @param stConfig 타이머 설정
 * @return 초기 시간 (초)
 */
export function getInitialTime(stConfig: TimerConfig): number
{
    switch (stConfig.mode)
    {
        case 'EMOM':
            return stConfig.stEmom?.nIntervalSeconds ?? 60;

        case 'AMRAP':
            return (stConfig.stAmrap?.nMinutes ?? 12) * 60;

        case 'TABATA':
            return stConfig.stTabata?.nWorkSeconds ?? 20;

        case 'FOR_TIME':
            return 0;

        case 'CUSTOM_INTERVAL':
            if (stConfig.stCustomInterval)
            {
                return toTotalSeconds(
                    stConfig.stCustomInterval.nWorkMinutes,
                    stConfig.stCustomInterval.nWorkSeconds
                );
            }
            return 60;

        default:
            return 0;
    }
}

/**
 * @brief 타이머 모드에 따른 총 라운드 수 계산
 * @param stConfig 타이머 설정
 * @return 총 라운드 수
 */
export function getTotalRounds(stConfig: TimerConfig): number
{
    switch (stConfig.mode)
    {
        case 'EMOM':
            return stConfig.stEmom?.nMinutes ?? 10;

        case 'AMRAP':
            return 999;

        case 'TABATA':
            return stConfig.stTabata?.nRounds ?? 8;

        case 'FOR_TIME':
            return 1;

        case 'CUSTOM_INTERVAL':
            return stConfig.stCustomInterval?.nRounds ?? 5;

        default:
            return 1;
    }
}

/**
 * @brief 페이즈 종료 시 다음 상태 계산
 * @param stConfig 타이머 설정
 * @param stCurrentState 현재 타이머 상태
 * @return 업데이트할 상태 부분
 */
export function handlePhaseEnd(
    stConfig: TimerConfig,
    stCurrentState: TimerState
): Partial<TimerState>
{
    switch (stConfig.mode)
    {
        case 'EMOM':
            return handleEmomPhaseEnd(stConfig, stCurrentState);

        case 'AMRAP':
            return { status: 'finished' };

        case 'TABATA':
            return handleTabataPhaseEnd(stConfig, stCurrentState);

        case 'FOR_TIME':
            return {};

        case 'CUSTOM_INTERVAL':
            return handleCustomIntervalPhaseEnd(stConfig, stCurrentState);

        default:
            return { status: 'finished' };
    }
}

function handleEmomPhaseEnd(
    stConfig: TimerConfig,
    stCurrentState: TimerState
): Partial<TimerState>
{
    const nTotalMinutes = stConfig.stEmom?.nMinutes ?? 10;

    if (stCurrentState.nCurrentRound >= nTotalMinutes)
    {
        return { status: 'finished' };
    }

    return {
        nCurrentRound: stCurrentState.nCurrentRound + 1,
        nRemainingTime: stConfig.stEmom?.nIntervalSeconds ?? 60,
    };
}

function handleTabataPhaseEnd(
    stConfig: TimerConfig,
    stCurrentState: TimerState
): Partial<TimerState>
{
    const nTotalRounds = stConfig.stTabata?.nRounds ?? 8;
    const nWorkSeconds = stConfig.stTabata?.nWorkSeconds ?? 20;
    const nRestSeconds = stConfig.stTabata?.nRestSeconds ?? 10;

    if (stCurrentState.bIsWorkPhase)
    {
        return {
            bIsWorkPhase: false,
            nRemainingTime: nRestSeconds,
        };
    }
    else
    {
        if (stCurrentState.nCurrentRound >= nTotalRounds)
        {
            return { status: 'finished' };
        }

        return {
            bIsWorkPhase: true,
            nCurrentRound: stCurrentState.nCurrentRound + 1,
            nRemainingTime: nWorkSeconds,
        };
    }
}

function handleCustomIntervalPhaseEnd(
    stConfig: TimerConfig,
    stCurrentState: TimerState
): Partial<TimerState>
{
    const stInterval = stConfig.stCustomInterval;
    if (!stInterval)
    {
        return { status: 'finished' };
    }

    const nWorkTime = toTotalSeconds(stInterval.nWorkMinutes, stInterval.nWorkSeconds);
    const nRestTime = toTotalSeconds(stInterval.nRestMinutes, stInterval.nRestSeconds);

    if (stCurrentState.bIsWorkPhase)
    {
        if (nRestTime > 0)
        {
            return {
                bIsWorkPhase: false,
                nRemainingTime: nRestTime,
            };
        }
        else
        {
            if (stCurrentState.nCurrentRound >= stInterval.nRounds)
            {
                return { status: 'finished' };
            }
            return {
                nCurrentRound: stCurrentState.nCurrentRound + 1,
                nRemainingTime: nWorkTime,
            };
        }
    }
    else
    {
        if (stCurrentState.nCurrentRound >= stInterval.nRounds)
        {
            return { status: 'finished' };
        }

        return {
            bIsWorkPhase: true,
            nCurrentRound: stCurrentState.nCurrentRound + 1,
            nRemainingTime: nWorkTime,
        };
    }
}

/**
 * @brief 타이머가 카운트업 모드인지 확인
 * @param mode 타이머 모드
 * @return 카운트업이면 true
 */
export function isCountUpMode(mode: TimerMode): boolean
{
    return mode === 'FOR_TIME';
}

/**
 * @brief 총 운동 시간 계산 (초)
 * @param stConfig 타이머 설정
 * @return 총 운동 시간 (초)
 */
export function getTotalWorkoutTime(stConfig: TimerConfig): number
{
    switch (stConfig.mode)
    {
        case 'EMOM':
            return (stConfig.stEmom?.nMinutes ?? 10) * 60;

        case 'AMRAP':
            return (stConfig.stAmrap?.nMinutes ?? 12) * 60;

        case 'TABATA':
        {
            const nRounds = stConfig.stTabata?.nRounds ?? 8;
            const nWorkSec = stConfig.stTabata?.nWorkSeconds ?? 20;
            const nRestSec = stConfig.stTabata?.nRestSeconds ?? 10;
            return nRounds * (nWorkSec + nRestSec);
        }

        case 'FOR_TIME':
            return stConfig.stForTime?.nCapMinutes
                ? stConfig.stForTime.nCapMinutes * 60
                : 0;

        case 'CUSTOM_INTERVAL':
        {
            const stInterval = stConfig.stCustomInterval;
            if (!stInterval)
            {
                return 0;
            }
            const nWorkTime = toTotalSeconds(stInterval.nWorkMinutes, stInterval.nWorkSeconds);
            const nRestTime = toTotalSeconds(stInterval.nRestMinutes, stInterval.nRestSeconds);
            return stInterval.nRounds * (nWorkTime + nRestTime);
        }

        default:
            return 0;
    }
}
