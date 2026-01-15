import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Cpu, Gamepad2, Rocket, RotateCcw, Check, X, Globe } from 'lucide-react';
import './Learn.css';

const Learn = () => {
    const [activeTab, setActiveTab] = useState('HUB'); // HUB, QUIZ, GAME, DICT, TECH, PLANET, STAR

    return (
        <div className="learn-container">
            {activeTab === 'HUB' && <LearnHub setActiveTab={setActiveTab} />}
            {activeTab === 'QUIZ' && <QuizModule onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'GAME' && <MemoryGame onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'DICT' && <SpaceDictionary onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'TECH' && <TechStories onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'PLANET' && <PlanetExplorer onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'STAR' && <StarExplorer onBack={() => setActiveTab('HUB')} />}
        </div>
    );
};

// 1. HUB COMPONENT
const LearnHub = ({ setActiveTab }) => (
    <div className="learn-hub fade-in">
        <h1 className="page-title text-center">Cosmic Learning Zone</h1>
        <p className="page-subtitle text-center">Explore, Play, and Master the Universe</p>

        <div className="hub-grid">
            <div className="hub-card planet-card" onClick={() => setActiveTab('PLANET')}>
                <Globe size={48} />
                <h2>Solar System 3D</h2>
                <p>Interactive tour of our celestial neighborhood.</p>
            </div>
            <div className="hub-card star-card" onClick={() => setActiveTab('STAR')}>
                <Rocket size={48} />
                <h2>Star Encyclopedia</h2>
                <p>From Red Dwarfs to Supergiants.</p>
            </div>
            <div className="hub-card quiz-card" onClick={() => setActiveTab('QUIZ')}>
                <Brain size={48} />
                <h2>Cosmic Quiz</h2>
                <p>Test your knowledge from Novice to Astro-Geek.</p>
            </div>
            <div className="hub-card game-card" onClick={() => setActiveTab('GAME')}>
                <Gamepad2 size={48} />
                <h2>Memory Mission</h2>
                <p>Match celestial objects in this brain-training game.</p>
            </div>
            <div className="hub-card dict-card" onClick={() => setActiveTab('DICT')}>
                <BookOpen size={48} />
                <h2>Space Dictionary</h2>
                <p>Decode complex space terms effortlessly.</p>
            </div>
            <div className="hub-card tech-card" onClick={() => setActiveTab('TECH')}>
                <Cpu size={48} />
                <h2>Space Tech Realities</h2>
                <p>How space innovations power your daily life.</p>
            </div>
        </div>
    </div>
);

