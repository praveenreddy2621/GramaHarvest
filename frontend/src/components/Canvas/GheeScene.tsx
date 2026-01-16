"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Image as DreiImage } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function FloatingJar() {
    const ref = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (ref.current) {
            // Subtle parallax follow mouse
            const { x, y } = state.pointer;
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.2, 0.1);
            ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.2, 0.1);
        }
    });

    return (
        <group ref={ref}
            onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
            <DreiImage
                url="/images/branded-ghee-jar-final.jpg"
                scale={hovered ? 3.2 : 3}
                transparent
                position={[0, 0.5, 0]}
            />
        </group>
    );
}

export default function GheeScene() {
    return (
        <div className="h-[500px] w-full bg-nature-cream/50 relative rounded-xl overflow-hidden cursor-move">
            <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-nature-earth">Interactive View</p>
            </div>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <FloatingJar />
                </Float>

                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#8C6A4B" />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
