"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';

// Uses real product images as floating billboards
export function HeroProductScene({ scale = 1, ...props }: any) {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;

        // Gentle global rotation
        group.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    });

    return (
        <group ref={group} {...props}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>

                {/* CENTER: Rice Bag (Largest) */}
                <group position={[0, -0.5, 0]}>
                    <DreiImage url="/images/rice-bag.png" scale={[5, 6]} transparent />
                </group>

                {/* LEFT: Ghee Jar */}
                <group position={[-3.5, 0, 1]}>
                    <Float speed={3} rotationIntensity={0.4} floatIntensity={1}>
                        <DreiImage url="/images/branded-ghee-jar-final.jpg" scale={[2.5, 3]} transparent />
                    </Float>
                </group>

                {/* RIGHT: Chilli Bunch */}
                <group position={[3.5, 0.5, 1]}>
                    <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.8}>
                        <DreiImage url="/images/red-chilli.png" scale={[2.5, 2.5]} transparent grayscale={0} />
                    </Float>
                </group>

                {/* BACKGROUND ELEMENT: Mango (Subtle) */}
                <group position={[1.5, 2, -1]} rotation={[0, 0, 0.2]}>
                    <Float speed={1.5}>
                        <DreiImage url="/images/banginapalli-mango.png" scale={[2, 2]} transparent opacity={0.8} />
                    </Float>
                </group>

                <group position={[-2, 2.5, -2]} rotation={[0, 0, -0.2]}>
                    <Float speed={1.8}>
                        <DreiImage url="/images/turmeric.png" scale={[1.5, 1.5]} transparent opacity={0.8} />
                    </Float>
                </group>

            </Float>
        </group>
    );
}

export default function RiceBowlScene() {
    return (
        <>
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
            {/* Warm Gold Light from bottom for "Sunset/Earth" feel */}
            <pointLight position={[0, -5, 5]} intensity={0.8} color="#F2C94C" />

            <HeroProductScene scale={1} />
        </>
    );
}
