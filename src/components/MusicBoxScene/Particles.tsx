import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import pointsVertexShader from "./shaders/particles/vertex";
import pointsFragmentShader from "./shaders/particles/fragment";

import { useTexture } from "@react-three/drei";
import { Easing, Tween } from "@tweenjs/tween.js";

const count = 100;
const radius = 0.5;

function initData(count: number, radius: number) {
  const positionsArray = new Float32Array(count * 3);
  const colorsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  const timeMultiplierArray = new Float32Array(count);

  for (let i = 0; i < count * 3; i++) {
    const i3 = i * 3;
    // Spherical destribution for sphere with radius thinkness 0.6-1.0
    const spherical = new THREE.Spherical(
      radius * (0.6 + 0.4 * Math.random()),
      Math.random() * Math.PI,
      Math.random() * 2 * Math.PI
    );
    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    positionsArray[i3] = position.x;
    positionsArray[i3 + 1] = position.y;
    positionsArray[i3 + 2] = position.z;

    sizesArray[i] = Math.random() / 10;
    timeMultiplierArray[i] = Math.random() + 1.0;
    const color = new THREE.Color();
    color.setHSL(Math.random(), Math.random(), 0.2);
    colorsArray[i * 3] = color.r;
    colorsArray[i * 3 + 1] = color.g;
    colorsArray[i * 3 + 2] = color.b;
  }

  return { positionsArray, sizesArray, timeMultiplierArray, colorsArray };
}

export type ParticlesHandle = {
  play: () => void;
};

type ParticlesProps = {
  position: THREE.Vector3;
  duration?: number;
};

const Particles = forwardRef<ParticlesHandle, ParticlesProps>(
  function Particles({ position, duration = 600 }, ref) {
    const gl = useThree();
    const texture1 = useTexture("/textures/6.png");
    const [data] = useState(() => initData(count, radius));

    const { size, viewport } = gl;
    const { width, height } = size;
    const { dpr } = viewport;

    const uniforms = useRef({
      uSize: new THREE.Uniform(0.8),
      uResolution: new THREE.Uniform(
        new THREE.Vector2(width, height).multiplyScalar(dpr)
      ),
      uTexture: new THREE.Uniform(texture1),
      uProgress: new THREE.Uniform(0),
    });

    const playingParticlesTween = useRef(
      new Tween(uniforms.current.uProgress)
        .to({ value: 1 })
        .duration(duration)
        .easing(Easing.Linear.None)
    );

    useFrame(() => {
      playingParticlesTween.current.update();
    });

    useEffect(() => {
      uniforms.current.uResolution.value = new THREE.Vector2(
        gl.size.width,
        gl.size.height
      ).multiplyScalar(gl.viewport.dpr);
    }, [gl.size.width, gl.size.height]);

    const play = () => {
      uniforms.current.uProgress.value = 0;
      playingParticlesTween.current.start();
    };

    useImperativeHandle(ref, () => {
      return {
        play,
      };
    });

    return (
      <points position={position} scale={0.1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={data.positionsArray}
            count={data.positionsArray.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSize"
            array={data.sizesArray}
            count={data.sizesArray.length}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aColor"
            array={data.colorsArray}
            count={data.colorsArray.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aTimeMultiplier"
            array={data.timeMultiplierArray}
            count={data.timeMultiplierArray.length}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={pointsVertexShader}
          fragmentShader={pointsFragmentShader}
          uniforms={uniforms.current}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    );
  }
);

export default Particles;
