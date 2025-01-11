import { Vector3 } from "three";
import Particles, { ParticlesHandle } from "./Particles";
import { forwardRef, useImperativeHandle, useRef } from "react";

export type ParticlesManagerHandle = {
  play: () => void;
};

type Props = {
  position: Vector3;
  duration?: number;
};

const ParticlesManager = forwardRef<ParticlesManagerHandle, Props>(
  function ParticalesManager({ position, duration }, ref) {
    const index = useRef(0);

    const p1 = useRef<ParticlesHandle>(null);
    const p2 = useRef<ParticlesHandle>(null);
    const p3 = useRef<ParticlesHandle>(null);

    const p4 = useRef<ParticlesHandle>(null);
    const p5 = useRef<ParticlesHandle>(null);
    const p6 = useRef<ParticlesHandle>(null);

    const p7 = useRef<ParticlesHandle>(null);
    const p8 = useRef<ParticlesHandle>(null);
    const p9 = useRef<ParticlesHandle>(null);

    const particles = [p1, p2, p3, p4, p5, p6, p7, p8, p9];

    useImperativeHandle(ref, () => {
      return {
        play: () => {
          const length = particles.length;
          const p = particles[index.current++];
          index.current = index.current < length ? index.current : 0;

          p?.current?.play();
        },
      };
    });

    return (
      <>
        <Particles ref={p1} position={position} duration={duration} />
        <Particles ref={p2} position={position} duration={duration} />
        <Particles ref={p3} position={position} duration={duration} />

        <Particles ref={p4} position={position} duration={duration} />
        <Particles ref={p5} position={position} duration={duration} />
        <Particles ref={p6} position={position} duration={duration} />

        <Particles ref={p7} position={position} duration={duration} />
        <Particles ref={p8} position={position} duration={duration} />
        <Particles ref={p9} position={position} duration={duration} />
      </>
    );
  }
);

export default ParticlesManager;
