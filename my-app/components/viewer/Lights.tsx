interface LightsProps {
  intensity?: number;
}

export default function Lights({ intensity = 1 }: LightsProps) {
  return (
    <>
      <ambientLight intensity={0.3 * intensity} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={0.7 * intensity}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}