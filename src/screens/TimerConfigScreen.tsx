/**
 * @file TimerConfigScreen
 * @brief 타이머 설정 화면
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { getDefaultConfig, TIMER_MODES } from '../constants/timerDefaults';
import { useAppStore } from '../store';
import { TimerConfig, TimerMode } from '../types';

export default function TimerConfigScreen(): React.JSX.Element
{
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { setTimerConfig } = useAppStore();

    const mode: TimerMode = route.params?.mode || 'EMOM';
    const modeInfo = TIMER_MODES.find((m) => m.mode === mode);

    const [stConfig, setConfig] = useState<TimerConfig>(() => getDefaultConfig(mode));

    useEffect(() =>
    {
        setConfig(getDefaultConfig(mode));
    }, [mode]);

    const handleStart = (): void =>
    {
        setTimerConfig(stConfig);
        navigation.navigate('Timer');
    };

    const updateEmom = (field: string, value: number): void =>
    {
        setConfig((prev) => ({
            ...prev,
            stEmom: {
                ...prev.stEmom!,
                [field]: value,
            },
        }));
    };

    const updateAmrap = (field: string, value: number): void =>
    {
        setConfig((prev) => ({
            ...prev,
            stAmrap: {
                ...prev.stAmrap!,
                [field]: value,
            },
        }));
    };

    const updateTabata = (field: string, value: number): void =>
    {
        setConfig((prev) => ({
            ...prev,
            stTabata: {
                ...prev.stTabata!,
                [field]: value,
            },
        }));
    };

    const updateForTime = (field: string, value: number | undefined): void =>
    {
        setConfig((prev) => ({
            ...prev,
            stForTime: {
                ...prev.stForTime!,
                [field]: value,
            },
        }));
    };

    const updateCustomInterval = (field: string, value: number): void =>
    {
        setConfig((prev) => ({
            ...prev,
            stCustomInterval: {
                ...prev.stCustomInterval!,
                [field]: value,
            },
        }));
    };

    const renderConfigForm = (): React.JSX.Element =>
    {
        switch (mode)
        {
            case 'EMOM':
                return (
                    <View style={styles.form}>
                        <ConfigRow
                            label="총 시간 (분)"
                            value={stConfig.stEmom?.nMinutes ?? 10}
                            onChange={(v) => updateEmom('nMinutes', v)}
                            min={1}
                            max={60}
                        />
                        <ConfigRow
                            label="인터벌 (초)"
                            value={stConfig.stEmom?.nIntervalSeconds ?? 60}
                            onChange={(v) => updateEmom('nIntervalSeconds', v)}
                            min={30}
                            max={120}
                        />
                    </View>
                );

            case 'AMRAP':
                return (
                    <View style={styles.form}>
                        <ConfigRow
                            label="총 시간 (분)"
                            value={stConfig.stAmrap?.nMinutes ?? 12}
                            onChange={(v) => updateAmrap('nMinutes', v)}
                            min={1}
                            max={60}
                        />
                    </View>
                );

            case 'TABATA':
                return (
                    <View style={styles.form}>
                        <ConfigRow
                            label="라운드 수"
                            value={stConfig.stTabata?.nRounds ?? 8}
                            onChange={(v) => updateTabata('nRounds', v)}
                            min={1}
                            max={20}
                        />
                        <ConfigRow
                            label="운동 시간 (초)"
                            value={stConfig.stTabata?.nWorkSeconds ?? 20}
                            onChange={(v) => updateTabata('nWorkSeconds', v)}
                            min={5}
                            max={120}
                        />
                        <ConfigRow
                            label="휴식 시간 (초)"
                            value={stConfig.stTabata?.nRestSeconds ?? 10}
                            onChange={(v) => updateTabata('nRestSeconds', v)}
                            min={5}
                            max={120}
                        />
                    </View>
                );

            case 'FOR_TIME':
                return (
                    <View style={styles.form}>
                        <ConfigRow
                            label="시간 제한 (분, 0=무제한)"
                            value={stConfig.stForTime?.nCapMinutes ?? 0}
                            onChange={(v) => updateForTime('nCapMinutes', v === 0 ? undefined : v)}
                            min={0}
                            max={60}
                        />
                    </View>
                );

            case 'CUSTOM_INTERVAL':
                return (
                    <View style={styles.form}>
                        <ConfigRow
                            label="라운드 수"
                            value={stConfig.stCustomInterval?.nRounds ?? 5}
                            onChange={(v) => updateCustomInterval('nRounds', v)}
                            min={1}
                            max={50}
                        />
                        <ConfigRow
                            label="운동 시간 (분)"
                            value={stConfig.stCustomInterval?.nWorkMinutes ?? 1}
                            onChange={(v) => updateCustomInterval('nWorkMinutes', v)}
                            min={0}
                            max={30}
                        />
                        <ConfigRow
                            label="운동 시간 (초)"
                            value={stConfig.stCustomInterval?.nWorkSeconds ?? 0}
                            onChange={(v) => updateCustomInterval('nWorkSeconds', v)}
                            min={0}
                            max={59}
                        />
                        <ConfigRow
                            label="휴식 시간 (분)"
                            value={stConfig.stCustomInterval?.nRestMinutes ?? 0}
                            onChange={(v) => updateCustomInterval('nRestMinutes', v)}
                            min={0}
                            max={30}
                        />
                        <ConfigRow
                            label="휴식 시간 (초)"
                            value={stConfig.stCustomInterval?.nRestSeconds ?? 30}
                            onChange={(v) => updateCustomInterval('nRestSeconds', v)}
                            min={0}
                            max={59}
                        />
                    </View>
                );

            default:
                return <View />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.icon}>{modeInfo?.szIcon}</Text>
                    <Text style={styles.title}>{modeInfo?.szTitle}</Text>
                    <Text style={styles.description}>{modeInfo?.szDescription}</Text>
                </View>

                {renderConfigForm()}

                <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                    <Text style={styles.startButtonText}>시작하기</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

interface ConfigRowProps
{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
}

function ConfigRow({ label, value, onChange, min, max }: ConfigRowProps): React.JSX.Element
{
    const [szInputValue, setInputValue] = useState<string>(value.toString());

    useEffect(() =>
    {
        setInputValue(value.toString());
    }, [value]);

    const handleDecrement = (): void =>
    {
        if (value > min)
        {
            onChange(value - 1);
        }
    };

    const handleIncrement = (): void =>
    {
        if (value < max)
        {
            onChange(value + 1);
        }
    };

    const handleTextChange = (szText: string): void =>
    {
        const szFiltered = szText.replace(/[^0-9]/g, '');
        setInputValue(szFiltered);
    };

    const handleBlur = (): void =>
    {
        let nValue = parseInt(szInputValue, 10);

        if (isNaN(nValue) || szInputValue === '')
        {
            nValue = min;
        }

        if (nValue < min)
        {
            nValue = min;
        }
        else if (nValue > max)
        {
            nValue = max;
        }

        setInputValue(nValue.toString());
        onChange(nValue);
    };

    return (
        <View style={styles.configRow}>
            <Text style={styles.configLabel}>{label}</Text>
            <View style={styles.configControls}>
                <TouchableOpacity
                    style={[styles.controlButton, value <= min && styles.controlButtonDisabled]}
                    onPress={handleDecrement}
                    disabled={value <= min}
                >
                    <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.configValueInput}
                    value={szInputValue}
                    onChangeText={handleTextChange}
                    onBlur={handleBlur}
                    onSubmitEditing={handleBlur}
                    keyboardType="number-pad"
                    selectTextOnFocus={true}
                    maxLength={3}
                    editable={true}
                    returnKeyType="done"
                />
                <TouchableOpacity
                    style={[styles.controlButton, value >= max && styles.controlButtonDisabled]}
                    onPress={handleIncrement}
                    disabled={value >= max}
                >
                    <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
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
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    icon: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    form: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    configRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    configLabel: {
        fontSize: 16,
        color: colors.text,
        flex: 1,
    },
    configControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButtonDisabled: {
        opacity: 0.3,
    },
    controlButtonText: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.text,
    },
    configValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        minWidth: 60,
        textAlign: 'center',
    },
    configValueInput: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        minWidth: 64,
        height: 44,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: colors.surfaceLight,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginHorizontal: 8,
    },
    startButton: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
});
