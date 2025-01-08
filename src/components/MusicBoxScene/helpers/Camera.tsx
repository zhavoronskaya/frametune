import {
  Box3,
  Camera,
  OrthographicCamera,
  PerspectiveCamera,
  Vector3,
} from "three";

import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export function isPerspectiveCamera(
  camera: Camera
): camera is PerspectiveCamera {
  return camera instanceof PerspectiveCamera;
}

export function isOrthographicCamera(
  camera: Camera
): camera is OrthographicCamera {
  return camera instanceof OrthographicCamera;
}

export const orthographicZoom = (
  center: Vector3,
  camera: OrthographicCamera,
  box: Box3
) => {
  camera.zoom =
    Math.min(
      Math.abs(camera.left * 2) / (box.max.x - box.min.x),
      Math.abs(camera.top * 2) / (box.max.y - box.min.y)
    ) * 0.9;
  camera.updateProjectionMatrix();
  camera.updateMatrix();
};

export const perspectiveZoom = (
  center: Vector3,
  camera: PerspectiveCamera,
  size: Vector3,
  offset: number
) => {
  const startDistance = center.distanceTo(camera.position);
  // check screen orientation, because camera.fov is based on the vertical direction.
  const endDistance =
    camera.aspect > 1
      ? (size.y / 2 + offset) / Math.abs(Math.tan(camera.fov / 2))
      : (size.y / 2 + offset) /
        Math.abs(2 * Math.atan((Math.PI * camera.fov) / 360)) /
        camera.aspect;

  camera.position.set(
    (camera.position.x * endDistance) / startDistance,
    (camera.position.y * endDistance) / startDistance,
    (camera.position.z * endDistance) / startDistance
  );
  camera.lookAt(center);
};

export const perspectiveZoomWithControls = (
  minZ: number,
  center: Vector3,
  camera: PerspectiveCamera,
  size: Vector3,
  offset: number,
  controls: OrbitControlsImpl
) => {
  if (size.x === 0 && size.y === 0 && size.z === 0) return;

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance =
    maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = offset * Math.max(fitHeightDistance, fitWidthDistance);

  const direction = controls.target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance);

  controls.maxDistance = distance * 10;
  controls.target.copy(center);

  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  camera.position.copy(controls.target).sub(direction);

  controls.update();
};
