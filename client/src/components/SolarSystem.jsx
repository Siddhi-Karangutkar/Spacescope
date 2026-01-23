import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Texture URLs - Using highly reliable Wikimedia/NASA sources
// Removed Sun texture URL to use procedural generation
const TEXTURES = {
    mercury: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Mercury_in_color_-_Prockter07_centered.jpg',
    venus: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
    earth: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Earth_as_seen_from_space_and_out_of_space.jpg',
    mars: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
    jupiter: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
    saturn: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
    // Saturn Rings: Official Three.js example texture
    saturnRing: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/saturn_ring.png',
    uranus: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
    neptune: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg'
};

// Procedural texture generator for Sun
const createSunTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base fiery background
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#ffffff');      // Core white heat
    gradient.addColorStop(0.1, '#fff6e5');    // Very bright yellow
    gradient.addColorStop(0.2, '#ffdd00');    // Yellow
    gradient.addColorStop(0.4, '#ff8800');    // Orange
    gradient.addColorStop(0.8, '#cc4400');    // Dark orange
    gradient.addColorStop(1, '#880000');      // Red edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add noise/texture
    for (let i = 0; i < 6000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.random() * 3 + 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Add darker spots (sunspots)
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.random() * 15 + 5;
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

const Planet = ({ position, size, textureUrl, speed, orbitRadius, hasRings }) => {
    const meshRef = useRef();

    // Load texture
    const texture = useLoader(THREE.TextureLoader, textureUrl);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed;
        const x = Math.cos(t) * orbitRadius;
        const z = Math.sin(t) * orbitRadius;
        meshRef.current.position.set(x, 0, z);
        meshRef.current.rotation.y += 0.005;
    });

    return (
        <group>
            {/* Visible Orbit Path */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
                <meshBasicMaterial color="#5599ff" opacity={0.35} transparent side={THREE.DoubleSide} />
            </mesh>

            <mesh ref={meshRef} position={position}>
                <sphereGeometry args={[size, 64, 64]} />
                <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />

                {hasRings && (
                    <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
                        <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
                        <meshStandardMaterial
                            color="#d4cda5"
                            side={THREE.DoubleSide}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                )}
            </mesh>
        </group>
    );
};

const EarthWithSatellite = ({ speed, orbitRadius }) => {
    const groupRef = useRef();
    const earthRef = useRef();
    const satRef = useRef();

    const earthTexture = useLoader(THREE.TextureLoader, 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg');

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed;
        const x = Math.cos(t) * orbitRadius;
        const z = Math.sin(t) * orbitRadius;

        groupRef.current.position.set(x, 0, z);
        earthRef.current.rotation.y += 0.01;

        // Satellite
        const satT = clock.getElapsedTime() * 2;
        const satX = Math.cos(satT) * 1.5;
        const satZ = Math.sin(satT) * 1.5;
        satRef.current.position.set(satX, 0.5, satZ);
        satRef.current.lookAt(0, 0, 0);
    });

    return (
        <group>
            {/* Orbit Path */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
                <meshBasicMaterial color="#5599ff" opacity={0.35} transparent side={THREE.DoubleSide} />
            </mesh>

            <group ref={groupRef}>
                {/* Earth */}
                <mesh ref={earthRef}>
                    <sphereGeometry args={[0.7, 64, 64]} />
                    <meshStandardMaterial map={earthTexture} roughness={0.2} metalness={0.1} />
                </mesh>

                {/* Satellite (Spacescope) */}
                <mesh ref={satRef}>
                    <boxGeometry args={[0.05, 0.05, 0.1]} />
                    <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
                    <mesh position={[0.1, 0, 0]}>
                        <boxGeometry args={[0.15, 0.01, 0.05]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                    <mesh position={[-0.1, 0, 0]}>
                        <boxGeometry args={[0.15, 0.01, 0.05]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                </mesh>
            </group>
        </group>
    );
};

const AsteroidBelt = () => {
    const asteroidCount = 800;
    const asteroids = useMemo(() => {
        return new Array(asteroidCount).fill(0).map(() => ({
            angle: Math.random() * Math.PI * 2,
            radius: 12 + Math.random() * 3,
            y: (Math.random() - 0.5) * 2,
            size: 0.03 + Math.random() * 0.05,
            speed: 0.01 + Math.random() * 0.03,
            randomOffset: Math.random() * 100
        }));
    }, []);

    return (
        <group>
            {asteroids.map((ast, i) => (
                <Asteroid key={i} {...ast} />
            ))}
        </group>
    )
}

const Asteroid = ({ angle, radius, y, size, speed, randomOffset }) => {
    const ref = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed + randomOffset;
        const x = Math.cos(t + angle) * radius;
        const z = Math.sin(t + angle) * radius;
        ref.current.position.set(x, y, z);
        ref.current.rotation.x += 0.02;
        ref.current.rotation.y += 0.02;
    });

    return (
        <mesh ref={ref}>
            <dodecahedronGeometry args={[size, 0]} />
            <meshStandardMaterial color="#888" roughness={0.6} />
        </mesh>
    )
}

const Sun = () => {
    // Generate texture once using useMemo so it doesn't regenerate on every render
    const sunTexture = useMemo(() => createSunTexture(), []);

    return (
        <group>
            <mesh>
                <sphereGeometry args={[3.2, 64, 64]} />
                {/* Unlit material - guarantees no shadows */}
                <meshBasicMaterial
                    map={sunTexture}
                    color="#ffffff"
                    toneMapped={false}
                />
            </mesh>
            {/* Light Source */}
            <pointLight position={[0, 0, 0]} distance={400} intensity={4} color="#ffffff" decay={1.5} />
        </group>
    );
};

const SolarSystem = () => {
    return (
        <Canvas camera={{ position: [0, 45, 30], fov: 45 }} gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }} dpr={[1, 2]}>
            <ambientLight intensity={0.25} />
            <Stars radius={300} depth={60} count={30000} factor={8} saturation={0} fade speed={0.5} />

            <React.Suspense fallback={null}>
                <Sun />

                <Planet position={[4, 0, 0]} size={0.3} textureUrl={TEXTURES.mercury} speed={0.8} orbitRadius={5} />
                <Planet position={[6, 0, 0]} size={0.6} textureUrl={TEXTURES.venus} speed={0.6} orbitRadius={7} />

                <EarthWithSatellite speed={0.5} orbitRadius={10} />

                <Planet position={[10, 0, 0]} size={0.4} textureUrl={TEXTURES.mars} speed={0.4} orbitRadius={13} />

                <AsteroidBelt />

                <Planet position={[14, 0, 0]} size={1.5} textureUrl={TEXTURES.jupiter} speed={0.2} orbitRadius={19} />
                <Planet position={[18, 0, 0]} size={1.3} textureUrl={TEXTURES.saturn} speed={0.12} orbitRadius={24} hasRings={true} />
                <Planet position={[22, 0, 0]} size={1.0} textureUrl={TEXTURES.uranus} speed={0.08} orbitRadius={29} />
                <Planet position={[26, 0, 0]} size={1.0} textureUrl={TEXTURES.neptune} speed={0.06} orbitRadius={33} />

            </React.Suspense>

            <EffectComposer>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            </EffectComposer>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.3}
                maxPolarAngle={Math.PI / 2.2}
            />
        </Canvas>
    );
};

export default SolarSystem;
