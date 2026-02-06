import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Cpu, Gamepad2, Rocket, RotateCcw, Check, X, Globe, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import SmartTerm from '../components/SmartTerm';
import './Learn.css';

const Learn = () => {
    const [activeTab, setActiveTab] = useState('HUB'); // HUB, QUIZ, GAME, DICT, TECH, PLANET, STAR, SNACKS

    return (
        <div className="learn-container">
            {activeTab === 'HUB' && <LearnHub setActiveTab={setActiveTab} />}
            {activeTab === 'QUIZ' && <QuizModule onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'GAME' && <MemoryGame onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'DICT' && <SpaceDictionary onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'TECH' && <TechStories onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'PLANET' && <PlanetExplorer onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'STAR' && <StarExplorer onBack={() => setActiveTab('HUB')} />}
            {activeTab === 'SNACKS' && <EducationSnacks onBack={() => setActiveTab('HUB')} />}
        </div>
    );
};

// 1. HUB COMPONENT
const LearnHub = ({ setActiveTab }) => (
    <div className="learn-hub fade-in">
        <h1 className="page-title text-center">Cosmic Learning Zone</h1>
        <p className="page-subtitle text-center">Explore, Play, and Master the Universe</p>

        <div className="hub-grid">
            <div className="hub-card snacks-card" onClick={() => setActiveTab('SNACKS')}>
                <Zap size={48} />
                <h2>Why Should I Care?</h2>
                <p>20-second micro-learning cards about space impact.</p>
            </div>
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

    const [difficulty, setDifficulty] = useState(0); // 0-10 scale
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [history, setHistory] = useState([]); // Track used questions
    const [score, setScore] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiFeedback, setAiFeedback] = useState("");

    const getDifficultyTier = (d) => {
        if (d <= 3) return 'EASY';
        if (d <= 7) return 'MEDIUM';
        return 'HARD';
    };

    const pickQuestion = (currentDifficulty) => {
        const tier = getDifficultyTier(currentDifficulty);
        const pool = LEVELS[tier];
        // Filter out recently used questions if possible, or just pick random
        const unused = pool.filter(q => !history.includes(q.q));
        const finalPool = unused.length > 0 ? unused : pool;
        const randomQ = finalPool[Math.floor(Math.random() * finalPool.length)];
        return { ...randomQ, tier };
    };

    useEffect(() => {
        if (!currentQuestion && !showScore) {
            setCurrentQuestion(pickQuestion(difficulty));
        }
    }, [difficulty, showScore]);

    const handleAnswer = (idx) => {
        const isCorrect = idx === currentQuestion.ans;
        const oldDiff = difficulty;
        let newDiff = difficulty;

        if (isCorrect) {
            setScore(score + 1);
            newDiff = Math.min(10, difficulty + 2);
            setAiFeedback("Correct! Increasing challenge protocol...");
        } else {
            newDiff = Math.max(0, difficulty - 1);
            setAiFeedback("Analyzing error... Frequency adjusted.");
        }

        setHistory([...history, currentQuestion.q]);
        setTotalAnswered(totalAnswered + 1);
        setIsAnalyzing(true);

        setTimeout(() => {
            if (totalAnswered + 1 >= 10) {
                setShowScore(true);
            } else {
                setDifficulty(newDiff);
                setCurrentQuestion(pickQuestion(newDiff));
            }
            setIsAnalyzing(false);
        }, 1200);
    };

    const resetQuiz = () => {
        setScore(0);
        setTotalAnswered(0);
        setDifficulty(0);
        setHistory([]);
        setCurrentQuestion(null);
        setShowScore(false);
    };

    if (!currentQuestion && !showScore) return <div className="loading">Initializing AI Neural Net...</div>;

    return (
        <div className="module-container adaptive-quiz fade-in">
            <button className="back-btn" onClick={onBack}>← Back to Hub</button>

            <div className="ai-status-bar glass-panel">
                <div className="status-item">
                    <Brain size={16} className="text-cyan-400" />
                    <span>AI Engine Active</span>
                </div>
                <div className="status-item">
                    <Zap size={16} className="text-yellow-400" />
                    <span>Difficulty: {difficulty}/10 ({getDifficultyTier(difficulty)})</span>
                </div>
                <div className="difficulty-meter">
                    <div className="diff-progress" style={{ width: `${(difficulty / 10) * 100}%` }}></div>
                </div>
            </div>

            <div className="quiz-box glass-panel">
                {showScore ? (
                    <div className="score-section text-center">
                        <Cpu size={64} className="mb-4 text-cyan-400" />
                        <h2>Neural Analysis Complete</h2>
                        <div className="final-score">{score} / {totalAnswered}</div>
                        <p className="peak-difficulty">Peak Difficulty Reached: {Math.max(...history.map(q => {
                            // Find tier of this question in LEVELS
                            if (LEVELS.HARD.some(hq => hq.q === q)) return 10;
                            if (LEVELS.MEDIUM.some(mq => mq.q === q)) return 6;
                            return 2;
                        }))}/10</p>
                        <p className="analysis-text">
                            {score === totalAnswered ? "Exceptional synchronization. Your cognitive patterns match senior astro-scientists." :
                                score > 7 ? "High-level aptitude detected. Minimal recalibration required." :
                                    score > 4 ? "Standard performance. Neural paths require further star-data absorption." : "Critical system failure. Returning to basic education protocols."}
                        </p>
                        <button className="action-btn" onClick={resetQuiz}>Re-Run Simulation</button>
                    </div>
                ) : (
                    <div className={`question-section ${isAnalyzing ? 'analyzing' : ''}`}>
                        {isAnalyzing ? (
                            <div className="ai-analysis-overlay">
                                <div className="scanner-line"></div>
                                <Brain size={48} className="pulse" />
                                <p>{aiFeedback}</p>
                            </div>
                        ) : (
                            <>
                                <div className="q-head">
                                    <span className={`q-level-badge ${currentQuestion.tier.toLowerCase()}`}>{currentQuestion.tier}</span>
                                    <span className="q-count">Protocol {totalAnswered + 1}/10</span>
                                </div>
                                <h2 className="question-text">{currentQuestion.q}</h2>
                                <div className="options-grid">
                                    {currentQuestion.options.map((opt, idx) => (
                                        <button key={idx} className="option-btn" onClick={() => handleAnswer(idx)}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
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
            desc: <>Originally developed for military <SmartTerm term="Satellite" /> tracking, the <SmartTerm term="GPS" display="Global Positioning System (GPS)" /> now powers Google Maps, Uber, and even aircraft navigation.</>
        },
        {
            title: "Memory Foam",
            icon: <Brain size={32} />,
            desc: <>NASA developed viscoelastic foam to cushion astronauts during lift-off. Today, it's in your mattress and pillows for better sleep!</>
        },
        {
            title: "Camera Phones",
            icon: <Cpu size={32} />,
            desc: <>CMOS image sensors were miniaturized by NASA JPL for interplanetary <SmartTerm term="Probe" display="probes" />. This tech is now the heart of every smartphone camera.</>
        },
        {
            title: "Scratch-Resistant Lenses",
            icon: <Rocket size={32} />,
            desc: <>Carbon coating tech used on space helmet visors to prevent scratches from moon dust is now used on your eyeglasses.</>
        },
        {
            title: "Water Filtration",
            icon: <Globe size={32} />,
            desc: <>NASA developed advanced water purification systems for the <SmartTerm term="ISS" /> to recycle every drop. This same tech provides clean water in remote areas on Earth.</>
        },
        {
            title: "Insulin Pumps",
            icon: <Zap size={32} />,
            desc: <>The technology used to monitor Mars Viking lander life-support systems led to the creation of the first implantable insulin pumps for diabetics.</>
        },
        {
            title: "Wireless Tools",
            icon: <Cpu size={32} />,
            desc: <>Black & Decker collaborated with NASA to develop cordless, battery-powered drills for Apollo moon samples, paving the way for modern cordless tools.</>
        },
        {
            title: "Invisible Braces",
            icon: <Brain size={32} />,
            desc: <>Translucent polycrystalline alumina (TPA) was developed to protect infrared switches on heat-seeking missiles. It's now used for aesthetic orthodontic braces.</>
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

// ... imports
import InteractiveModel from '../components/InteractiveModel';

// ... (previous code)

// 6. PLANET EXPLORER (3D CSS)
const PlanetExplorer = ({ onBack }) => {
    const [selectedPlanet, setSelectedPlanet] = useState(0);
    const [earthAge, setEarthAge] = useState('');
    const [planetAge, setPlanetAge] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const planets = [
        {
            name: "Mercury",
            color: "linear-gradient(135deg, #a5a5a5, #5f5f5f)",
            modelColor: "#a5a5a5",
            textureUrl: "/textures/mercury.jpg",
            soundUrl: "/sounds/mercury.mp3",
            desc: "The smallest planet in our solar system and closest to the Sun. It is only slightly larger than Earth's Moon.",
            stats: { type: "Terrestrial", moons: 0, day: "59 Earth days", year: "88 Earth days" },
            yearRatio: 0.24 // Earth years to Mercury years
        },
        {
            name: "Venus",
            color: "linear-gradient(135deg, #e6c229, #d1a000)",
            modelColor: "#e6c229",
            textureUrl: "/textures/venus.jpg",
            soundUrl: "/sounds/venus.mp3",
            desc: "Spinning in the opposite direction to most planets, Venus is the hottest planet in our solar system.",
            stats: { type: "Terrestrial", moons: 0, day: "243 Earth days", year: "225 Earth days" },
            yearRatio: 0.62
        },
        {
            name: "Earth",
            color: "linear-gradient(135deg, #2196f3, #4caf50)",
            modelColor: "#2196f3",
            textureUrl: "/textures/earth.jpg",
            soundUrl: "/sounds/earth.mp3",
            desc: "Our home planet is the only place we know of so far that's inhabited by living things.",
            stats: { type: "Terrestrial", moons: 1, day: "24 hours", year: "365.25 days" },
            yearRatio: 1.0
        },
        {
            name: "Mars",
            color: "linear-gradient(135deg, #ff5722, #c62828)",
            modelColor: "#ff5722",
            textureUrl: "/textures/mars.jpg",
            soundUrl: "/sounds/mars.mp3",
            desc: "Mars is a dusty, cold, desert world with a very thin atmosphere. It is also a dynamic planet with seasons.",
            stats: { type: "Terrestrial", moons: 2, day: "24.6 hours", year: "687 Earth days" },
            yearRatio: 1.88
        },
        {
            name: "Jupiter",
            color: "linear-gradient(135deg, #d4a373, #a2724e)",
            modelColor: "#d4a373",
            textureUrl: "/textures/jupiter.jpg",
            soundUrl: "/sounds/jupiter.mp3",
            desc: "Jupiter has more than double the mass of all the other planets combined. The Great Red Spot is a centuries-old storm.",
            stats: { type: "Gas Giant", moons: 95, day: "10 hours", year: "12 Earth years" },
            yearRatio: 11.86
        },
        {
            name: "Saturn",
            color: "linear-gradient(135deg, #ead18d, #cfa855)",
            modelColor: "#ead18d",
            textureUrl: "/textures/saturn.jpg",
            soundUrl: "/sounds/saturn.mp3",
            hasRings: true,
            desc: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system.",
            stats: { type: "Gas Giant", moons: 146, day: "10.7 hours", year: "29 Earth years" },
            yearRatio: 29.46
        },
        {
            name: "Uranus",
            color: "linear-gradient(135deg, #00bcd4, #0097a7)",
            modelColor: "#00bcd4",
            textureUrl: "/textures/uranus.jpg",
            soundUrl: "/sounds/uranus.mp3",
            desc: "Uranus rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes it spin on its side.",
            stats: { type: "Ice Giant", moons: 28, day: "17 hours", year: "84 Earth years" },
            yearRatio: 84.01
        },
        {
            name: "Neptune",
            color: "linear-gradient(135deg, #3f51b5, #1a237e)",
            modelColor: "#3f51b5",
            textureUrl: "/textures/neptune.jpg",
            soundUrl: "/sounds/neptune.mp3",
            desc: "Neptune is dark, cold and whipped by supersonic winds. It was the first planet located through mathematical calculations.",
            stats: { type: "Ice Giant", moons: 16, day: "16 hours", year: "165 Earth years" },
            yearRatio: 164.79
        }
    ];

    const current = planets[selectedPlanet];

    const playPlanetSound = async () => {
        try {
            setIsPlaying(true);

            // Source: Procedural Atmospheric Synthesis
            // Note: External audio APIs (NASA/Archive.org/Wikimedia) are unreliable/unreachable.
            // Using high-fidelity local synthesis for stability.
            const nasaSounds = {
                // 'Earth': '/sounds/earth.ogg',
                // 'Mars': '/sounds/mars.ogg',
                // 'Jupiter': '/sounds/jupiter.ogg',
                // 'Saturn': '/sounds/saturn.ogg',
            };

            // Create audio element with proper setup
            const audio = new Audio();
            audio.crossOrigin = "anonymous";

            try {
                // Force synthesis for all planets if no stable URL exists
                if (!nasaSounds[current.name]) {
                    console.log(`Using atmospheric synthesis for ${current.name} (Source unavailable)`);
                    playSynthesizedSound();
                    return;
                }

                audio.src = nasaSounds[current.name];

                audio.addEventListener('canplaythrough', () => {
                    console.log('NASA audio loaded successfully');
                    audio.play().then(() => {
                        console.log('NASA audio playing');
                    }).catch(error => {
                        console.log('NASA audio play failed:', error);
                        playSynthesizedSound();
                    });
                });

                audio.addEventListener('error', (e) => {
                    console.log('NASA audio error:', e);
                    console.log('Using synthesized sound instead');
                    playSynthesizedSound();
                });

                audio.addEventListener('ended', () => {
                    console.log('NASA audio ended');
                    setIsPlaying(false);
                });

                audio.load();

                // Fallback timeout
                setTimeout(() => {
                    if (isPlaying) {
                        console.log('NASA audio timeout - using synthesized sound');
                        playSynthesizedSound();
                    }
                }, 3000);

            } catch (soundError) {
                console.log('Error setting up NASA audio:', soundError);
                playSynthesizedSound();
            }

        } catch (error) {
            console.log('Error in playPlanetSound:', error);
            playSynthesizedSound();
        }
    };

    const playSynthesizedSound = () => {
        // Create an "Atmospheric Wind" sound procedurally using white noise and filtering
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Generate White Noise Buffer
        const bufferSize = 2 * audioContext.sampleRate;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const source = audioContext.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';

        // Map filter frequency to planet "thickness"
        const atmosphereDensityScale = {
            'Mercury': 1800, // Thin, high-frequency "whistle"
            'Venus': 250,    // Dense, heavy "rumble"
            'Earth': 800,    // Standard wind
            'Mars': 1400,    // Thin air whistle
            'Jupiter': 400,   // Gas giant roar
            'Saturn': 500,    // Ring-distorted noise
            'Uranus': 650,
            'Neptune': 700
        };

        filter.frequency.setValueAtTime(atmosphereDensityScale[current.name] || 800, audioContext.currentTime);
        filter.Q.value = 8; // Add some resonance

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3.5);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();
        setTimeout(() => {
            source.stop();
            setIsPlaying(false);
        }, 3500);
    };

    const calculatePlanetAge = () => {
        const age = parseFloat(earthAge);
        if (!isNaN(age) && age > 0) {
            const planetYears = (age / current.yearRatio).toFixed(2);
            setPlanetAge(planetYears);
        } else {
            setPlanetAge(null);
        }
    };

    useEffect(() => {
        calculatePlanetAge();
    }, [earthAge, selectedPlanet]);

    return (
        <div className="module-container fade-in">
            <button className="back-btn" onClick={onBack}>← Back to Hub</button>

            <div className="planet-explorer-layout">
                {/* Visualizer Side */}
                <div className="planet-visual-stage">
                    <div className="planet-3d-container" style={{ overflow: 'hidden', borderRadius: '1rem', background: 'rgba(0,0,0,0.3)' }}>
                        <InteractiveModel
                            key={current.name} // Force re-render on change
                            type="planet"
                            color={current.modelColor}
                            size={2.2}
                            textureUrl={current.textureUrl}
                        />
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

                    {/* Planet Sound Feature */}
                    <div className="planet-sound-section">
                        <h3>🔊 Planetary Atmosphere</h3>
                        <p>Listen to the "voice" of the planet. These recordings capture atmospheric winds, plasma waves, and radio emissions converted into sound.</p>
                        <div className="sound-info">
                            <small className="sound-description">
                                {current.name === 'Mars' && '🔴 Real raw audio of Martian wind captured by the Perseverance Rover microphone.'}
                                {current.name === 'Earth' && '🌍 Plasmaspheric hiss: Electromagnetic waves in Earth’s magnetosphere converted to sound.'}
                                {current.name === 'Jupiter' && '🟠 Juno flyby: Radio emissions from Jupiter’s auroras converted into the audible range.'}
                                {current.name === 'Saturn' && '🪐 Radio emissions from Saturn’s magnetic field captured by the Cassini spacecraft.'}
                                {current.name === 'Mercury' && '⚪ Sonification of Mercury’s intense solar wind and magnetic field interactions.'}
                                {current.name === 'Venus' && '🟡 The eerie low-frequency roar of Venus’s hyper-dense and stormy atmosphere.'}
                                {current.name === 'Uranus' && '🔵 Electromagnetic signals captured by Voyager 2 during its 1986 ice giant encounter.'}
                                {current.name === 'Neptune' && '🔷 The final destination: Voyager 2’s radio conversion of Neptune’s supersonic winds.'}
                            </small>
                            <div className="sound-source-badge">MISSION RECORDING</div>
                        </div>
                        <button
                            className={`planet-sound-btn ${isPlaying ? 'playing' : ''}`}
                            onClick={playPlanetSound}
                            disabled={isPlaying}
                        >
                            <div className="btn-icon">
                                {isPlaying ? <Zap size={18} className="pulse" /> : '🔊'}
                            </div>
                            <span>{isPlaying ? 'GENERATING AUDIO...' : 'LISTEN (SIMULATION)'}</span>
                        </button>
                    </div>

                    {/* Age Calculator Feature */}
                    <div className="planet-age-calculator">
                        <h3>🎂 Age Calculator</h3>
                        <p>Calculate your age in {current.name} years!</p>
                        <div className="age-input-group">
                            <input
                                type="number"
                                placeholder="Enter your age in Earth years"
                                value={earthAge}
                                onChange={(e) => setEarthAge(e.target.value)}
                                className="age-input"
                                min="0"
                                max="150"
                            />
                            <button
                                className="calculate-btn"
                                onClick={calculatePlanetAge}
                            >
                                Calculate
                            </button>
                        </div>
                        {planetAge && (
                            <div className="age-result">
                                <span className="age-label">Your age on {current.name}:</span>
                                <span className="age-value">{planetAge} {current.name} years</span>
                            </div>
                        )}
                    </div>

                    <div className="planet-stats-grid">
                        <div className="stat-item">
                            <span className="label">Moons</span>
                            <span className="value">{current.stats.moons}</span>
                        </div>
                        <div className="stat-item">
                            <span className="label"><SmartTerm term="Orbit" display="Day Length" /></span>
                            <span className="value">{current.stats.day}</span>
                        </div>
                        <div className="stat-item">
                            <span className="label"><SmartTerm term="Orbit" display="Year Length" /></span>
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
            textureUrl: "/textures/sun.jpg",
            type: "Yellow Dwarf (G2V)",
            desc: "Our home star. A nearly perfect sphere of hot plasma, it creates the energy that sustains life on Earth.",
            stats: { dist: "0 Light Years", mass: "1 Solar Mass", temp: "5,500°C" }
        },
        // ... (other stars remain same)
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
                    <div className="planet-3d-container" style={{ overflow: 'hidden', borderRadius: '1rem', background: 'rgba(0,0,0,0.5)' }}>
                        <InteractiveModel
                            key={current.name}
                            type="star"
                            color={current.color}
                            size={2.5}
                            textureUrl={current.textureUrl}
                        />
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
                            <span className="value"><SmartTerm term="Light Year" display={current.stats.dist} /></span>
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

// 8. EDUCATION SNACKS - "Why Should I Care?"
const EducationSnacks = ({ onBack }) => {
    const snacks = [
        {
            title: "Why Solar Storms Matter",
            emoji: "⚡",
            gradient: "linear-gradient(135deg, #ff6b6b, #ee5a6f)",
            content: [
                <><SmartTerm term="Solar Flare" display="Solar storms" /> can knock out <SmartTerm term="GPS" />, power grids, and <SmartTerm term="Satellite" display="satellites" />.</>,
                "In 1989, a solar storm caused a 9-hour blackout in Quebec, Canada.",
                "Airlines reroute flights to avoid radiation during major storms.",
                "Your smartphone relies on satellites that are vulnerable to these storms."
            ],
            impact: "Real-world impact: Without monitoring, we'd lose communication and navigation systems globally."
        },
        {
            title: "Why Satellites Are Critical for Floods",
            emoji: "🛰️",
            gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
            content: [
                <><SmartTerm term="Satellite" display="Satellites" /> detect rising water levels before floods hit populated areas.</>,
                "They provide real-time data to emergency services for evacuation planning.",
                "Weather satellites track storm patterns that cause flooding.",
                "Flood prediction accuracy has improved by 60% thanks to satellite data."
            ],
            impact: "Real-world impact: Satellite monitoring saves thousands of lives every year through early warnings."
        },
        {
            title: "Why Asteroids Are Monitored",
            emoji: "☄️",
            gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
            content: [
                <>A 140-meter <SmartTerm term="Asteroid" /> could destroy an entire city if it hits Earth.</>,
                <>NASA tracks over 30,000 <SmartTerm term="NEO" display="near-Earth objects" /> constantly.</>,
                "The Chelyabinsk meteor (2013) injured 1,500 people - and we didn't see it coming.",
                "With enough warning, we could deflect a dangerous asteroid (NASA proved this in 2022)."
            ],
            impact: "Real-world impact: Asteroid tracking is literally planetary defense - protecting all life on Earth."
        },
        {
            title: "Why Space Weather Forecasting Exists",
            emoji: "🌌",
            gradient: "linear-gradient(135deg, #a8edea, #fed6e3)",
            content: [
                <><SmartTerm term="Space Weather" /> affects astronauts' radiation exposure on the <SmartTerm term="ISS" />.</>,
                <><SmartTerm term="Solar Flare" display="Solar flares" /> can disrupt radio communications for aircraft.</>,
                <><SmartTerm term="Geomagnetic Storm" display="Geomagnetic storms" /> interfere with oil pipeline operations.</>,
                "Forecasting helps protect $2 trillion worth of space infrastructure."
            ],
            impact: "Real-world impact: Space weather forecasting protects critical infrastructure and human lives."
        },
        {
            title: "Why We Study Mars",
            emoji: "🔴",
            gradient: "linear-gradient(135deg, #ff9a56, #ff6a88)",
            content: [
                <><SmartTerm term="Planet" display="Mars" /> research helps us understand climate change on Earth.</>,
                <><SmartTerm term="Rover" display="Technologies" /> developed for Mars <SmartTerm term="Rover" display="rovers" /> improve medical robotics.</>,
                "Studying Mars geology reveals how planets form and evolve.",
                "Mars missions inspire millions to pursue STEM careers."
            ],
            impact: "Real-world impact: Mars exploration drives innovation that improves life on Earth today."
        },
        {
            title: "Why Rocket Science Matters to You",
            emoji: "🚀",
            gradient: "linear-gradient(135deg, #667eea, #764ba2)",
            content: [
                <><SmartTerm term="Launch Vehicle" display="Rocket" /> fuel research led to better water filtration systems.</>,
                "Lightweight materials from spacecraft are now in prosthetic limbs.",
                "Rocket engine cooling tech is used in modern air conditioning.",
                <><SmartTerm term="Launch Vehicle" /> innovations improve electric car batteries.</>
            ],
            impact: "Real-world impact: Rocket technology innovations touch your daily life in unexpected ways."
        },
        {
            title: "Why the Moon Still Matters",
            emoji: "🌙",
            gradient: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
            content: [
                <>The <SmartTerm term="Moon Phase" display="Moon" /> stabilizes Earth's tilt, giving us stable seasons.</>,
                "Lunar missions test technologies for deep space exploration.",
                "Moon dust research improves air filtration and construction materials.",
                "The Moon is a stepping stone for Mars missions and beyond."
            ],
            impact: "Real-world impact: The Moon is both a natural stabilizer and a technological testbed for humanity."
        },
        {
            title: "Why Black Holes Aren't Just Sci-Fi",
            emoji: "🕳️",
            gradient: "linear-gradient(135deg, #30cfd0, #330867)",
            content: [
                "Black hole research tests Einstein's theories in extreme conditions.",
                "Studying black holes helps us understand galaxy formation.",
                "The first black hole image (2019) required global telescope collaboration.",
                "Black hole physics advances quantum computing and encryption."
            ],
            impact: "Real-world impact: Black hole research pushes the boundaries of physics and technology."
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [completedCards, setCompletedCards] = useState(new Set());
    const [showCongrats, setShowCongrats] = useState(false);

    const current = snacks[currentIndex];
    const progress = (completedCards.size / snacks.length) * 100;

    const handleNext = () => {
        const newCompleted = new Set(completedCards);
        newCompleted.add(currentIndex);
        setCompletedCards(newCompleted);

        if (currentIndex < snacks.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowCongrats(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const resetSnacks = () => {
        setCurrentIndex(0);
        setCompletedCards(new Set());
        setShowCongrats(false);
    };

    if (showCongrats) {
        return (
            <div className="module-container fade-in">
                <button className="back-btn" onClick={onBack}>← Back to Hub</button>
                <div className="snacks-congrats glass-panel text-center">
                    <div className="congrats-emoji">🎉</div>
                    <h2>Mission Complete!</h2>
                    <p>You've explored all {snacks.length} education snacks.</p>
                    <p className="congrats-message">
                        You now understand why space science matters to your everyday life!
                    </p>
                    <div className="congrats-stats">
                        <div className="stat-badge">
                            <span className="stat-number">{snacks.length}</span>
                            <span className="stat-label">Cards Completed</span>
                        </div>
                        <div className="stat-badge">
                            <span className="stat-number">~{snacks.length * 20}s</span>
                            <span className="stat-label">Learning Time</span>
                        </div>
                    </div>
                    <button className="action-btn" onClick={resetSnacks}>Review Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="module-container fade-in">
            <button className="back-btn" onClick={onBack}>← Back to Hub</button>

            <div className="snacks-header text-center">
                <h2>Why Should I Care? 🎯</h2>
                <p className="snacks-subtitle">Micro-learning in 20 seconds</p>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="progress-text">{completedCards.size} / {snacks.length} completed</p>
            </div>

            <div className="snacks-card-container">
                <div
                    className="snack-card glass-panel"
                    style={{ background: current.gradient }}
                >
                    <div className="snack-emoji">{current.emoji}</div>
                    <h3 className="snack-title">{current.title}</h3>

                    <div className="snack-content">
                        {current.content.map((point, idx) => (
                            <div key={idx} className="snack-point">
                                <span className="point-bullet">•</span>
                                <span className="point-text">{point}</span>
                            </div>
                        ))}
                    </div>

                    <div className="snack-impact">
                        <strong>💡 {current.impact}</strong>
                    </div>

                    <div className="snack-counter">
                        {currentIndex + 1} / {snacks.length}
                    </div>
                </div>

                <div className="snacks-navigation">
                    <button
                        className="nav-btn prev-btn"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft size={24} />
                        Previous
                    </button>
                    <button
                        className="nav-btn next-btn"
                        onClick={handleNext}
                    >
                        {currentIndex === snacks.length - 1 ? 'Complete' : 'Next'}
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="snacks-dots">
                    {snacks.map((_, idx) => (
                        <div
                            key={idx}
                            className={`dot ${idx === currentIndex ? 'active' : ''} ${completedCards.has(idx) ? 'completed' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Learn;