// 2. QUIZ MODULE
const QuizModule = ({ onBack }) => {
    const LEVELS = {
        EASY: [
            { q: "What is the closest planet to the Sun?", options: ["Venus", "Mars", "Mercury", "Earth"], ans: 2 },
            { q: "Which galaxy is Earth located in?", options: ["Andromeda", "Milky Way", "Triangulum", "Sombrero"], ans: 1 },
            { q: "Who was the first human in space?", options: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "John Glenn"], ans: 1 },
            { q: "What planet is known as the Red Planet?", options: ["Jupiter", "Mars", "Saturn", "Venus"], ans: 1 },
            { q: "What is the name of Earth's natural satellite?", options: ["Titan", "Luna (Moon)", "Europa", "Phobos"], ans: 1 },
            { q: "Which planet has the most visible rings?", options: ["Saturn", "Uranus", "Neptune", "Jupiter"], ans: 0 },
            { q: "What star is at the center of our Solar System?", options: ["Proxima Centauri", "Sirius", "The Sun", "Betelgeuse"], ans: 2 },
            { q: "How many planets are in our Solar System?", options: ["7", "8", "9", "10"], ans: 1 },
            { q: "What agency is arguably the most famous for space exploration?", options: ["NASA", "ESA", "Roscosmos", "ISRO"], ans: 0 },
            { q: "What force keeps us on the ground?", options: ["Magnetism", "Gravity", "Friction", "Inertia"], ans: 1 }
        ],
        MEDIUM: [
            { q: "What is the Great Red Spot on Jupiter?", options: ["A volcano", "A crater", "A storm", "A lake"], ans: 2 },
            { q: "Which planet spins on its side?", options: ["Uranus", "Neptune", "Saturn", "Mars"], ans: 0 },
            { q: "What is the name of the first artificial satellite?", options: ["Apollo 11", "Sputnik 1", "Voyager", "Hubble"], ans: 1 },
            { q: "Which moon of Saturn has a thick atmosphere?", options: ["Enceladus", "Titan", "Mimas", "Rhea"], ans: 1 },
            { q: "What is the term for a rocky object that strikes Earth's surface?", options: ["Meteoroid", "Meteor", "Meteorite", "Asteroid"], ans: 2 },
            { q: "Which planet is the hottest in the solar system?", options: ["Mercury", "Venus", "Mars", "Jupiter"], ans: 1 },
            { q: "What is the boundary around a black hole called?", options: ["Singularity", "Event Horizon", "Accretion Disk", "Photon Sphere"], ans: 1 },
            { q: "About how old is the Universe?", options: ["4.5 Billion Years", "13.8 Billion Years", "100 Million Years", "1 Trillion Years"], ans: 1 },
            { q: "Which mission first landed humans on the Moon?", options: ["Apollo 13", "Gemini 8", "Apollo 11", "Artemis I"], ans: 2 },
            { q: "What gas makes Neptune look blue?", options: ["Hydrogen", "Helium", "Methane", "Ammonia"], ans: 2 }
        ],
        HARD: [
            { q: "What is the name of the nearest star system to us?", options: ["Alpha Centauri", "Sirius", "Barnard's Star", "Wolf 359"], ans: 0 },
            { q: "What is the Chandrasekhar Limit?", options: ["Max mass of a white dwarf", "Speed of light", "Size of a neutron star", "Edge of the universe"], ans: 0 },
            { q: "Which moon is the most volcanically active body in the solar system?", options: ["Io", "Europa", "Titan", "Triton"], ans: 0 },
            { q: "What type of galaxy is the Milky Way?", options: ["Elliptical", "Barred Spiral", "Irregular", "Lenticular"], ans: 1 },
            { q: "Who formulated the three laws of planetary motion?", options: ["Galileo", "Newton", "Kepler", "Copernicus"], ans: 2 },
            { q: "What is the name of the region of icy bodies beyond Neptune?", options: ["Oort Cloud", "Kuiper Belt", "Asteroid Belt", "Scattered Disc"], ans: 1 },
            { q: "Which space telescope succeeded Hubble for infrared astronomy?", options: ["Spitzer", "Chandra", "James Webb (JWST)", "Kepler"], ans: 2 },
            { q: "What is the hypothetical particle that carries gravity?", options: ["Graviton", "Higgs Boson", "Photon", "Gluon"], ans: 0 },
            { q: "Which planet revolves around the Sun the fastest?", options: ["Mercury", "Earth", "Jupiter", "Neptune"], ans: 0 },
            { q: "What is the name of the depression at the top of a volcano or impact site?", options: ["Caldera", "Canyon", "Rille", "Mare"], ans: 0 }
        ]
    };

    const [level, setLevel] = useState(null); // null, 'EASY', 'MEDIUM', 'HARD'
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const activeQuestions = level ? LEVELS[level] : [];

    const handleAnswer = (idx) => {
        if (idx === activeQuestions[current].ans) setScore(score + 1);
        const next = current + 1;
        if (next < activeQuestions.length) setCurrent(next);
        else setShowScore(true);
    };

    const resetQuiz = () => {
        setScore(0);
        setCurrent(0);
        setShowScore(false);
        setLevel(null);
    };

    if (!level) {
        return (
            <div className="module-container fade-in">
                <button className="back-btn" onClick={onBack}>← Back to Hub</button>
                <div className="level-select text-center">
                    <h2 className="mb-4">Choose Your Difficulty</h2>
                    <div className="levels-grid">
                        <button className="level-btn easy" onClick={() => setLevel('EASY')}>
                            <h3>Cadet (Easy)</h3>
                            <p>Basic space facts for beginners.</p>
                        </button>
                        <button className="level-btn medium" onClick={() => setLevel('MEDIUM')}>
                            <h3>Pilot (Medium)</h3>
                            <p>Challenge your general knowledge.</p>
                        </button>
                        <button className="level-btn hard" onClick={() => setLevel('HARD')}>
                            <h3>Commander (Hard)</h3>
                            <p>Deep space trivia for experts.</p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="module-container fade-in">
            <button className="back-btn" onClick={() => setLevel(null)}>← Change Level</button>
            <div className="quiz-box glass-panel">
                {showScore ? (
                    <div className="score-section text-center">
                        <h2>Mission Debrief ({level})</h2>
                        <div className="final-score">{score} / {activeQuestions.length}</div>
                        <p>
                            {score === activeQuestions.length ? "Perfect Score! You're ready for ignition." :
                                score > 7 ? "Excellent work, Officer." :
                                    score > 4 ? "Good effort, keep training." : "Back to the flight simulator."}
                        </p>
                        <button className="action-btn" onClick={resetQuiz}>New Mission</button>
                    </div>
                ) : (
                    <div className="question-section">
                        <div className="q-head">
                            <span className="q-level-badge">{level}</span>
                            <span className="q-count">Question {current + 1}/{activeQuestions.length}</span>
                        </div>
                        <h2 className="question-text">{activeQuestions[current].q}</h2>
                        <div className="options-grid">
                            {activeQuestions[current].options.map((opt, idx) => (
                                <button key={idx} className="option-btn" onClick={() => handleAnswer(idx)}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 3. MEMORY GAME
const MemoryGame = ({ onBack }) => {
    const initialCards = [
        { id: 1, content: '🌍', matched: false }, { id: 2, content: '🌍', matched: false },
        { id: 3, content: '🚀', matched: false }, { id: 4, content: '🚀', matched: false },
        { id: 5, content: '👽', matched: false }, { id: 6, content: '👽', matched: false },
        { id: 7, content: '⭐', matched: false }, { id: 8, content: '⭐', matched: false },
        { id: 9, content: '🌙', matched: false }, { id: 10, content: '🌙', matched: false },
        { id: 11, content: '🪐', matched: false }, { id: 12, content: '🪐', matched: false },
    ];

    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [won, setWon] = useState(false);

    useEffect(() => {
        shuffleCards();
    }, []);

    const shuffleCards = () => {
        const shuffled = [...initialCards]
            .sort(() => Math.random() - 0.5)
            .map(card => ({ ...card, id: Math.random() })); // unique keys
        setCards(shuffled);
        setFlipped([]);
        setWon(false);
    };

    const handleCardClick = (idx) => {
        if (flipped.length === 2 || cards[idx].matched || flipped.includes(idx)) return;

        const newFlipped = [...flipped, idx];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const first = cards[newFlipped[0]];
            const second = cards[newFlipped[1]];

            if (first.content === second.content) {
                setCards(prev => prev.map((c, i) =>
                    newFlipped.includes(i) ? { ...c, matched: true } : c
                ));
                setFlipped([]);
                if (cards.filter(c => c.matched).length + 2 === cards.length) setWon(true);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="module-container fade-in">
            <button className="back-btn" onClick={onBack}>← Back to Hub</button>
            <div className="game-area text-center">
                <h2>Memory Mission</h2>
                <p className="mb-4">Find all the matching celestial pairs!</p>
                {won && <div className="win-msg">Mission Accomplished! 🎖️ <button onClick={shuffleCards}>Play Again</button></div>}

                <div className="memory-grid">
                    {cards.map((card, idx) => (
                        <div
                            key={card.id}
                            className={`memory-card ${flipped.includes(idx) || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                            onClick={() => handleCardClick(idx)}
                        >
                            <div className="card-face front">?</div>
                            <div className="card-face back">{card.content}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 4. DICTIONARY
const SpaceDictionary = ({ onBack }) => {
    const terms = [
        { term: "Accretion Disk", def: "A rotating disk of matter formed by accretion around a massive body (like a black hole) under the influence of gravitation." },
        { term: "Asteroid", def: "A small rocky body orbiting the sun. Large numbers of these, ranging in size from nearly 600 miles to dust particles, are found between the orbits of Mars and Jupiter." },
        { term: "Astronomical Unit (AU)", def: "A unit of measurement equal to 149.6 million kilometers, the mean distance from the center of the earth to the center of the sun." },
        { term: "Black Hole", def: "A region of space where gravity is so strong that nothing, including light, can escape." },
        { term: "Comet", def: "A celestial object consisting of a nucleus of ice and dust and, when near the sun, a ‘tail’ of gas and dust particles pointing away from the sun." },
        { term: "Dark Matter", def: "Nonluminous material that is postulated to exist in space and that could take any of several forms including weakly interacting particles." },
        { term: "Dwarf Planet", def: "A celestial body resembling a small planet but lacking certain technical criteria that are required for it to be classed as such." },
        { term: "Event Horizon", def: "The boundary around a black hole beyond which no electromagnetic radiation (light) can escape." },
        { term: "Exoplanet", def: "A planet that orbits a star outside our solar system." },
        { term: "Galaxy", def: "A system of millions or billions of stars, together with gas and dust, held together by gravitational attraction." },
        { term: "Gamma Ray Burst", def: "Short-lived bursts of gamma-ray light, the most energetic form of light, likely from massive star collapses." },
        { term: "Gravity", def: "The force that attracts a body toward the center of the earth, or toward any other physical body having mass." },
        { term: "Light Year", def: "The distance light travels in one year (about 9.46 trillion km)." },
        { term: "Meteor", def: "The streak of light seen when a meteoroid enters the atmosphere and starts burning up (a 'shooting star')." },
        { term: "Nebula", def: "A giant cloud of dust and gas in space, often where stars are born." },
        { term: "Neutron Star", def: "A celestial object of very small radius (typically 18 miles) and very high density, composed predominantly of closely packed neutrons." },
        { term: "Orbit", def: "The curved path of a celestial object or spacecraft around a star, planet, or moon." },
        { term: "Pulsar", def: "A celestial object, thought to be a rapidly rotating neutron star, that emits regular pulses of radio waves and other electromagnetic radiation." },
        { term: "Quasar", def: "A massive and extremely remote celestial object, emitting exceptionally large amounts of energy, and typically having a starlike image in a telescope." },
        { term: "Red Giant", def: "A very large star of high luminosity and low surface temperature. Red giants are thought to be in a late stage of evolution when no hydrogen remains in the core to fuel nuclear fusion." },
        { term: "Singularity", def: "A point at which a function takes an infinite value, especially in space-time when matter is infinitely dense, as at the center of a black hole." },
        { term: "Supernova", def: "The explosion of a star, possibly caused by gravitational collapse." },
        { term: "Telescope", def: "An optical instrument designed to make distant objects appear nearer, containing an arrangement of lenses, or of curved mirrors and lenses." },
        { term: "Wormhole", def: "A theoretical passage through space-time that could create shortcuts for long journeys across the universe." },
        { term: "Zodiac", def: "A belt of the heavens within about 8° either side of the ecliptic, including all apparent positions of the sun, moon, and most familiar planets." }
    ].sort((a, b) => a.term.localeCompare(b.term));

    return (
        <div className="module-container fade-in">
            <button className="back-btn" onClick={onBack}>← Back to Hub</button>
            <div className="dict-list">
                <h2 className="text-center mb-4">Galactic Dictionary</h2>
                <div className="terms-grid">
                    {terms.map((t, idx) => (
                        <div key={idx} className="term-card glass-panel">
                            <h3>{t.term}</h3>
                            <p>{t.def}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 5. TECH STORIES
const TechStories = ({ onBack }) => {
    const stories = [
        {
            title: "GPS Navigation",
            icon: <Globe size={32} />,
            desc: "Originally developed for military satellite tracking, the Global Positioning System (GPS) now powers Google Maps, Uber, and even aircraft navigation."
        },
        {
            title: "Memory Foam",
            icon: <Brain size={32} />,
            desc: "NASA developed viscoelastic foam to cushion astronauts during lift-off. Today, it's in your mattress and pillows for better sleep!"
        },
        {
            title: "Camera Phones",
            icon: <Cpu size={32} />,
            desc: "CMOS image sensors were miniaturized by NASA JPL for interplanetary probes. This tech is now the heart of every smartphone camera."
        },
        {
            title: "Scratch-Resistant Lenses",
            icon: <Rocket size={32} />,
            desc: "Carbon coating tech used on space helmet visors to prevent scratches from moon dust is now used on your eyeglasses."
        }
    ];

    return (
        <div className="module-container fade-in">
            <button className="back-btn" onClick={onBack}>← Back to Hub</button>
            <div className="stories-section">
                <h2 className="text-center mb-4">Space Tech on Earth</h2>
                <div className="stories-grid">
                    {stories.map((s, idx) => (
                        <div key={idx} className="story-card glass-panel">
                            <div className="story-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Learn;

// 6. PLANET EXPLORER (3D CSS)
const PlanetExplorer = ({ onBack }) => {
    const [selectedPlanet, setSelectedPlanet] = useState(0);

    const planets = [
        {
            name: "Mercury",
            color: "linear-gradient(135deg, #a5a5a5, #5f5f5f)",
            desc: "The smallest planet in our solar system and closest to the Sun. It is only slightly larger than Earth's Moon.",
            stats: { type: "Terrestrial", moons: 0, day: "59 Earth days", year: "88 Earth days" }
        },
        {
            name: "Venus",
            color: "linear-gradient(135deg, #e6c229, #d1a000)",
            desc: "Spinning in the opposite direction to most planets, Venus is the hottest planet in our solar system.",
            stats: { type: "Terrestrial", moons: 0, day: "243 Earth days", year: "225 Earth days" }
        },
        {
            name: "Earth",
            color: "linear-gradient(135deg, #2196f3, #4caf50)",
            desc: "Our home planet is the only place we know of so far that's inhabited by living things.",
            stats: { type: "Terrestrial", moons: 1, day: "24 hours", year: "365.25 days" }
        },
        {
            name: "Mars",
            color: "linear-gradient(135deg, #ff5722, #c62828)",
            desc: "Mars is a dusty, cold, desert world with a very thin atmosphere. It is also a dynamic planet with seasons.",
            stats: { type: "Terrestrial", moons: 2, day: "24.6 hours", year: "687 Earth days" }
        },
        {
            name: "Jupiter",
            color: "linear-gradient(135deg, #d4a373, #a2724e)",
            desc: "Jupiter has more than double the mass of all the other planets combined. The Great Red Spot is a centuries-old storm.",
            stats: { type: "Gas Giant", moons: 95, day: "10 hours", year: "12 Earth years" }
        },
        {
            name: "Saturn",
            color: "linear-gradient(135deg, #ead18d, #cfa855)",
            hasRings: true,
            desc: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system.",
            stats: { type: "Gas Giant", moons: 146, day: "10.7 hours", year: "29 Earth years" }
        },
        {
            name: "Uranus",
            color: "linear-gradient(135deg, #00bcd4, #0097a7)",
            desc: "Uranus rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes it spin on its side.",
            stats: { type: "Ice Giant", moons: 28, day: "17 hours", year: "84 Earth years" }
        },
        {
            name: "Neptune",
            color: "linear-gradient(135deg, #3f51b5, #1a237e)",
            desc: "Neptune is dark, cold and whipped by supersonic winds. It was the first planet located through mathematical calculations.",
            stats: { type: "Ice Giant", moons: 16, day: "16 hours", year: "165 Earth years" }
        }
    ];

    const current = planets[selectedPlanet];

    return (
        <div className="module-container fade-in">
            <button className="back-btn" onClick={onBack}>← Back to Hub</button>

            <div className="planet-explorer-layout">
                {/* Visualizer Side */}
                <div className="planet-visual-stage">
                    <div className="planet-3d-container">
                        <div
                            className={`planet-sphere ${current.hasRings ? 'with-rings' : ''}`}
                            style={{ background: current.color }}
                        >
                            {/* CSS Rings based on boolean */}
                            {current.hasRings && <div className="planet-rings"></div>}
                            <div className="planet-shadow"></div>
                        </div>
                    </div>
                    <div className="planet-nav text-center mt-4">
                        <button className="nav-arrow" onClick={() => setSelectedPlanet(p => p > 0 ? p - 1 : planets.length - 1)}>&lt;</button>
                        <span className="mx-4 font-mono">{selectedPlanet + 1} / {planets.length}</span>
                        <button className="nav-arrow" onClick={() => setSelectedPlanet(p => p < planets.length - 1 ? p + 1 : 0)}>&gt;</button>
                    </div>
                </div>

                {/* Info Side */}
                <div className="planet-info-panel glass-panel">
                    <h1 className="planet-name">{current.name}</h1>
                    <div className="planet-type-badge">{current.stats.type}</div>

                    <p className="planet-desc">{current.desc}</p>

                    <div className="planet-stats-grid">
                        <div className="stat-item">
                            <span className="label">Moons</span>
                            <span className="value">{current.stats.moons}</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">Day Length</span>
                            <span className="value">{current.stats.day}</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">Year Length</span>
                            <span className="value">{current.stats.year}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="planet-selector-strip">
                {planets.map((p, idx) => (
                    <button
                        key={idx}
                        className={`mini-planet-btn ${idx === selectedPlanet ? 'active' : ''}`}
                        onClick={() => setSelectedPlanet(idx)}
                    >
                        <div className="mini-planet" style={{ background: p.color }}></div>
                        <span>{p.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// 7. STAR EXPLORER
const StarExplorer = ({ onBack }) => {
    const [selectedStar, setSelectedStar] = useState(0);

    const stars = [
        {
            name: "The Sun",
            color: "#ffc107",
            glow: "rgba(255, 193, 7, 0.6)",
            type: "Yellow Dwarf (G2V)",
            desc: "Our home star. A nearly perfect sphere of hot plasma, it creates the energy that sustains life on Earth.",
            stats: { dist: "0 Light Years", mass: "1 Solar Mass", temp: "5,500°C" }
        },
        {
            name: "Proxima Centauri",
            color: "#d32f2f",
            glow: "rgba(211, 47, 47, 0.6)",
            type: "Red Dwarf (M5.5Ve)",
            desc: "The closest known star to the Sun. It is a small, low-mass star located 4.24 light-years away.",
            stats: { dist: "4.24 Light Years", mass: "0.12 Solar Mass", temp: "2,769°C" }
        },
        {
            name: "Sirius A",
            color: "#80d8ff",
            glow: "rgba(128, 216, 255, 0.6)",
            type: "Main Sequence (A1V)",
            desc: "The brightest star in the night sky. It's actually a binary system, but A is the bright white main star.",
            stats: { dist: "8.6 Light Years", mass: "2 Solar Masses", temp: "9,667°C" }
        },
        {
            name: "Betelgeuse",
            color: "#ff3d00",
            glow: "rgba(255, 61, 0, 0.5)",
            type: "Red Supergiant (M1-2)",
            desc: "A colossal monster star that would reach Jupiter's orbit if placed in our solar system. Likely to go supernova soon.",
            stats: { dist: "640 Light Years", mass: "16 Solar Masses", temp: "3,200°C" }
        },
        {
            name: "Rigel",
            color: "#40c4ff",
            glow: "rgba(64, 196, 255, 0.6)",
            type: "Blue Supergiant (B8Ia)",
            desc: "A star of immense brightness and power. It puts out about 120,000 times as much energy as our Sun.",
            stats: { dist: "860 Light Years", mass: "21 Solar Masses", temp: "11,827°C" }
        },
        {
            name: "Vega",
            color: "#e1f5fe",
            glow: "rgba(225, 245, 254, 0.8)",
            type: "Main Sequence (A0V)",
            desc: "A bright blue-tinged star that will become our North Star in about 12,000 years due to precession.",
            stats: { dist: "25 Light Years", mass: "2.1 Solar Masses", temp: "9,327°C" }
        }
    ];

    const current = stars[selectedStar];

    return (
        <div className="module-container fade-in">
            <button className="back-btn" onClick={onBack}>← Back to Hub</button>

            <div className="planet-explorer-layout">
                {/* Visualizer Side */}
                <div className="planet-visual-stage">
                    <div className="planet-3d-container">
                        <div
                            className="star-sphere pulsating-star"
                            style={{
                                background: `radial-gradient(circle at 30% 30%, #fff, ${current.color})`,
                                boxShadow: `0 0 60px 20px ${current.glow}, inset -10px -10px 40px rgba(0,0,0,0.5)`
                            }}
                        >
                            <div className="star-corona" style={{ borderColor: current.color }}></div>
                        </div>
                    </div>
                    <div className="planet-nav text-center mt-4">
                        <button className="nav-arrow" onClick={() => setSelectedStar(p => p > 0 ? p - 1 : stars.length - 1)}>&lt;</button>
                        <span className="mx-4 font-mono">{selectedStar + 1} / {stars.length}</span>
                        <button className="nav-arrow" onClick={() => setSelectedStar(p => p < stars.length - 1 ? p + 1 : 0)}>&gt;</button>
                    </div>
                </div>

                {/* Info Side */}
                <div className="planet-info-panel glass-panel">
                    <h1 className="planet-name" style={{ backgroundImage: `linear-gradient(90deg, #fff, ${current.color})` }}>{current.name}</h1>
                    <div className="planet-type-badge" style={{ borderColor: current.color }}>{current.type}</div>

                    <p className="planet-desc">{current.desc}</p>

                    <div className="planet-stats-grid">
                        <div className="stat-item">
                            <span className="label">Distance</span>
                            <span className="value">{current.stats.dist}</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">Mass</span>
                            <span className="value">{current.stats.mass}</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">Temperature</span>
                            <span className="value">{current.stats.temp}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="planet-selector-strip">
                {stars.map((s, idx) => (
                    <button
                        key={idx}
                        className={`mini-planet-btn ${idx === selectedStar ? 'active' : ''}`}
                        onClick={() => setSelectedStar(idx)}
                    >
                        <div className="mini-planet" style={{ background: s.color, boxShadow: `0 0 10px ${s.glow}` }}></div>
                        <span>{s.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
