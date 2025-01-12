import AudioPool from "./services/AudioPool";

export type Id = number;

export type Line = {
  id: Id;
  type: "line";
  name: string;
  positionY: number;
  cylinders: Id[];
  isMuted: boolean;
};

export type Lines = Record<Line["id"], Line>;

export type Cylinder = {
  id: Id;
  lineId: Id;
  type: "cylinder";
  name: string;
  positionX: number;
  segments: Id[];
  radius: number;
  speed: number;
  isMuted: boolean;
};
export type Cylinders = Record<Cylinder["id"], Cylinder>;

export type Segment = {
  id: Id;
  type: "segment";
  name: string;
  cylinderId: Id;
  sounds: Sound["src"][];
  isMuted: boolean;
};

export type Segments = Record<Segment["id"], Segment>;

export type Entity = Line | Cylinder | Segment;

export type Sound = {
  src: string;
  audio: AudioPool;
};

export type SegmentsSounds = Record<Segment["id"], Sound[]>;

export interface AppState {
  nextLineId: number;
  nextCylinerId: number;
  nextSegmentId: number;
  isMuted: boolean;
  lines: Lines;
  cylinders: Cylinders;
  segments: Segments;

  activeEntity: Entity | null;

  toggleMute: () => void;

  createLineId: () => number;
  createCylinderId: () => number;
  createSegmentId: () => number;

  addLine: () => void;
  deleteLine: (id: Id) => void;
  changeLinePosition: (id: Id, positionY: number) => void;
  changeLineName: (id: Id, name: string) => void;
  recalculateLinesPositions: () => void;
  toggleMuteLine: (id: Id) => void;

  addCylinder: (id: Id) => Cylinder | null;
  updateCylinder: (cylinder: Cylinder) => void;
  deleteCylinder: (id: Id) => void;
  changeCylinderName: (id: Id, name: string) => void;
  toggleMuteCylinder: (id: Id) => void;

  addSegment: (cylinderId: Id) => void;
  deleteSegment: (id: Id, force?: boolean) => void;
  changeSegmentName: (id: Id, name: string) => void;
  addSegmentSound: (id: Id) => void;
  updateSegmentSound: (id: Id, idx: number, src: string) => void;
  deleteSegmentSound: (id: Id, idx: number) => void;
  toggleMuteSegment: (id: Id) => void;
  setActiveEntity: (entity: Entity | null) => void;
}

export interface SoundsState {
  segmentsSounds: SegmentsSounds;

  addSegment: (segmentId: Id) => void;
  deleteSegment: (segmentId: Id) => void;

  addSound: (segmentId: Id, src: Sound["src"]) => void;
  updateSound: (segmentId: Id, idx: number, src: string) => void;
  deleteSound: (segmentId: Id, idx: number) => void;
}
