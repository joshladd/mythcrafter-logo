import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, DoubleSide, MeshStandardMaterial } from "three";
import { Text } from "@react-three/drei";

// Define the props that RotatingImage will receive
interface RotatingImageProps {
  textureUrl: string;
  pixelRatio: number;
}

const RotatingImage: React.FC<RotatingImageProps> = ({ textureUrl, pixelRatio }) => {
  const ref = useRef<any>();
  const texture = useLoader(TextureLoader, textureUrl);

  const rotationSpeedX = 0;
  const rotationSpeedY = 0;
  const rotationSpeedZ = -0.02;
  const initialRotationX = Math.PI / 2;
  const initialRotationY = 0;
  const initialRotationZ = 0;

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
    gl.setPixelRatio(pixelRatio); // Adjust canvas resolution dynamically
    gl.domElement.style.imageRendering = pixelRatio > 1 ? "auto" : "pixelated"; // Apply pixelation effect
  });

  return (
    <mesh
      ref={ref}
      rotation={[initialRotationX, initialRotationY, initialRotationZ]}
      position={[0, 0, -0.75]}
    >
      <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
      <meshBasicMaterial map={texture} side={DoubleSide} transparent={true} />
    </mesh>
  );
};

const App: React.FC = () => {
  const pixelRatio = 1;
  // Slider handler for changing the pixel ratio


  const textMaterial = new MeshStandardMaterial({
    color: "#fc712b", // Vibrant burnt orange
    roughness: 50, // Controls how rough the material is (lower = shinier)
    metalness: -15, // Adds a bit of metallic effect for realism
  });

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-40 bg-gray-900">
      {/* Slider for controlling pixel ratio */}
      

      <Canvas
      className="w-full h-2/3"
      style={{ imageRendering: 'pixelated' }} // Ensures the pixelated effect in CSS
      gl={{
        preserveDrawingBuffer: true,
        antialias: false, // Disable anti-aliasing for sharper edges
        pixelRatio: pixelRatio, // Set the pixel ratio dynamically
      }}
      camera={{ position: [0, 0, 5], zoom: 1, fov: 50 }} // Disable zoom and rotation by fixing the camera
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Rotating image */}
      <RotatingImage textureUrl="mythcrafter.png" pixelRatio={pixelRatio} />

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
    </Canvas>
    </div>
  );
};

export default App;
