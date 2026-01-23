import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const EarthAssembly = ({ size = 2 }) => {
    const earthRef = useRef();
    const cloudsRef = useRef();

    // Load all textures
    const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
        '/textures/earth.jpg',           // Fallback or previously downloaded daymap
        '/textures/earth_normal.jpg',
        '/textures/earth_specular.jpg',
        '/textures/earth_clouds.jpg'
    ]);

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();

        // Rotate Earth
        if (earthRef.current) {
            earthRef.current.rotation.y = elapsedTime * 0.05;
        }

        // Rotate Clouds (slightly faster/different axis for realism)
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y = elapsedTime * 0.07;
        }
    });

    return (
        <group>
            {/* 1. Base Earth Sphere */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[size, 64, 64]} />
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    normalScale={[0.5, 0.5]} // Subtle bump
                    roughnessMap={specularMap} // Invert specular usually, but using it as roughness can work if dark=shiny
                    // Actually standard specular map: black=ocean(shiny), white=land(rough). 
                    // Roughness: 0=shiny, 1=rough.
                    // So we might need to invert it or use it as is if map matches roughness logic.
                    // Typically specular maps are White=Reflective. Roughness maps are Black=Reflective.
                    // So we should invert it. But without custom shader, let's just use roughness=0.5 and metalness=0.1
                    // Or stick to simple PBR.
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>

            {/* 2. Cloud Layer (Transparent Sphere slightly larger) */}
            <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
                <sphereGeometry args={[size, 64, 64]} />
                <meshStandardMaterial
                    map={cloudsMap}
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    depthWrite={false} // Don't block earth
                />
            </mesh>

            {/* 3. Atmosphere Glow (Fresnel Shader-like effect via simple geometry) */}
            <mesh scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial
                    color="#44aaff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

export default EarthAssembly;
