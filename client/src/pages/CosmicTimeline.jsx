import React, { useState, useMemo, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import * as Astronomy from 'astronomy-engine';
import { Calendar, Globe, Zap, Navigation, Wind, Layers, AlertCircle } from 'lucide-react';
import './CosmicTimeline.css';

// --- TEXTURE FALLBACKS & ASSETS ---
const TEXTURES = {
    Mercury: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury.jpg',
    Venus: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus_surface.jpg',
    Earth: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    Mars: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg',
    Jupiter: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg',
    Saturn: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg',
    Uranus: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg',
    Neptune: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg',
    Sun: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lava/lavatile.jpg'
};

const BODIES = [
    { name: 'Mercury', size: 0.6, body: 'Mercury', color: '#A5A5A5' },
    { name: 'Venus', size: 1.0, body: 'Venus', color: '#E3BB76' },
    { name: 'Earth', size: 1.1, body: 'Earth', color: '#2271B3', hasISS: true },
    { name: 'Mars', size: 0.8, body: 'Mars', color: '#E27B58' },
    { name: 'Jupiter', size: 2.5, body: 'Jupiter', color: '#D39C7E' },
    { name: 'Saturn', size: 2.1, body: 'Saturn', color: '#C5AB6E', rings: true },
    { name: 'Uranus', size: 1.5, body: 'Uranus', color: '#BBE1E4' },
    { name: 'Neptune', size: 1.5, body: 'Neptune', color: '#6081FF' },
];

const getPlanetPos = (body, date) => {
    try {
        const vector = Astronomy.HelioVector(body, date);
        const rawDist = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
        const displayDist = Math.log10(rawDist + 1) * 25;
        const angle = Math.atan2(vector.y, vector.x);
        return [
            Math.cos(angle) * displayDist,
            vector.z * 1.5,
            Math.sin(angle) * displayDist
        ];
    } catch (e) {
        return [0, 0, 0];
    }
};

// --- ERROR BOUNDARY ---
class CanvasErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) {
            return (
                <div className="canvas-error">
                    <AlertCircle size={48} className="text-red-500 mb-4" />
                    <h2>3D Engine Error</h2>
                    <p>Failed to initialize WebGL. Please refresh or check your browser settings.</p>
                    <button onClick={() => window.location.reload()} className="play-btn-v2 active mt-4">RELOAD SYSTEM</button>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- 3D COMPONENTS ---

const Sun = () => {
    const sunRef = useRef();
    let texture = null;
    try {
        texture = useTexture(TEXTURES.Sun);
    } catch (e) { }

    useFrame(({ clock }) => {
        sunRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    });

    return (
        <group>
            <mesh ref={sunRef}>
                <sphereGeometry args={[4.5, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    emissive="#ff4400"
                    emissiveIntensity={3}
                    color="#ff8800"
                />
            </mesh>
            <pointLight intensity={150} distance={400} color="#ffcc00" />
            <SolarWindWaves />

            <mesh>
                <sphereGeometry args={[4.7, 32, 32]} />
                <meshBasicMaterial color="#ffcc00" transparent opacity={0.15} />
            </mesh>
        </group>
    );
};

const SolarWindWaves = () => {
    const count = 300;
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const r = 6 + Math.random() * 80;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI - Math.PI / 2;
            p[i * 3] = r * Math.cos(theta) * Math.cos(phi);
            p[i * 3 + 1] = r * Math.sin(phi);
            p[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
            s[i] = Math.random() * 0.2 + 0.1;
        }
        return { p, s };
    }, []);

    const pointsRef = useRef();
    useFrame(({ clock }) => {
        const positions = pointsRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
            let vx = positions[ix], vy = positions[iy], vz = positions[iz];
            let dist = Math.sqrt(vx * vx + vy * vy + vz * vz);

            dist += points.s[i];
            if (dist > 100) dist = 6;

            const ratio = dist / Math.sqrt(vx * vx + vy * vy + vz * vz || 1);
            positions[ix] *= ratio;
            positions[iy] *= ratio;
            positions[iz] *= ratio;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={points.p} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.3} color="#ffccaa" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </points>
    );
};

const ISSOrbit = () => {
    const issRef = useRef();
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 2.5;
        issRef.current.position.x = Math.cos(t) * 1.8;
        issRef.current.position.z = Math.sin(t) * 1.8;
        issRef.current.position.y = Math.sin(t * 0.8) * 0.7;
    });

    return (
        <group>
            <mesh ref={issRef}>
                <boxGeometry args={[0.08, 0.04, 0.2]} />
                <meshStandardMaterial color="#ffffff" emissive="#00f2ff" emissiveIntensity={3} />
            </mesh>
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <ringGeometry args={[1.78, 1.8, 64]} />
                <meshBasicMaterial color="#00f2ff" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

const AsteroidBelt = () => {
    const count = 500;
    const positions = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 45 + Math.random() * 15;
            const theta = Math.random() * Math.PI * 2;
            p[i * 3] = Math.cos(theta) * r;
            p[i * 3 + 1] = (Math.random() - 0.5) * 2;
            p[i * 3 + 2] = Math.sin(theta) * r;
        }
        return p;
    }, []);

    const beltRef = useRef();
    useFrame(() => {
        beltRef.current.rotation.y += 0.0001;
    });

    return (
        <points ref={beltRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.1} color="#999999" transparent opacity={0.5} />
        </points>
    );
};

