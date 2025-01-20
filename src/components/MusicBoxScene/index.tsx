"use client";

import { Easing, Tween, Group as TweenGroup } from "@tweenjs/tween.js";
import {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  BackSide,
  Box3,
  CircleGeometry,
  Color,
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
import { Line2, LineSegments2 } from "three-stdlib";

import { useAppStore, useSoundsStore } from "@/state";
import {
  isOrthographicCamera,
  isPerspectiveCamera,
  orthographicZoom,
  perspectiveZoomWithControls,
} from "./helpers/Camera";

import { Cylinder, Id, Line, Segment } from "@/types";
import BufferGeometryService from "@/services/BufferGeometry";
import useAppSounds from "@/hooks/useAppSounds";

import ParticalesManager, { ParticlesManagerHandle } from "./ParticlesManager";

type Vector3Array = [number, number, number];
type Vector3Like = Vector3Array | number;

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
        <meshBasicMaterial color={"white"} side={DoubleSide} />
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
  const musicSegmentsRef = useRef<MusicSegmentsHandle>(null);

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

  useFrame((state, delta) => {
    playingSegmentTweens.current.update();

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
        musicSegmentsRef.current?.playSegment(segment.id);
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

        <MusicSegments
          scale={scale}
          cylinder={cylinder}
          ref={musicSegmentsRef}
        />
      </group>

      <ParticalesManager
        ref={particlesRef}
        position={new Vector3(cylinder.radius * 0.1, 0, 0)}
      />
    </group>
  );
};

type MusicSegmentsHandle = { playSegment: (id: Id) => void };
type MusicSegmentsProps = { cylinder: Cylinder; scale: number };

const MusicSegments = forwardRef<MusicSegmentsHandle, MusicSegmentsProps>(
  function MusicSegments({ cylinder, scale }, ref) {
    const getSegmentSoundDuration = useSoundsStore(
      (s) => s.getSegmentSoundDuration
    );
    const segments = useAppStore((state) => state.segments);

    const segmentHandleBySegmentId = useRef(
      {} as Record<Segment["id"], MusicSegmentHandle | null>
    );

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

    const positions = circleMesh.geometry.attributes.position.array;

    useImperativeHandle(ref, () => {
      return {
        playSegment: (id: Id) => {
          const segmentHandle = segmentHandleBySegmentId.current[id];
          if (!segmentHandle) return;

          const duration = getSegmentSoundDuration(id);
          segmentHandle.play(duration);
        },
      };
    });

    return (
      <group rotation={[0, 0, -Math.PI / 2]} scale={0.1}>
        {cylinder.segments.map((id, idx) => {
          return (
            <MusicSegment
              key={`${cylinder.radius}-${cylinder.segments.length}-${id}`} // TODO find better solution to reset line tweens
              ref={(r) => {
                segmentHandleBySegmentId.current[id] = r;
              }}
              scale={0.1}
              segment={segments[id]}
              position={[
                positions[(idx + 1) * 3],
                positions[(idx + 1) * 3 + 1],
                positions[(idx + 1) * 3 + 2],
              ]}
            />
          );
        })}
      </group>
    );
  }
);

type MusicSegmentProps = {
  segment: Segment;
  scale?: Vector3Like;
  position: Vector3Array;
};

type MusicSegmentHandle = {
  play: (durationSeconds: number) => void;
};

const MusicSegment = forwardRef<MusicSegmentHandle, MusicSegmentProps>(
  function MusicSegment({ segment, scale, position }, ref) {
    const segmentRef = useRef<Mesh | null>(null);
    const setActiveEntity = useAppStore((state) => state.setActiveEntity);
    const activeEntity = useAppStore((state) => state.activeEntity);

    const lineRef = useRef<Line2 | LineSegments2>(null);
    const lineProgressPos = useRef<Vector3Array>([...position]);
    const lineProgressTween = useRef<Tween | null>(
      new Tween(lineProgressPos.current)
        .easing(Easing.Linear.None)
        .onUpdate((v) => {
          const line = lineRef.current;
          if (!line) return;
          line.geometry.attributes.instanceEnd.setXYZ(0, v[0], v[1], v[2]);
          line.geometry.attributes.instanceEnd.needsUpdate = true;
        })
    );

    const lineColor = useMemo(() => {
      return new Color().setHSL(Math.random(), Math.random(), 0.2);
    }, []);

    const linePoints = useMemo(() => {
      // lineProgressPos.current = [...position];
      // lineProgressTween.current?.stop();
      // lineProgressTween.current = new Tween(lineProgressPos.current)
      //   .easing(Easing.Linear.None)
      //   .onUpdate((v) => {
      //     const line = lineRef.current;
      //     if (!line) return;
      //     line.geometry.attributes.instanceEnd.setXYZ(0, v[0], v[1], v[2]);
      //     line.geometry.attributes.instanceEnd.needsUpdate = true;
      //   });

      return [position, lineProgressPos.current];
    }, [...position]);

    useEffect(() => {
      BufferGeometryService.colorizeGeometryVertices(
        segmentRef?.current?.geometry
      );
    }, [segment]);

    useImperativeHandle(ref, () => ({
      play: (duration: number) => {
        lineProgressTween.current?.stop();

        if (duration === 0) return;
        lineProgressTween.current?.to([0, 0, 0], duration * 1000);
        lineProgressTween.current?.start();
      },
    }));

    useFrame(() => {
      lineProgressTween.current?.update();
    });

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (segment) setActiveEntity(segment);
    };

    const isEdgesVisible =
      activeEntity?.type === "segment" && activeEntity.id === segment.id;

    return (
      <>
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

        <DreiLine
          ref={lineRef}
          points={linePoints}
          lineWidth={6}
          // segments
          color={lineColor}
          visible={Boolean(segment.sounds.length)}
        />
      </>
    );
  }
);

export default MusicBoxCanvas;
