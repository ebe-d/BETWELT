import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const RotatingEarth = () => {
  const earthRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [bounce, setBounce] = useState(0); // Bounce effect

  useFrame(() => {
    // Rotate the Earth
    earthRef.current.rotation.y += 0.01;

    // Smooth bounce effect on hover
    if (hovered) {
      setBounce((prev) => Math.sin(Date.now() * 0.005) * 0.2); // Small up/down motion
    } else {
      setBounce(0); // Reset position
    }

    // Apply the bounce effect
    earthRef.current.position.y = bounce;
  });

  return (
    <mesh
      ref={earthRef}
      rotation={[0.4, 0.2, 0]} // Initial tilt
      position={[0, 0, 0]} // Keep it in one place
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="red" wireframe />
    </mesh>
  );
};

const WorldGrid = () => {
    return (
        <div style={{ marginLeft: "20vw",paddingTop:'400px', height: "10px", width: "80vw", display: "flex", alignItems: "center" }}>
        <Canvas
          camera={{ position: [0, 0, 8] }}
          style={{ width: "500px", height: "1000px" }}
          gl={{ alpha: true }}
        >
          <RotatingEarth />
          <ambientLight intensity={0.5} />
        </Canvas>
      </div>
      
    );
  };

export default WorldGrid;
