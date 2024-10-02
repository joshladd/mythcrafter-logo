import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, DoubleSide, MeshStandardMaterial } from "three";
import { OrbitControls, Text } from "@react-three/drei";

// Define the props that RotatingImage will receive
interface RotatingImageProps {
  textureUrl: string;
}

const RotatingImage: React.FC<RotatingImageProps> = ({ textureUrl }) => {
  const ref = useRef<any>();
  const texture = useLoader(TextureLoader, textureUrl); // Replace with the correct path to your image

  const [rotationSpeedX, setRotationSpeedX] = useState(0);
  const [rotationSpeedY, setRotationSpeedY] = useState(0);
  const [rotationSpeedZ, setRotationSpeedZ] = useState(-0.01);
  const [initialRotationX, setInitialRotationX] = useState(Math.PI / 2);
  const [initialRotationY, setInitialRotationY] = useState(0);
  const [initialRotationZ, setInitialRotationZ] = useState(0);
  const [pixelRatio, setPixelRatio] = useState(1); // State to control canvas resolution (pixelation)

  useEffect(() => {
    if (texture) {
      texture.rotation = Math.PI / 2;
      texture.center.set(0.5, 0.5); // Rotate around the center of the texture
    }
  }, [texture]);

  // Rotate the coin according to the slider values
  useFrame(({ gl }) => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeedX;
      ref.current.rotation.y += rotationSpeedY;
      ref.current.rotation.z += rotationSpeedZ;
    }
    gl.setPixelRatio(pixelRatio); // Set pixel ratio for resolution control
  });

  return (
    <mesh
      ref={ref}
      rotation={[initialRotationX, initialRotationY, initialRotationZ]}
      position={[-0.006125, 0, -0.5]}
    >
      <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
      <meshBasicMaterial map={texture} side={DoubleSide} transparent={true} />
    </mesh>
  );
};

const App: React.FC = () => {

  // useEffect(() => {
  //   const link = document.createElement("link");
  //   link.href = "https://fonts.googleapis.com/css2?family=Almendra+SC&display=swap";
  //   link.rel = "stylesheet";
  //   document.head.appendChild(link);
  // }, []);

  const textMaterial = new MeshStandardMaterial({
    color: "#fc712b", // Vibrant burnt orange
    roughness: 50, // Controls how rough the material is (lower = shinier)
    metalness: -60, // Adds a bit of metallic effect for realism
  });

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-900">
      <Canvas className="w-full h-2/3">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Rotating image */}
        <RotatingImage textureUrl="mythcrafter.png" />

        {/* Top Text - "mythcrafter" */}
        <Text
      position={[0, 2, 0]} // Adjust the Y position to place it above the rotating image
      fontSize={0.7}
      letterSpacing={0.05}
      anchorX="center"
      anchorY="middle"
      material={textMaterial} // Passing the material here
      outlineColor="black"
      outlineWidth={0.02}
      font="vinque rg.otf" // Ensure the correct path for the font
    >
      Mythcrafter
    </Text>
        {/* Bottom Text - "studio" */}
        <Text
          position={[0, -2, 0]} // Adjust the Y position to place it below the rotating image
          fontSize={0.7}
      letterSpacing={0.05}
      anchorX="center"
      anchorY="middle"
      material={textMaterial} // Passing the material here
      outlineColor="black"
      outlineWidth={0.02}
      font="vinque rg.otf"
        >
          Studio
        </Text>

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default App;
