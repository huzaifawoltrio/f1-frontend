import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Data for major cities to create dot clusters
const majorCities = [
  // North America
  { lat: 40.71, lon: -74.0 }, { lat: 34.05, lon: -118.24 }, { lat: 49.28, lon: -123.12 },
  { lat: 19.43, lon: -99.13 }, { lat: 41.87, lon: -87.62 }, { lat: 29.76, lon: -95.36 },
  // South America
  { lat: -23.55, lon: -46.63 }, { lat: -34.6, lon: -58.38 }, { lat: -12.04, lon: -77.04 },
  { lat: 4.71, lon: -74.07 },
  // Europe
  { lat: 51.5, lon: -0.12 }, { lat: 48.85, lon: 2.35 }, { lat: 52.52, lon: 13.4 },
  { lat: 41.9, lon: 12.49 }, { lat: 55.75, lon: 37.61 }, { lat: 40.41, lon: -3.7 },
  // Africa
  { lat: 30.04, lon: 31.23 }, { lat: 6.52, lon: 3.37 }, { lat: -26.2, lon: 28.04 },
  { lat: -1.29, lon: 36.82 },
  // Asia
  { lat: 35.68, lon: 139.69 }, { lat: 39.9, lon: 116.4 }, { lat: 28.61, lon: 77.2 },
  { lat: 1.35, lon: 103.81 }, { lat: 31.23, lon: 121.47 }, { lat: 22.31, lon: 114.16 },
  { lat: 37.56, lon: 126.97 }, { lat: 19.07, lon: 72.87 },
  // Oceania
  { lat: -33.86, lon: 151.2 }, { lat: -37.81, lon: 144.96 },
];


// This component creates the solid globe with dots
const EarthGlobe = () => {
  const groupRef = useRef();
  const radius = 2.8;

  // Generate dot clusters based on major city locations
  const particles = useMemo(() => {
    const pointsData = [];
    majorCities.forEach(city => {
      // Add the main city point
      pointsData.push(city);
      // Add more points around the city to create a populated area cluster
      for (let i = 0; i < 20; i++) {
        pointsData.push({
          lat: city.lat + (Math.random() - 0.5) * 10,
          lon: city.lon + (Math.random() - 0.5) * 10,
        });
      }
    });

    const p = new Float32Array(pointsData.length * 3);
    pointsData.forEach((point, i) => {
      const i3 = i * 3;
      const latRad = point.lat * (Math.PI / 180);
      const lonRad = point.lon * (Math.PI / 180);

      // Convert latitude and longitude to 3D coordinates
      p[i3] = radius * Math.cos(latRad) * Math.cos(lonRad);
      p[i3 + 1] = radius * Math.sin(latRad);
      p[i3 + 2] = -radius * Math.cos(latRad) * Math.sin(lonRad);
    });
    return p;
  }, [radius]);

  useFrame((state, delta) => {
    // Animate the rotation of the entire group (globe + dots)
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const mapTexture = useTexture('/world-textures.png');
  mapTexture.minFilter = THREE.NearestFilter;
  mapTexture.magFilter = THREE.NearestFilter;
  return (
    <group ref={groupRef}>
      {/* The solid, dark sphere */}
          <mesh>
      <sphereGeometry args={[radius * 0.99, 64, 64]} />
      <meshStandardMaterial
        color="#181f2e" // Base color for the oceans
        roughness={0.5}
        metalness={0.5}
        
        // --- Key properties for the dotted effect ---
        emissiveMap={mapTexture}      // The texture makes parts of the globe glow
        emissive="white"              // The color of the glow (the dots)
        emissiveIntensity={2}       // The brightness of the glow
      />
    </mesh>


      {/* The points on the surface */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#ffffff"
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

// This component creates the orbiting elements
const OrbitingElements = () => {
  const groupRef = useRef();
  const point1Ref = useRef();
  const point2Ref = useRef();
  const point3Ref = useRef();

  const orbitRadius = 3.5;

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // Animate the rotation of the entire orbiting group
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsedTime * 0.05;
    }

    // Animate points along the orbit
    const angle1 = elapsedTime * 0.5;
    if (point1Ref.current) {
      point1Ref.current.position.x = orbitRadius * Math.cos(angle1);
      point1Ref.current.position.z = orbitRadius * Math.sin(angle1);
    }

    const angle2 = elapsedTime * 0.5 + Math.PI * (2 / 3);
    if (point2Ref.current) {
      point2Ref.current.position.x = orbitRadius * Math.cos(angle2);
      point2Ref.current.position.z = orbitRadius * Math.sin(angle2);
    }

    const angle3 = elapsedTime * 0.5 + Math.PI * (4 / 3);
    if (point3Ref.current) {
      point3Ref.current.position.x = orbitRadius * Math.cos(angle3);
      point3Ref.current.position.z = orbitRadius * Math.sin(angle3);
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0,- Math.PI/4]} >
      {/* The Orbit Ring - rotated to be in the correct plane */}
      <Torus rotation={[Math.PI / 2, 0, 0]} args={[orbitRadius, 0.01, 16, 100]} material-color="#555" />

      {/* The moving points on the orbit */}
      <mesh ref={point1Ref}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
      <mesh ref={point2Ref}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
      <mesh ref={point3Ref}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};


// The main App component that brings everything together
export default function Globe() {
  return (
    <div className="">
      <div className="w-[600px] h-[600px]">
        <Canvas
          style={{ background: 'transparent' }}
          gl={{ alpha: true }} camera={{ position: [0, 0, 8], fov: 50 }}>
          {/* Make the canvas background transparent */}
          {/* <color attach="background" args={['#000000']} alpha={0} /> */}
          <ambientLight intensity={1} />
          <pointLight color={"white"} position={[10, 10, 10]} intensity={1} />
          <EarthGlobe />
          <OrbitingElements />
          {/* You can enable OrbitControls to interact with the globe */}
          {/* <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} /> */}
        </Canvas>
      </div>
    </div>
  );
}