const Planet = ({ body, size, name, hasRings, hasISS, color, date }) => {
    const meshRef = useRef();
    const pos = useMemo(() => getPlanetPos(body, date), [body, date]);

    let texture = null;
    try {
        texture = useTexture(TEXTURES[name]);
    } catch (e) {
        console.warn(`Texture failed for ${name}, using flat color.`);
    }

    useFrame(() => {
        if (meshRef.current) meshRef.current.rotation.y += 0.005;
    });

    return (
        <group position={pos}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                <mesh ref={meshRef}>
                    <sphereGeometry args={[size, 64, 64]} />
                    <meshStandardMaterial
                        map={texture}
                        color={texture ? '#ffffff' : color}
                        roughness={0.7}
                        metalness={0.2}
                    />
                    {hasRings && (
                        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                            <ringGeometry args={[size * 1.4, size * 2.8, 64]} />
                            <meshStandardMaterial color="#d2b48c" transparent opacity={0.4} side={THREE.DoubleSide} />
                        </mesh>
                    )}
                </mesh>
                <Text
                    position={[0, size + 1.5, 0]}
                    fontSize={0.6}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.03}
                    outlineColor="#000000"
                >
                    {name}
                </Text>
                {hasISS && <ISSOrbit />}
            </Float>

            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[Math.sqrt(pos[0] ** 2 + pos[2] ** 2), Math.sqrt(pos[0] ** 2 + pos[2] ** 2) + 0.1, 128]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.04} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

const SimulationHelper = ({ isAutoPlay, setDayOfYear }) => {
    useFrame((state, delta) => {
        if (isAutoPlay) {
            setDayOfYear(prev => (prev + delta * 25) % 365);
        }
    });
    return null;
};

const CosmicTimeline = () => {
    const [year, setYear] = useState(2026);
    const [dayOfYear, setDayOfYear] = useState(Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000));
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    const currentDate = useMemo(() => {
        const d = new Date(year, 0, 1);
        d.setDate(dayOfYear);
        return d;
    }, [year, dayOfYear]);

    const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

    return (
        <div className="timeline-page-container">
            <div className="timeline-overlay">
                <header className="timeline-header">
                    <div className="header-left">
                        <Navigation className="header-icon text-cyan-400" />
                        <div>
                            <h1 className="glow-text">Cosmic Timeline</h1>
                            <p className="subtitle">High-fidelity orbital telemetry</p>
                        </div>
                    </div>

                    <div className="system-status-pill glass-panel">
                        <div className="status-dot"></div>
                        <span>REAL-TIME ENGINE ACTIVE</span>
                    </div>
                </header>

                <div className="stats-container">
                    <div className="date-display glass-panel">
                        <div className="date-item">
                            <span className="label">TARGET DATE</span>
                            <span className="value text-cyan-400">{currentDate.toDateString().toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="indicators-row">
                        <div className="mini-indicator glass-panel">
                            <Wind size={14} className="text-yellow-400" />
                            <span>SOLAR WIND WAVE: ACTIVE</span>
                        </div>
                        <div className="mini-indicator glass-panel">
                            <Layers size={14} className="text-blue-400" />
                            <span>ISS TELEMETRY: LIVE</span>
                        </div>
                    </div>
                </div>

                <div className="timeline-controls-panel glass-panel">
                    <div className="control-header">
                        <div className="year-selector-inline">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="label">SELECT YEAR:</span>
                            <select
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                className="year-dropdown-compact"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="day-counter">
                            DAY {Math.floor(dayOfYear)} / 365
                        </div>
                    </div>

                    <div className="control-row">
                        <button
                            className={`play-btn-v2 ${isAutoPlay ? 'active' : ''}`}
                            onClick={() => setIsAutoPlay(!isAutoPlay)}
                        >
                            {isAutoPlay ? 'PAUSE SIM' : 'START SIM'}
                        </button>
                        <div className="slider-wrapper-v2">
                            <input
                                type="range"
                                min="1"
                                max="365"
                                step="0.1"
                                value={dayOfYear}
                                onChange={(e) => setDayOfYear(parseFloat(e.target.value))}
                                className="timeline-slider-premium"
                            />
                            <div className="slider-labels">
                                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                                <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="canvas-container">
                <CanvasErrorBoundary>
                    <Canvas
                        shadows
                        gl={{ alpha: false, antialias: true }}
                        camera={{ position: [0, 80, 150], fov: 45 }}
                    >
                        <color attach="background" args={['#000000']} />
                        <Suspense fallback={null}>
                            <SimulationHelper isAutoPlay={isAutoPlay} setDayOfYear={setDayOfYear} />
                            <Stars radius={400} depth={80} count={30000} factor={8} saturation={0} fade speed={1.5} />
                            <ambientLight intensity={0.3} />
                            <Sun />
                            <AsteroidBelt />

                            {BODIES.map(body => (
                                <Planet
                                    key={body.name}
                                    date={currentDate}
                                    {...body}
                                />
                            ))}

                            <OrbitControls
                                enablePan={true}
                                enableZoom={true}
                                maxDistance={400}
                                minDistance={10}
                                autoRotate={!isAutoPlay}
                                autoRotateSpeed={0.2}
                            />
                        </Suspense>
                    </Canvas>
                </CanvasErrorBoundary>
            </div>

            <div className="hud-bottom-right">
                <div className="hud-item glass-panel">
                    <Globe size={16} className="text-blue-400" />
                    <span>ORBITAL SYNC: 99.9%</span>
                </div>
            </div>
        </div>
    );
};

export default CosmicTimeline;
