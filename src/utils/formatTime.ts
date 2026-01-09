/**
 * @file 시간 포맷팅 유틸리티
 * @brief 초 단위 시간을 다양한 형식으로 변환
 */

/**
 * @brief 초를 MM:SS 형식으로 변환
 * @param nSeconds 초 단위 시간
 * @return 포맷된 문자열 (예: "05:30")
 */
export function formatTimeMMSS(nSeconds: number): string
{
    const nMins = Math.floor(Math.abs(nSeconds) / 60);
    const nSecs = Math.abs(nSeconds) % 60;
    const szSign = nSeconds < 0 ? '-' : '';
    return `${szSign}${nMins.toString().padStart(2, '0')}:${nSecs.toString().padStart(2, '0')}`;
}

/**
 * @brief 초를 HH:MM:SS 형식으로 변환
 * @param nSeconds 초 단위 시간
 * @return 포맷된 문자열 (예: "01:05:30")
 */
export function formatTimeHHMMSS(nSeconds: number): string
{
    const nHours = Math.floor(Math.abs(nSeconds) / 3600);
    const nMins = Math.floor((Math.abs(nSeconds) % 3600) / 60);
    const nSecs = Math.abs(nSeconds) % 60;
    const szSign = nSeconds < 0 ? '-' : '';

    if (nHours > 0)
    {
        return `${szSign}${nHours.toString().padStart(2, '0')}:${nMins.toString().padStart(2, '0')}:${nSecs.toString().padStart(2, '0')}`;
    }
    return `${szSign}${nMins.toString().padStart(2, '0')}:${nSecs.toString().padStart(2, '0')}`;
}

/**
 * @brief 초를 사람이 읽기 쉬운 형식으로 변환
 * @param nSeconds 초 단위 시간
 * @return 포맷된 문자열 (예: "5분 30초")
 */
export function formatTimeReadable(nSeconds: number): string
{
    const nMins = Math.floor(nSeconds / 60);
    const nSecs = nSeconds % 60;

    if (nMins === 0)
    {
        return `${nSecs}초`;
    }
    if (nSecs === 0)
    {
        return `${nMins}분`;
    }
    return `${nMins}분 ${nSecs}초`;
}

/**
 * @brief 분과 초를 총 초로 변환
 * @param nMinutes 분
 * @param nSeconds 초
 * @return 총 초
 */
export function toTotalSeconds(nMinutes: number, nSeconds: number): number
{
    return nMinutes * 60 + nSeconds;
}
