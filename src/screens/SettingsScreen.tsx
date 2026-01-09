/**
 * @file SettingsScreen
 * @brief 설정 화면
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import { useAppStore } from '../store';

export default function SettingsScreen(): React.JSX.Element
{
    const { settings, toggleSound, toggleVibration, deletePreset } = useAppStore();
    const { bSoundEnabled, bVibrationEnabled, aPresets } = settings;

    const handleDeletePreset = (szId: string, szName: string): void =>
    {
        Alert.alert(
            '프리셋 삭제',
            `"${szName}" 프리셋을 삭제하시겠습니까?`,
            [
                { text: '취소', style: 'cancel' },
                { text: '삭제', style: 'destructive', onPress: () => deletePreset(szId) },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>설정</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>알림</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>소리</Text>
                            <Text style={styles.settingDescription}>
                                타이머 알림 소리 재생
                            </Text>
                        </View>
                        <Switch
                            value={bSoundEnabled}
                            onValueChange={toggleSound}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.text}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>진동</Text>
                            <Text style={styles.settingDescription}>
                                타이머 전환 시 진동 알림
                            </Text>
                        </View>
                        <Switch
                            value={bVibrationEnabled}
                            onValueChange={toggleVibration}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.text}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>저장된 프리셋</Text>

                    {aPresets.length === 0 ? (
                        <View style={styles.emptyPresets}>
                            <Text style={styles.emptyPresetsText}>
                                저장된 프리셋이 없습니다
                            </Text>
                        </View>
                    ) : (
                        aPresets.map((preset) => (
                            <TouchableOpacity
                                key={preset.szId}
                                style={styles.presetItem}
                                onLongPress={() => handleDeletePreset(preset.szId, preset.szName)}
                            >
                                <View style={styles.presetInfo}>
                                    <Text style={styles.presetName}>{preset.szName}</Text>
                                    <Text style={styles.presetMode}>{preset.stConfig.mode}</Text>
                                </View>
                                <Text style={styles.presetHint}>길게 눌러 삭제</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>앱 정보</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>버전</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>제작</Text>
                        <Text style={styles.infoValue}>CrossFit Timer</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 24,
    },
    section: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    settingDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    emptyPresets: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyPresetsText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    presetItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    presetInfo: {
        flex: 1,
    },
    presetName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    presetMode: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    presetHint: {
        fontSize: 12,
        color: colors.textMuted,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoLabel: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text,
    },
});
