import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

import EarthAssembly from './EarthAssembly';
import { StarMaterial } from './StarShader';

// --- Sub-components for Planet and Star ---

const PlanetSphere = ({ textureUrl, size, hasRings }) => {
    const mesh = useRef();
    const texture = useTexture(textureUrl);

    useFrame((state, delta) => {
        if (mesh.current) mesh.current.rotation.y += delta * 0.05;
    });

    return (
        <group>
            <mesh ref={mesh}>
                <sphereGeometry args={[size, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    color={0xffffff}
                    roughness={0.7}
                    metalness={0.2}
                />
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

// Photorealistic Star (Uses sun.jpg texture tinted to color)
const RealStar = ({ color, size, textureUrl }) => {
    // Default to using the sun texture for realism if no specific star texture provided
    const displayTextureUrl = textureUrl || "/textures/sun.jpg";
    const texture = useTexture(displayTextureUrl);
    const mesh = useRef();

    useFrame((state, delta) => {
        if (mesh.current) mesh.current.rotation.y -= delta * 0.02;
    });

    // Create a color object to manipulate
    const starColor = new THREE.Color(color);

    return (
        <group>
            <mesh ref={mesh}>
                <sphereGeometry args={[size, 64, 64]} />
                {/* 
                   Using StandardMaterial for reaction to light + Emissive for glow.
                   We tint the map with 'color'.
                   We set emissive to the star color to make it glow.
                   toneMapped=false ensures it stays bright/HDR for the Bloom effect.
                */}
                <meshStandardMaterial
                    map={texture}
                    color={starColor}
                    emissive={starColor}
                    emissiveMap={texture}
                    emissiveIntensity={2.0} // High intensity for bloom
                    toneMapped={false}
                />
            </mesh>
            {/* Inner Corona (Subtle) */}
            <mesh scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.BackSide} toneMapped={false} />
            </mesh>
            {/* Outer Corona (larger) */}
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.BackSide} toneMapped={false} />
            </mesh>
            <pointLight distance={100} intensity={2} color={color} decay={2} />
        </group>
    );
};

// --- Model Content Selector ---

const ModelContent = ({ type, color, size, textureUrl }) => {
    // 1. Earth Assembly (Special Case)
    if (textureUrl && textureUrl.includes("earth.jpg")) {
        return <EarthAssembly size={size} />;
    }

    // 2. Planets
    if (type === 'planet') {
        // Special Handling for The Sun if categorized as "planet" (it has "sun.jpg")
        if (textureUrl && textureUrl.includes("sun.jpg")) {
            return <RealStar color={color} size={size} textureUrl={textureUrl} />;
        }

        // Regular Planets
        if (textureUrl) {
            const isSaturn = textureUrl.includes("saturn.jpg");
            return <PlanetSphere textureUrl={textureUrl} size={size} hasRings={isSaturn} />;
        }
    }

    // 3. Stars (Categorized as 'star')
    // We force use of RealStar with the sun texture (handled inside RealStar default)
    return <RealStar color={color} size={size} textureUrl={textureUrl} />;
};

// --- Main InteractiveModel Component ---

const InteractiveModel = ({ type, color, size = 2, textureUrl }) => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }} gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
                {/* High ambient light to ensure textures are visible even if emissive overwrites */}
                <ambientLight intensity={0.6} />
                <pointLight position={[20, 10, 10]} intensity={2.5} color="#fff" />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#454555" />

                <Suspense fallback={
                    <mesh>
                        <sphereGeometry args={[size, 16, 16]} />
                        <meshBasicMaterial color={color || 'white'} wireframe />
                    </mesh>
                }>
                    <ModelContent type={type} color={color} size={size} textureUrl={textureUrl} />
                </Suspense>

                {/* Post-Processing for Realism */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.5}
                        luminanceSmoothing={0.9}
                        height={300}
                        intensity={2.0} // Intense glow for stars
                    />
                </EffectComposer>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
};

export default InteractiveModel;
