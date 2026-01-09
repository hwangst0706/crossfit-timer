/**
 * @file generate-beep.js
 * @brief 간단한 비프음 WAV 파일 생성 스크립트
 *
 * 사용법: node scripts/generate-beep.js
 */

const fs = require('fs');
const path = require('path');

// WAV 파일 생성 함수
function generateBeepWav(frequency, duration, volume, sampleRate = 44100) {
    const numSamples = Math.floor(sampleRate * duration);
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = numSamples * blockAlign;
    const fileSize = 36 + dataSize;

    const buffer = Buffer.alloc(44 + dataSize);
    let offset = 0;

    // RIFF header
    buffer.write('RIFF', offset); offset += 4;
    buffer.writeUInt32LE(fileSize, offset); offset += 4;
    buffer.write('WAVE', offset); offset += 4;

    // fmt chunk
    buffer.write('fmt ', offset); offset += 4;
    buffer.writeUInt32LE(16, offset); offset += 4; // chunk size
    buffer.writeUInt16LE(1, offset); offset += 2;  // audio format (PCM)
    buffer.writeUInt16LE(numChannels, offset); offset += 2;
    buffer.writeUInt32LE(sampleRate, offset); offset += 4;
    buffer.writeUInt32LE(byteRate, offset); offset += 4;
    buffer.writeUInt16LE(blockAlign, offset); offset += 2;
    buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

    // data chunk
    buffer.write('data', offset); offset += 4;
    buffer.writeUInt32LE(dataSize, offset); offset += 4;

    // Generate sine wave with fade in/out
    const fadeLength = Math.floor(numSamples * 0.1); // 10% fade

    for (let i = 0; i < numSamples; i++) {
        let amplitude = volume;

        // Fade in
        if (i < fadeLength) {
            amplitude *= i / fadeLength;
        }
        // Fade out
        else if (i > numSamples - fadeLength) {
            amplitude *= (numSamples - i) / fadeLength;
        }

        const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * amplitude * 32767;
        buffer.writeInt16LE(Math.floor(sample), offset);
        offset += 2;
    }

    return buffer;
}

// 디렉토리 생성
const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir, { recursive: true });
}

// 다양한 비프음 생성
const sounds = [
    { name: 'beep.wav', frequency: 880, duration: 0.15, volume: 0.7 },      // 기본 비프
    { name: 'countdown.wav', frequency: 660, duration: 0.1, volume: 0.5 },  // 카운트다운
    { name: 'finish.wav', frequency: 1320, duration: 0.5, volume: 0.9 },    // 완료
    { name: 'work.wav', frequency: 1000, duration: 0.3, volume: 0.8 },      // 운동 시작
    { name: 'rest.wav', frequency: 600, duration: 0.3, volume: 0.6 },       // 휴식 시작
];

console.log('Generating sound files...\n');

sounds.forEach(sound => {
    const wavBuffer = generateBeepWav(sound.frequency, sound.duration, sound.volume);
    const filePath = path.join(soundsDir, sound.name);
    fs.writeFileSync(filePath, wavBuffer);
    console.log(`✓ Created: ${sound.name} (${sound.frequency}Hz, ${sound.duration}s)`);
});

console.log('\n✅ All sound files generated in assets/sounds/');
console.log('\nNow update src/utils/alerts.ts to enable sound playback.');
