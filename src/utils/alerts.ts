/**
 * @file 알림 유틸리티
 * @brief 소리 및 진동 알림 기능
 */

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store';

type AlertType = 'beep' | 'countdown' | 'finish' | 'work' | 'rest';

let m_bSoundsLoaded = false;
let m_stBeepSound: Audio.Sound | null = null;

/**
 * @brief 오디오 설정 초기화
 */
export async function initializeAudio(): Promise<void>
{
    try
    {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
        });
    }
    catch (error)
    {
        console.warn('Audio initialization failed:', error);
    }
}

/**
 * @brief 간단한 비프음 재생 (시스템 소리 사용)
 * @param type 알림 타입
 */
export async function playAlert(type: AlertType): Promise<void>
{
    const state = useAppStore.getState();
    const bSoundEnabled = state.settings.bSoundEnabled;
    const bVibrationEnabled = state.settings.bVibrationEnabled;

    if (bVibrationEnabled)
    {
        await playVibration(type);
    }

    if (bSoundEnabled)
    {
        await playSound(type);
    }
}

/**
 * @brief 알림 타입별 사운드 파일 매핑
 */
const SOUND_FILES: Record<AlertType, any> = {
    beep: require('../../assets/sounds/beep.wav'),
    countdown: require('../../assets/sounds/countdown.wav'),
    finish: require('../../assets/sounds/finish.wav'),
    work: require('../../assets/sounds/work.wav'),
    rest: require('../../assets/sounds/rest.wav'),
};

/**
 * @brief 소리 재생
 * @param type 알림 타입
 */
async function playSound(type: AlertType): Promise<void>
{
    try
    {
        const soundFile = SOUND_FILES[type] || SOUND_FILES.beep;
        const { sound } = await Audio.Sound.createAsync(
            soundFile,
            { shouldPlay: true, volume: getVolumeForType(type) }
        );

        sound.setOnPlaybackStatusUpdate((status) =>
        {
            if (status.isLoaded && status.didJustFinish)
            {
                sound.unloadAsync();
            }
        });
    }
    catch (error)
    {
        console.warn('Sound playback failed:', error);
    }
}

function getVolumeForType(type: AlertType): number
{
    switch (type)
    {
        case 'finish':
            return 1.0;
        case 'work':
        case 'rest':
            return 0.9;
        case 'beep':
            return 0.7;
        case 'countdown':
            return 0.5;
        default:
            return 0.7;
    }
}

/**
 * @brief 진동 재생
 * @param type 알림 타입
 */
async function playVibration(type: AlertType): Promise<void>
{
    try
    {
        switch (type)
        {
            case 'finish':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'work':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            case 'rest':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'beep':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
            case 'countdown':
                await Haptics.selectionAsync();
                break;
            default:
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }
    catch (error)
    {
        console.warn('Vibration failed:', error);
    }
}

/**
 * @brief 카운트다운 알림 (3, 2, 1)
 * @param nSeconds 남은 초
 */
export async function alertCountdown(nSeconds: number): Promise<void>
{
    if (nSeconds <= 3 && nSeconds > 0)
    {
        await playAlert('countdown');
    }
}

/**
 * @brief 페이즈 전환 알림
 * @param szPhase 페이즈 ('work' | 'rest' | 'finish')
 */
export async function alertPhaseChange(szPhase: 'work' | 'rest' | 'finish'): Promise<void>
{
    await playAlert(szPhase);
}
