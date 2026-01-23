import React, { useState } from 'react';
import * as Astronomy from 'astronomy-engine';

const SpaceTimeline = () => {
    const [formData, setFormData] = useState({ city: '', date: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateData = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate calculation delay for dramatic effect
        setTimeout(() => {
            const date = new Date(formData.date);
            const year = date.getFullYear();

            // 1. Moon Phase (Real Calc)
            const moonPhase = Astronomy.MoonPhase(date); // 0 to 360
            let moonText = "New Moon";
            if (moonPhase > 0 && moonPhase < 90) moonText = "Waxing Crescent";
            else if (moonPhase >= 90 && moonPhase < 180) moonText = "Waxing Gibbous";
            else if (moonPhase >= 180 && moonPhase < 270) moonText = "Waning Gibbous";
            else moonText = "Waning Crescent";
            if (Math.abs(moonPhase - 180) < 5) moonText = "Full Moon";
            if (Math.abs(moonPhase - 0) < 5 || Math.abs(moonPhase - 360) < 5) moonText = "New Moon";

            // 2. CO2 Level (Estimation)
            // Baseline: 1958 = 315ppm, 2024 = 420ppm. Linear approx: 1.6ppm/year avg
            const co2 = Math.round(315 + (Math.max(year - 1958, 0) * 1.6));

            // 3. Solar Activity (11-Year Cycle)
            // Peak approx 2001, 2012, 2023. Remainder of (Year-2001)/11
            const cyclePhase = (year - 2001) % 11;
            const solarActivity = (Math.abs(cyclePhase) < 2 || Math.abs(cyclePhase) > 9) ? "Solar Maximum (Very Active)" : "Solar Minimum (Quiet)";

            // 4. Random Space Fact/Launch
            const launches = Math.floor(Math.random() * 5) + 60; // Just a random "flavor" number for this example

            // 5. Star Sign
            // Simple Zodiac calc
            const day = date.getDate();
            const month = date.getMonth() + 1;
            let zodiac = "";
            if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) zodiac = "Capricorn";
            else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) zodiac = "Aquarius";
            else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) zodiac = "Pisces";
            else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) zodiac = "Aries";
            else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) zodiac = "Taurus";
            else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) zodiac = "Gemini";
            else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) zodiac = "Cancer";
            else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) zodiac = "Leo";
            else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) zodiac = "Virgo";
            else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) zodiac = "Libra";
            else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) zodiac = "Scorpio";
            else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) zodiac = "Sagittarius";

            // 6. Emotional Hook (Randomized)
            const hooks = [
                "The universe has been expanding for billions of years, just to reach this moment.",
                "You are made of starstuff, perceiving the cosmos that created you.",
                "The light from the stars you see tonight left them before you were born.",
                "In the vast cosmic calendar, your story is just beginning.",
                "Every atom in your body was once inside a collapsing star.",
                "You are the universe experiencing itself.",
                "On this day, the Earth was exactly where it needed to be for you.",
                "Gravity anchors you here, but your mind was meant for the stars.",
                "Of all the timelines in the multiverse, this is the one where you exist."
            ];
            const randomHook = hooks[Math.floor(Math.random() * hooks.length)];

            setResult({
                moonText,
                co2,
                solarActivity,
                zodiac,
                year,
                hook: randomHook
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <section className="timeline-section">
            <div className="timeline-container">
                <h2 className="timeline-title">YOUR LIFE <span className="x-mark">×</span> SPACE</h2>
                <p className="timeline-subtitle">Enter your details to see what the universe was doing when you arrived.</p>

                <form className="timeline-form" onSubmit={calculateData}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="city"
                            placeholder="City / Location"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="cinematic-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                            className="cinematic-input"
                        />
                    </div>
                    <button type="submit" className="generate-btn" disabled={loading}>
                        {loading ? 'CALCULATING COSMOS...' : 'REVEAL TIMELINE'}
                    </button>
                </form>

                {result && (
                    <div className="timeline-result fade-in">
                        <div className="result-header">
                            <h3>ON THE DAY YOU WERE BORN IN {result.year}</h3>
                        </div>

                        <div className="facts-grid">
                            <div className="fact-card">
                                <span className="fact-icon">🌑</span>
                                <h4>The Moon Was</h4>
                                <p>{result.moonText}</p>
                            </div>

                            <div className="fact-card">
                                <span className="fact-icon">☀️</span>
                                <h4>Solar Activity</h4>
                                <p>{result.solarActivity}</p>
                            </div>

                            <div className="fact-card">
                                <span className="fact-icon">🌍</span>
                                <h4>Earth's CO₂</h4>
                                <p>{result.co2} ppm</p>
                            </div>

                            <div className="fact-card">
                                <span className="fact-icon">✨</span>
                                <h4>Under the Sign</h4>
                                <p>{result.zodiac}</p>
                            </div>
                        </div>

                        <div className="emotional-hook">
                            <p>"{result.hook}"</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SpaceTimeline;
