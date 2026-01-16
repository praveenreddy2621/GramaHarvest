"use client";
import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';
import { Image as DreiImage, useCursor } from '@react-three/drei';

// --- Falling Chilli Component ---
export function RealChilli({
    position,
    rotation,
    scale,
    speed,
    index,
}: { position: [number, number, number], rotation: [number, number, number], scale: number, speed: number, index: number }) {
    const group = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Initial Y position to reset to
    const initialY = 10;
    const resetY = -10;

    useFrame((state, delta) => {
        if (!group.current) return;

        // Falling Motion
        group.current.position.y -= speed * delta * 2;

        // Rotation while falling
        group.current.rotation.z += speed * delta * 0.5;
        group.current.rotation.x += speed * delta * 0.2;

        // Reset if below screen
        if (group.current.position.y < resetY) {
            group.current.position.y = initialY + Math.random() * 5;
            group.current.position.x = (Math.random() - 0.5) * 15;
            group.current.rotation.z = Math.random() * Math.PI;
        }

        // Hover Effect
        const targetScale = hovered ? scale * 1.5 : scale;
        group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
    });

    return (
        <group
            ref={group}
            position={position}
            rotation={rotation}
            scale={scale}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <DreiImage
                url="/images/red-chilli.png"
                scale={[2, 2]} // Slightly smaller for better density
                transparent
                opacity={0.9}
            />
        </group>
    );
}

// --- Main Composition (Raining Chillies) ---
export function ChillisComposition() {
    const count = 25;

    const chillis = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 20, // Wider spread
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 5
            ] as [number, number, number],
            rotation: [0, 0, Math.random() * Math.PI] as [number, number, number],
            scale: 0.5 + Math.random() * 0.5,
            speed: 0.5 + Math.random() * 1.5 // Random fall speeds
        }));
    }, []);

    return (
        <group>
            {/* Add a transparent plane to catch mouse events easier? No, DreiImage handles it. */}
            {chillis.map((props, i) => (
                <RealChilli key={i} index={i} {...props} />
            ))}
        </group>
    );
}

// --- Canvas Wrapper ---
export function ChilliCanvas() {
    return (
        <div className="w-full h-full min-h-[500px]">
            {/* Use a wider, taller view to allow generous falling */}
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={1.2} />
                <ChillisComposition />
            </Canvas>
        </div>
    );
}

export default ChillisComposition;
