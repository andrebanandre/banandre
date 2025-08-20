'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

function Banana({ position, rotation, fallSpeed, rotationSpeed }: { 
  position: [number, number, number], 
  rotation: [number, number, number],
  fallSpeed: number,
  rotationSpeed: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y -= fallSpeed;
      meshRef.current.rotation.x += rotationSpeed[0];
      meshRef.current.rotation.y += rotationSpeed[1];
      meshRef.current.rotation.z += rotationSpeed[2];
      
      // Reset position when it falls too low
      if (meshRef.current.position.y < -15) {
        meshRef.current.position.y = 10;
        meshRef.current.position.x = position[0];
        meshRef.current.position.z = position[2];
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      {/* Banana geometry - curved cylinder to look like a banana */}
      <group>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.2, 0.15, 2, 8]} />
          <meshLambertMaterial color="#FFE135" />
        </mesh>
        <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.15, 0.1, 1, 8]} />
          <meshLambertMaterial color="#FFE135" />
        </mesh>
        {/* Brown spots */}
        <mesh position={[0.1, 0.2, 0.21]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-0.1, -0.3, 0.21]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      </group>
    </mesh>
  );
}

function TiredFace({ bobOffset }: { bobOffset: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.5 + bobOffset) * 0.3;
      meshRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, -2, 0]}>
      {/* Face */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshLambertMaterial color="#FFDBAC" />
      </mesh>
      
      {/* Tired eyes */}
      <group position={[0, 0.3, 1.2]}>
        {/* Left eye */}
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
          <meshLambertMaterial color="#000000" />
        </mesh>
        {/* Right eye */}
        <mesh position={[0.4, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
          <meshLambertMaterial color="#000000" />
        </mesh>
      </group>

      {/* Tired mouth */}
      <mesh position={[0, -0.4, 1.2]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.3, 0.05, 8, 16, Math.PI]} />
        <meshLambertMaterial color="#000000" />
      </mesh>

      {/* Eye bags */}
      <mesh position={[-0.4, 0.1, 1.3]}>
        <sphereGeometry args={[0.2, 16, 8, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        <meshLambertMaterial color="#D4B896" />
      </mesh>
      <mesh position={[0.4, 0.1, 1.3]}>
        <sphereGeometry args={[0.2, 16, 8, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        <meshLambertMaterial color="#D4B896" />
      </mesh>
    </group>
  );
}

function AnimatedText() {
  const [visibleChars, setVisibleChars] = useState(0);
  const fullText = "NO ONE CARES ABOUT CODE";
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleChars(prev => {
        if (prev < fullText.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 150); // Slow typing effect

    return () => clearInterval(timer);
  }, []);

  const displayText = fullText.slice(0, visibleChars);

  return (
    <Text
      position={[0, -5, 0]}
      fontSize={0.8}
      color="#9CA3AF"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.1}
      lineHeight={1}
    >
      {displayText}
    </Text>
  );
}

function Scene() {
  const sceneData = useMemo(() => {
    const count = 15;
    const bananas = Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (i * 2.7 - 20),
        i * 2 + 5,
        (i % 3 - 1) * 5,
      ] as [number, number, number],
      rotation: [
        i * 0.5,
        i * 0.3,
        i * 0.7,
      ] as [number, number, number],
      fallSpeed: 0.02 + (i % 3) * 0.01,
      rotationSpeed: [
        (i % 2 - 0.5) * 0.1,
        (i % 3 - 1) * 0.05,
        (i % 4 - 1.5) * 0.08,
      ] as [number, number, number],
    }));
    const bobOffset = Math.PI * 0.33;
    return { bananas, bobOffset };
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />

      {/* Title */}
      <Text
        position={[0, 2, 0]}
        fontSize={2.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
        lineHeight={1}
      >
        BANANDRE
      </Text>

      {/* Tired Face */}
      <TiredFace bobOffset={sceneData.bobOffset} />

      {/* Animated subtitle */}
      <AnimatedText />

      {/* Falling Bananas */}
      {sceneData.bananas.map((banana) => (
        <Banana
          key={banana.id}
          position={banana.position}
          rotation={banana.rotation}
          fallSpeed={banana.fallSpeed}
          rotationSpeed={banana.rotationSpeed}
        />
      ))}
    </>
  );
}

export function ThreeTitle() {
  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{
          position: [0, 0, 15],
          fov: 50,
        }}
        className="w-full h-full"
      >
        <Scene />
      </Canvas>
    </div>
  );
}