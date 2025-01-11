"use client";

import { Easing, Tween, Group as TweenGroup } from "@tweenjs/tween.js";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  BackSide,
  Box3,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from "three";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";

import { Line as DreiLine, Edges, OrbitControls } from "@react-three/drei";
import { useAppStore } from "@/state";
import {
  isOrthographicCamera,
  isPerspectiveCamera,
  orthographicZoom,
  perspectiveZoomWithControls,
} from "./helpers/Camera";

import { Cylinder, Line, Segment } from "@/types";
import BufferGeometryService from "@/services/BufferGeometry";
import useAppSounds from "@/hooks/useAppSounds";

import ParticalesManager, { ParticlesManagerHandle } from "./ParticlesManager";

type Vector3Like = [number, number, number] | number;

const MusicBoxCanvas = () => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <Canvas camera={{ fov: 45, near: 0.01, far: 100, position: [0, 0, 10] }}>
      <MusicBoxScene controlsRef={controlsRef} />

      <OrbitControls ref={controlsRef} />
    </Canvas>
  );
};

type MusicBoxSceneProps = {
  scale?: number;
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
};

const MusicBoxScene = ({ controlsRef, scale = 0.1 }: MusicBoxSceneProps) => {
  const lines = useAppStore((state) => state.lines);
  const cylinders = useAppStore((state) => state.cylinders);
  const setActiveEntity = useAppStore((state) => state.setActiveEntity);
  const groupRef = useRef<Group | null>(null);
  const { camera } = useThree();

  const zoomToFit = () => {
    if (!groupRef.current) return;
    const box = new Box3().setFromObject(groupRef.current);
    const center = new Vector3();
    box.getCenter(center);
    const size = new Vector3();

    box.getSize(size);
    if (isOrthographicCamera(camera)) {
      orthographicZoom(center, camera, box);
    } else if (isPerspectiveCamera(camera)) {
      if (!controlsRef.current) return;
      const offset = 1;
      const minZ = box.min.z;
      perspectiveZoomWithControls(
        minZ,
        center,
        camera,
        size,
        offset,
        controlsRef.current
      );
    }
  };
  const linesArr = Object.values(lines);
  useEffect(() => {
    zoomToFit();
  }, [linesArr.length]);

  const cylindersArr = Object.values(cylinders);

  return (
    <group>
      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setActiveEntity(null);
        }}
      >
        <boxGeometry args={[camera.far, camera.far, camera.far]} />
        <meshBasicMaterial side={BackSide} />
      </mesh>

      <group ref={groupRef}>
        {linesArr.map((line) => (
          <MusicLine
            key={line.id}
            line={line}
            position={[0, line.positionY, 0]}
            scale={scale}
          />
        ))}

        {cylindersArr.map((cylinder) => (
          <MusicCylinder key={cylinder.id} scale={scale} cylinder={cylinder} />
        ))}
      </group>
    </group>
  );
};

type LineProps = {
  line: Line;
  position: Vector3Like;
  scale: number;
};

const LINE_POINTS_COUNT = 2;
const MusicLine = ({ line, position, scale }: LineProps) => {
  const addCylinder = useAppStore((state) => state.addCylinder);
  const setActiveEntity = useAppStore((state) => state.setActiveEntity);
  // const [isSelected, setIsSelected] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const cylinder = addCylinder(line.id);
    if (cylinder) setActiveEntity(cylinder);
  };

  const colors = useMemo(() => {
    const colorArray = [];
    for (let i = 0; i < LINE_POINTS_COUNT; i++) {
      const color = new Color();
      color.setHSL(Math.random(), Math.random(), 0.2);
      colorArray.push(color);
    }

    return colorArray;
  }, []);

  return (
    <group>
      <mesh
        position={position}
        scale={scale}
        visible={false}
        onClick={handleClick}
      >
        <planeGeometry args={[20, 1]} />
        <meshBasicMaterial color={"white"} />
      </mesh>

      <DreiLine
        points={[
          [-10, 0, 0],
          [10, 0, 0],
        ]}
        lineWidth={4}
        segments
        dashed={false}
        position={position}
        scale={scale}
        vertexColors={colors}
      ></DreiLine>
    </group>
  );
};

