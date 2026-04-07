"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { UserRole } from "@/lib/auth";

type LoginBrainSceneProps = {
  selectedRole: UserRole;
};

const roleColors: Record<UserRole, string> = {
  admin: "#6ee7ff",
  teacher: "#c4b5fd",
  parent: "#f9a8d4",
};

function seeded(index: number) {
  return Math.sin(index * 983.123) * 0.5 + 0.5;
}

function makeNodes(offsetX: number, count: number, seedOffset: number) {
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < count; i += 1) {
    const r1 = seeded(i + seedOffset * 0.11);
    const r2 = seeded(i + seedOffset * 0.31 + 10);
    const r3 = seeded(i + seedOffset * 0.47 + 21);
    const y = (r1 - 0.5) * 2.2;
    const z = (r2 - 0.5) * 1.8;
    const x = offsetX + (r3 - 0.5) * 0.75;
    nodes.push(new THREE.Vector3(x, y, z));
  }
  return nodes;
}

function BrainSceneContent({ selectedRole }: LoginBrainSceneProps) {
  const brainRef = useRef<THREE.Group>(null);
  const pulseRefs = useRef<Array<THREE.Mesh | null>>([]);

  const leftNodes = useMemo(() => makeNodes(-0.62, 20, 1), []);
  const rightNodes = useMemo(() => makeNodes(0.62, 20, 2), []);

  const connections = useMemo(() => {
    const lines: Array<{ start: THREE.Vector3; end: THREE.Vector3; role: UserRole }> = [];
    const roles: UserRole[] = ["admin", "teacher", "parent"];

    for (let i = 0; i < 20; i += 1) {
      const role = roles[i % roles.length];
      const start = leftNodes[i];
      const end = rightNodes[(i * 7) % rightNodes.length];
      lines.push({ start, end, role });
    }

    return lines;
  }, [leftNodes, rightNodes]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (brainRef.current) {
      brainRef.current.rotation.y += delta * 0.2;
      brainRef.current.rotation.x = Math.sin(t * 0.42) * 0.03;
      const pulse = 1 + Math.sin(t * 2.4) * 0.02;
      brainRef.current.scale.setScalar(pulse);
    }

    connections.forEach((line, index) => {
      const node = pulseRefs.current[index];
      if (!node) return;

      const travel = (t * (0.2 + (index % 5) * 0.04) + index * 0.173) % 1;
      node.position.copy(line.start).lerp(line.end, travel);
      node.scale.setScalar(selectedRole === line.role ? 1.1 : 0.7);
    });
  });

  return (
    <group>
      <ambientLight intensity={0.55} />
      <pointLight position={[3.2, 1.4, 4]} intensity={22} color="#6ee7ff" />
      <pointLight position={[-2.5, -1, 1]} intensity={14} color="#f9a8d4" />

      <group ref={brainRef}>
        <mesh position={[-0.58, 0, 0]}>
          <sphereGeometry args={[1.1, 42, 42]} />
          <meshPhysicalMaterial
            color="#dbeafe"
            metalness={0.14}
            roughness={0.2}
            transparent
            opacity={0.52}
            transmission={0.86}
            thickness={1.2}
            emissive="#6ee7ff"
            emissiveIntensity={0.2}
          />
        </mesh>

        <mesh position={[0.58, 0, 0]}>
          <sphereGeometry args={[1.1, 42, 42]} />
          <meshPhysicalMaterial
            color="#ede9fe"
            metalness={0.14}
            roughness={0.2}
            transparent
            opacity={0.52}
            transmission={0.86}
            thickness={1.2}
            emissive="#c4b5fd"
            emissiveIntensity={0.24}
          />
        </mesh>

        <mesh position={[0, 1.42, 0]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[2.35, 0.08, 2.35]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.25} />
        </mesh>

        <mesh position={[0.03, 1.18, 0]}>
          <cylinderGeometry args={[0.42, 0.55, 0.38, 24]} />
          <meshStandardMaterial color="#64748b" metalness={0.56} roughness={0.32} />
        </mesh>

        <Line
          points={[
            new THREE.Vector3(-0.98, 1.4, 0.72),
            new THREE.Vector3(-1.02, 0.92, 0.62),
            new THREE.Vector3(-1.0, 0.45, 0.48),
          ]}
          color="#cbd5e1"
          lineWidth={1.1}
        />
        <mesh position={[-1.02, 0.36, 0.48]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#cbd5e1" />
        </mesh>

        {connections.map((item, index) => {
          const active = selectedRole === item.role;
          return (
            <group key={`line-${index}`}>
              <Line
                points={[item.start, item.end]}
                color={active ? roleColors[item.role] : "#6b7280"}
                lineWidth={active ? 1.5 : 0.55}
                transparent
                opacity={active ? 0.95 : 0.24}
              />
              <mesh ref={(node) => {
                pulseRefs.current[index] = node;
              }}>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshBasicMaterial color={active ? roleColors[item.role] : "#64748b"} />
              </mesh>
            </group>
          );
        })}
      </group>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.22} />
    </group>
  );
}

export function LoginBrainScene({ selectedRole }: LoginBrainSceneProps) {
  return (
    <div className="h-[300px] w-full md:h-[370px] lg:h-[430px] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4.9], fov: 42 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <BrainSceneContent selectedRole={selectedRole} />
      </Canvas>
    </div>
  );
}
