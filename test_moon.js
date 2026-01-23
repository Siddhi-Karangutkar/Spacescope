const SunCalc = require('suncalc');
const date = new Date('2026-01-23T17:40:31+05:30');
const moonIllum = SunCalc.getMoonIllumination(date);
console.log('Date:', date.toISOString());
console.log('Moon Phase (0-1):', moonIllum.phase);
console.log('Moon Fraction (Illumination):', moonIllum.fraction);

function getMoonPhaseName(phase) {
    if (phase === 0 || phase === 1) return 'New Moon';
    if (phase < 0.25) return 'Waxing Crescent';
    if (phase === 0.25) return 'First Quarter';
    if (phase < 0.5) return 'Waxing Gibbous';
    if (phase === 0.5) return 'Full Moon';
    if (phase < 0.75) return 'Waning Gibbous';
    if (phase === 0.75) return 'Last Quarter';
    return 'Waning Crescent';
}

console.log('Calculated Name:', getMoonPhaseName(moonIllum.phase));
