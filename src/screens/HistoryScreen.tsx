/**
 * @file HistoryScreen
 * @brief 운동 기록 화면
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import { useAppStore } from '../store';
import { formatTimeReadable } from '../utils/formatTime';
import { WorkoutRecord } from '../types';
import { TIMER_MODES } from '../constants/timerDefaults';

export default function HistoryScreen(): React.JSX.Element
{
    const { history, deleteWorkout, clearHistory } = useAppStore();
    const aWorkouts = history.aWorkouts;

    const handleDelete = (szId: string): void =>
    {
        Alert.alert(
            '기록 삭제',
            '이 운동 기록을 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                { text: '삭제', style: 'destructive', onPress: () => deleteWorkout(szId) },
            ]
        );
    };

    const handleClearAll = (): void =>
    {
        Alert.alert(
            '전체 삭제',
            '모든 운동 기록을 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                { text: '삭제', style: 'destructive', onPress: clearHistory },
            ]
        );
    };

    const renderItem = ({ item }: { item: WorkoutRecord }): React.JSX.Element =>
    {
        const modeInfo = TIMER_MODES.find((m) => m.mode === item.mode);
        const dateObj = new Date(item.szDate);
        const szDateStr = dateObj.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
        });
        const szTimeStr = dateObj.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <TouchableOpacity
                style={styles.historyItem}
                onLongPress={() => handleDelete(item.szId)}
            >
                <View style={styles.itemHeader}>
                    <Text style={styles.itemIcon}>{modeInfo?.szIcon}</Text>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemMode}>{modeInfo?.szTitle}</Text>
                        <Text style={styles.itemDate}>{szDateStr} {szTimeStr}</Text>
                    </View>
                </View>
                <View style={styles.itemStats}>
                    <View style={styles.statBox}>
                        <Text style={styles.statBoxValue}>{formatTimeReadable(item.nDuration)}</Text>
                        <Text style={styles.statBoxLabel}>시간</Text>
                    </View>
                    {item.mode !== 'FOR_TIME' && (
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxValue}>{item.nRoundsCompleted}</Text>
                            <Text style={styles.statBoxLabel}>라운드</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = (): React.JSX.Element => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>아직 운동 기록이 없습니다</Text>
            <Text style={styles.emptySubtext}>운동을 완료하면 여기에 기록됩니다</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>운동 기록</Text>
                {aWorkouts.length > 0 && (
                    <TouchableOpacity onPress={handleClearAll}>
                        <Text style={styles.clearButton}>전체 삭제</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={aWorkouts}
                renderItem={renderItem}
                keyExtractor={(item) => item.szId}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
    },
    clearButton: {
        fontSize: 16,
        color: colors.primary,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        flexGrow: 1,
    },
    historyItem: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemMode: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    itemDate: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemStats: {
        flexDirection: 'row',
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: colors.surfaceLight,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    statBoxValue: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    statBoxLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});
