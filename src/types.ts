import AudioPool from "./services/AudioPool";

export type Id = number;

export type Line = {
  id: Id;
  type: "line";
  name: string;
  positionY: number;
  cylinders: Id[];
  volume: number;
  isMuted: boolean;
  tags: string[];
};

export type Lines = Record<Line["id"], Line>;

// export type PitchLoop = {
//   center: {x: 0, y: 0},
//   segmetns: [
//     {},
//     {},
//     {},
//   ]
// }

export type Cylinder = {
  id: Id;
  lineId: Id;
  type: "cylinder";
  name: string;
  positionX: number;
  segments: Id[];
  volume: number;
  radius: number;
  speed: number;
  isMuted: boolean;
  tags: string[];
};
export type Cylinders = Record<Cylinder["id"], Cylinder>;

export type Tag = {
  name: string;
  lines: Id[];
  segments: Id[];
  cylinders: Id[];
};

export type Tags = Record<Tag["name"], Tag>;

export type Segment = {
  id: Id;
  type: "segment";
  name: string;
  cylinderId: Id;
  sounds: Sound["src"][];
  volume: number;
  isMuted: boolean;
  tags: string[];
};

export type Segments = Record<Segment["id"], Segment>;

export type Entity = Line | Cylinder | Segment;

export type Sound = {
  src: string;
  audio: AudioPool;
};

export type SegmentsSounds = Record<Segment["id"], Sound[]>;

export type Command = {
  id: string;
  name: string;
  precondition: (state: AppState) => boolean;
};

export type CommandsState = {
  commands: Command[];
};

export interface AppState {
  nextLineId: number;
  nextCylinerId: number;
  nextSegmentId: number;
  masterVolume: number;
  isMuted: boolean;
  tags: Tags;
  lines: Lines;
  cylinders: Cylinders;
  segments: Segments;

  activeEntity: Entity | null;

  toggleMute: () => void;
  setMasterVolume: (volume: number) => void;

  createLineId: () => number;
  createCylinderId: () => number;
  createSegmentId: () => number;

  addLine: () => void;
  deleteLine: (id: Id) => void;
  changeLinePosition: (id: Id, positionY: number) => void;
  changeLineName: (id: Id, name: string) => void;
  recalculateLinesPositions: () => void;
  getLineSegments: (id: Id) => Segment[];

  toggleMuteLine: (id: Id) => void;

  addCylinder: (id: Id) => Cylinder | null;
  updateCylinder: (cylinder: Cylinder) => void;
  deleteCylinder: (id: Id) => void;
  changeCylinderName: (id: Id, name: string) => void;
  getCylinderSegments: (id: Id) => Segment[];

  toggleMuteCylinder: (id: Id) => void;

  addSegment: (cylinderId: Id) => void;
  deleteSegment: (id: Id, force?: boolean) => void;
  changeSegmentName: (id: Id, name: string) => void;

  addSegmentSound: (id: Id) => void;
  updateSegmentSound: (id: Id, idx: number, src: string) => void;
  getResultSegmentVolume: (id: Id) => number;

  deleteSegmentSound: (id: Id, idx: number) => void;
  toggleMuteSegment: (id: Id) => void;
  setActiveEntity: (entity: Entity | null) => void;
  addEntityTag: (entity: Entity, tag: string) => void;
  setEntityVolume: (entity: Entity, volume: number) => void;
  deleteEntityTag: (entity: Entity, tagName: string) => void;
}

export interface SoundsState {
  segmentsSounds: SegmentsSounds;

  addSegment: (segmentId: Id) => void;
  deleteSegment: (segmentId: Id) => void;

  addSound: (segmentId: Id, src: Sound["src"]) => void;
  updateSound: (segmentId: Id, idx: number, src: string) => void;
  deleteSound: (segmentId: Id, idx: number) => void;

  getSegmentSoundDuration: (segmentId: Id) => number; // seconds
}