type MusicCylinderProps = {
  cylinder: Cylinder;
  scale?: number;
};
const MusicCylinder = ({ cylinder, scale = 1 }: MusicCylinderProps) => {
  const prevActiveSegmentIdx = useRef(-1);
  // const angleBetweenSegmentsRef = useRef(-1);

  const cylinderRef = useRef<Mesh | null>(null);
  const groupRef = useRef<Group | null>(null);

  const appSounds = useAppSounds();
  const lines = useAppStore((state) => state.lines);
  const segments = useAppStore((state) => state.segments);
  const setActiveEntity = useAppStore((state) => state.setActiveEntity);
  const activeEntity = useAppStore((state) => state.activeEntity);
  const playingSegmentTweens = useRef(new TweenGroup());
  const particlesRef = useRef<ParticlesManagerHandle>(null);

  const lineId = cylinder.lineId;
  const posY = lines[lineId].positionY;

  // useEffect(() => {
  //   angleBetweenSegmentsRef.current = 360 / cylinder.segments.length;
  // }, [cylinder.segments.length])

  // COLORS
  useEffect(() => {
    BufferGeometryService.colorizeGeometryVertices(
      cylinderRef?.current?.geometry
    );
  }, [cylinder]);

  const playingSegmentAnimation = (scene: Scene, segment: Segment) => {
    const mesh = scene.getObjectByName(segment.id.toString());

    if (!mesh) return;

    const tween1 = new Tween(mesh.scale)
      .easing(Easing.Cubic.In)
      .to({ x: 0.2, y: 0.2, z: 0.2 }, 200);

    const tween2 = new Tween(mesh.scale)
      .easing(Easing.Cubic.Out)
      .to({ x: 0.1, y: 0.1, z: 0.1 }, 150)
      .onComplete(() => {
        playingSegmentTweens.current.remove(tween1, tween2);
      });

    tween1.start().chain(tween2);
    playingSegmentTweens.current.add(tween1, tween2);
  };

  useFrame(() => {
    playingSegmentTweens.current.update();
  });

  const progress = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z -= cylinder.speed * delta;

    const rotationZ = Math.abs(groupRef.current.rotation.z - Math.PI / 2);

    const angle = MathUtils.radToDeg(rotationZ % (2 * Math.PI));
    const angleBetweenSegments = 360 / cylinder.segments.length;
    const activeSegmentIndex = Math.floor(angle / angleBetweenSegments);

    if (activeSegmentIndex !== prevActiveSegmentIdx.current) {
      const segmentId = cylinder.segments[activeSegmentIndex];
      const segment = segments[segmentId];
      if (!segment) return;

      prevActiveSegmentIdx.current = activeSegmentIndex;

      if (appSounds.playSegmentSounds(segment)) {
        particlesRef.current?.play();
        progress.current = 1.0 - 0.5;
        playingSegmentAnimation(state.scene, segment);
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (cylinder) setActiveEntity(cylinder);
  };

  const isEdgesVisible =
    activeEntity?.type === "cylinder" && activeEntity.id === cylinder.id;

  return (
    <group position={[cylinder.positionX, posY, 0]}>
      <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
        <mesh
          onClick={handleClick}
          rotation={[Math.PI / 2, 0, 0]}
          // onPointerMissed={handlePointerMissed}
          ref={cylinderRef}
          scale={scale}
        >
          <cylinderGeometry
            args={[
              cylinder.radius,
              cylinder.radius,
              1,
              cylinder.segments.length,
              16,
            ]}
          />
          <meshBasicMaterial vertexColors wireframe />
          <Edges
            key={cylinder.segments.length}
            linewidth={2}
            threshold={1}
            visible={isEdgesVisible}
            color={"white"}
          />
        </mesh>

        <MusicSegments scale={scale} cylinder={cylinder} />
      </group>

      <ParticalesManager
        ref={particlesRef}
        position={new Vector3(cylinder.radius * 0.1, 0, 0)}
      />
    </group>
  );
};

const MusicSegments = ({
  cylinder,
  scale,
}: {
  cylinder: Cylinder;
  scale: number;
}) => {
  const segments = useAppStore((state) => state.segments);

  const circleMesh = useMemo(() => {
    const { radius, segments } = cylinder;
    const geometry = new CircleGeometry(radius, segments.length);

    const material = new MeshBasicMaterial();
    const mesh = new Mesh(geometry, material);
    // mesh.geometry.setIndex(null);
    mesh.rotation.z = -Math.PI / 2;
    mesh.scale.set(scale, scale, scale);

    return mesh;
  }, [cylinder, scale]);

  // console.log("circleMesh", circleMesh.geometry);
  const positions = circleMesh.geometry.attributes.position.array;
  const progress = 1.0 - 0.5;
  return (
    <group rotation={[0, 0, -Math.PI / 2]} scale={0.1}>
      {cylinder.segments.map((id, idx) => (
        <group key={id}>
          <MusicSegment
            scale={0.1}
            segment={segments[id]}
            position={[
              positions[(idx + 1) * 3],
              positions[(idx + 1) * 3 + 1],
              positions[(idx + 1) * 3 + 2],
            ]}
          />
          <SoundLine
            progressPosition={[
              positions[(idx + 1) * 3] * progress,
              positions[(idx + 1) * 3 + 1] * progress,
              positions[(idx + 1) * 3 + 2] * progress,
            ]}
            segmentPosition={[
              positions[(idx + 1) * 3],
              positions[(idx + 1) * 3 + 1],
              positions[(idx + 1) * 3 + 2],
            ]}
          />
        </group>
      ))}
    </group>
  );
};

type MusicSegmentProps = {
  segment: Segment;
  scale?: Vector3Like;
  position: Vector3Like;
};

const MusicSegment = ({ segment, scale, position }: MusicSegmentProps) => {
  const segmentRef = useRef<Mesh | null>(null);
  const setActiveEntity = useAppStore((state) => state.setActiveEntity);
  const activeEntity = useAppStore((state) => state.activeEntity);

  useEffect(() => {
    BufferGeometryService.colorizeGeometryVertices(
      segmentRef?.current?.geometry
    );
  }, [segment]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (segment) setActiveEntity(segment);
  };

  const isEdgesVisible =
    activeEntity?.type === "segment" && activeEntity.id === segment.id;

  return (
    <mesh
      onClick={handleClick}
      ref={segmentRef}
      scale={scale}
      position={position}
      name={segment.id.toString()}
    >
      <sphereGeometry args={[2, 8, 4]} />
      <meshBasicMaterial wireframe vertexColors />
      <Edges
        linewidth={2}
        threshold={1}
        visible={isEdgesVisible}
        color={"white"}
      />
    </mesh>
  );
};

type SoundLineProps = {
  progressPosition: Vector3Like;
  segmentPosition: Vector3Like;
};

const SoundLine = ({ progressPosition, segmentPosition }: SoundLineProps) => {
  const color = useMemo(() => {
    return new Color().setHSL(Math.random(), Math.random(), 0.2);
  }, []);
  return (
    <DreiLine
      points={[progressPosition, segmentPosition]}
      lineWidth={1}
      segments
      color={color}
    />
  );
};

export default MusicBoxCanvas;
