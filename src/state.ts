import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  AppState,
  Cylinder,
  Entity,
  Id,
  Line,
  Segment,
  Segments,
  SegmentsSounds,
  Sound,
  SoundsState,
} from "./types";

import SegmentService from "./services/Segment";
import AudioPool from "./services/AudioPool";
import Volume from "./services/Volume";

export const STORAGE_KEY = "frametune-store";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      nextLineId: 1,
      nextCylinerId: 1,
      nextSegmentId: 1,
      masterVolume: 1,

      lines: {},
      cylinders: {},
      segments: {},
      tags: {},
      isMuted: false,

      activeEntity: null,
      toggleMute: () => {
        set((state) => {
          const val = state.isMuted;
          return { isMuted: !val };
        });
      },
      createLineId: () => {
        const state = get();
        set({ nextLineId: state.nextLineId + 1 });
        return state.nextLineId;
      },

      createCylinderId() {
        const state = get();
        set({ nextCylinerId: state.nextCylinerId + 1 });
        return state.nextCylinerId;
      },

      createSegmentId() {
        const state = get();
        set({ nextSegmentId: state.nextSegmentId + 1 });
        return state.nextSegmentId;
      },

      addLine: () => {
        set((state) => {
          const lineId = state.createLineId();
          const line: Line = {
            id: lineId,
            type: "line",
            name: `Line ${lineId}`,
            cylinders: [],
            volume: 1,
            positionY: Object.keys(state.lines).length,
            isMuted: false,
            tags: [],
          };
          return { lines: { ...state.lines, [line.id]: line } };
        });
      },

      deleteLine: (lineId: Id) => {
        const state = get();
        const lines = { ...state.lines };
        const line = lines[lineId];
        line.cylinders.forEach(state.deleteCylinder);
        delete lines[lineId];

        set(() => {
          return { lines, activeEntity: null };
        });

        state.recalculateLinesPositions();
      },

      changeLinePosition: (lineId: Id, positionY: number) => {
        set((state) => {
          const line = state.lines[lineId];
          if (!line) return state;

          return {
            lines: { ...state.lines, [line.id]: { ...line, positionY } },
          };
        });
      },

      changeLineName: (id, name) => {
        const line = get().lines[id];
        if (!line) return;

        set((state) => {
          return { lines: { ...state.lines, [line.id]: { ...line, name } } };
        });
      },

      recalculateLinesPositions: () => {
        const state = get();
        const lines = state.lines;
        const updatedLines = Object.fromEntries(
          Object.entries(lines).map((entry, idx) => {
            const key = entry[0];
            const line = entry[1];
            return [key, { ...line, positionY: idx }];
          })
        );

        set(() => {
          return { lines: updatedLines };
        });
      },

      toggleMuteLine: (lineId: Id) => {
        set((state) => {
          const line = state.lines[lineId];
          if (!line) return state;
          return {
            lines: {
              ...state.lines,
              [line.id]: { ...line, isMuted: !line.isMuted },
            },
          };
        });
      },

      getLineSegments: (lineId: Id) => {
        const state = get();
        const line = state.lines[lineId];
        if (!line) return [];

        const cylindersIds = line.cylinders;
        const segments = [] as Segment[];

        cylindersIds.forEach((id) => {
          const segmentsIdsOfCylinder = state.cylinders[id].segments;
          segmentsIdsOfCylinder.forEach((id) =>
            segments.push(state.segments[id])
          );
        });

        return segments;
      },

      addCylinder: (lineId: Id) => {
        const state = get();
        const line = state.lines[lineId];
        if (!line) return null;

        const newCylinderId = state.createCylinderId();

        const newSegmentsList = [
          SegmentService.createSegment(newCylinderId, state.createSegmentId()),
          SegmentService.createSegment(newCylinderId, state.createSegmentId()),
          SegmentService.createSegment(newCylinderId, state.createSegmentId()),
        ];

        const newSegments: Segments = {
          [newSegmentsList[0].id]: newSegmentsList[0],
          [newSegmentsList[1].id]: newSegmentsList[1],
          [newSegmentsList[2].id]: newSegmentsList[2],
        };

        const newCylinder: Cylinder = {
          id: newCylinderId,
          type: "cylinder",
          name: `Cylinder ${newCylinderId}`,
          lineId,
          positionX: 0,
          volume: 1,
          segments: newSegmentsList.map((s) => s.id),
          radius: 1,
          speed: 0,
          isMuted: false,
          tags: [],
        };

        const newLine = {
          ...line,
          cylinders: [...line.cylinders, newCylinder.id],
        };

        set((state) => {
          return {
            lines: { ...state.lines, [newLine.id]: newLine },
            cylinders: { ...state.cylinders, [newCylinder.id]: newCylinder },
            segments: { ...state.segments, ...newSegments },
          };
        });

        return newCylinder;
      },

      updateCylinder: (cylinder: Cylinder) => {
        set((state) => {
          return {
            // lines: { ...state.lines, [newLine.id]: newLine },
            cylinders: { ...state.cylinders, [cylinder.id]: cylinder },
            // segments: { ...state.segments, ...newSegments },
          };
        });
      },

      deleteCylinder: (cylinderId: Id) => {
        const state = get();
        const cylinders = { ...state.cylinders };
        const cylinder = cylinders[cylinderId];
        if (!cylinder) return;

        const lines = { ...state.lines };
        const line = lines[cylinder.lineId];
        if (!line) return;

        const updatedLine = {
          ...line,
          cylinders: line.cylinders.filter((id) => id !== cylinder.id),
        };

        set((state) => {
          cylinder.segments.forEach((id) => state.deleteSegment(id, true));
          delete cylinders[cylinderId];
          return {
            lines: { ...state.lines, [updatedLine.id]: updatedLine },
            cylinders,
            activeEntity: null,
          };
        });
      },

      changeCylinderName: (id, name) => {
        const cylinder = get().cylinders[id];
        if (!cylinder) return;

        set((state) => {
          return {
            cylinders: {
              ...state.cylinders,
              [cylinder.id]: { ...cylinder, name },
            },
          };
        });
      },

      getCylinderSegments: (cylinderId: Id) => {
        const state = get();
        const cylinder = state.cylinders[cylinderId];
        if (!cylinder) return [];

        const segmentsIds = cylinder.segments;
        const segments = segmentsIds.map((id) => state.segments[id]);
        return segments;
      },

      toggleMuteCylinder: (cylinderId: Id) => {
        set((state) => {
          const cylinder = state.cylinders[cylinderId];
          if (!cylinder) return state;
          return {
            cylinders: {
              ...state.cylinders,
              [cylinder.id]: { ...cylinder, isMuted: !cylinder.isMuted },
            },
          };
        });
      },

      setActiveEntity: (activeEntity) => {
        set(() => {
          return { activeEntity };
        });
      },

      setEntityVolume: (entity: Entity, volume: number) => {
        const state = get();
        const updatedEntity = { ...entity, volume };
        const key = `${updatedEntity.type}s` as const;

        const affectedSegments = (() => {
          const { type } = entity;
          if (type === "line") return state.getLineSegments(entity.id);
          if (type === "cylinder") return state.getCylinderSegments(entity.id);
          return [entity];
        })();

        set((state) => {
          return {
            [key]: {
              ...state[key],
              [updatedEntity.id]: updatedEntity,
            },
          };
        });

        const soundsState = useSoundsStore.getState();
        affectedSegments.forEach((s) => {
          const volume = state.getResultSegmentVolume(s.id);
          const sounds = soundsState.segmentsSounds[s.id];
          sounds.forEach((s) => s.audio.setVolume(volume));
        });
      },

      addEntityTag: (entity: Entity, tagName: string) => {
        if (!tagName) return;

        const state = get();
        const tag = state.tags[tagName] || {
          name: tagName,
          lines: [],
          segments: [],
          cylinders: [],
        };

        const updatedEntity = {
          ...entity,
          tags: Array.from(new Set([...(entity.tags || []), tag.name])),
        };

        const key = `${updatedEntity.type}s` as const;
        tag[key].push(updatedEntity.id);

        set((state) => {
          return {
            tags: {
              ...state.tags,
              [tag.name]: tag,
            },
            [key]: {
              ...state[key],
              [updatedEntity.id]: updatedEntity,
            },
          };
        });

        // set((state) => {
        //   if(updatedEntity.type === "line")
        //   {
        //     return {
        //       lines: {
        //         ...state.lines,
        //         [entity.id]: updatedEntity,
        //       },
        //     };
        //   }
        //   if(updatedEntity.type === "cylinder")
        //     {
        //       return {
        //         cylinders: {
        //           ...state.cylinders,
        //           [entity.id]:updatedEntity,
        //         },
        //       };
        //     }

        //     if(updatedEntity.type === "segment")
        //       {
        //         return {
        //           segments: {
        //             ...state.segments,
        //             [entity.id]: updatedEntity,
        //           },
        //         };
        //       }
        //       return state;
        // })
      },

      deleteEntityTag: (entity: Entity, tagName: string) => {
        const state = get();
        const tags = { ...state.tags };
        const key = `${entity.type}s` as const;
        const tag = tags[tagName];
        if (!tag) return;

        tag[key] = tag[key].filter((id) => id != entity.id);

        if (
          tag.lines.length === 0 &&
          tag.cylinders.length === 0 &&
          tag.segments.length === 0
        ) {
          delete tags[tagName];
        } else {
          tags[tag.name] = { ...tag };
        }

        set((state) => {
          const updatedTags = entity.tags.filter((tag) => tag != tagName);

          return {
            [key]: {
              ...state[key],
              [entity.id]: { ...entity, tags: updatedTags },
            },
            tags,
          };
        });
      },

      addSegment: (cylinderId: Id) => {
        const state = get();
        const cylinder = state.cylinders[cylinderId];
        if (!cylinder) return null;

        const newSegmentId = state.createSegmentId();

        const newSegment: Segment = {
          id: newSegmentId,
          type: "segment",
          name: `Segment ${newSegmentId}`,
          cylinderId: cylinder.id,
          sounds: [],
          volume: 1,
          isMuted: false,
          tags: [],
        };

        const newSegmentsList = [...cylinder.segments, newSegment.id];

        useSoundsStore.getState().addSegment(newSegment.id);

        set((state) => {
          return {
            cylinders: {
              ...state.cylinders,
              [cylinder.id]: { ...cylinder, segments: newSegmentsList },
            },
            segments: { ...state.segments, [newSegment.id]: newSegment },
          };
        });
      },

      getResultSegmentVolume: (segmentId: Id) => {
        const state = get();
        const segment = state.segments[segmentId];
        if (!segment) return 0;

        const cylinder = state.cylinders[segment.cylinderId];
        if (!cylinder) return 0;

        const line = state.lines[cylinder.lineId];
        if (!line) return 0;

        return Volume.calculate(
          state.masterVolume,
          line.volume,
          cylinder.volume,
          segment.volume
        );
      },

      addSegmentSound: (segmentId: Id) => {
        const state = get();
        const segment = state.segments[segmentId];

        useSoundsStore.getState().addSound(segmentId, "");

        set((state) => {
          return {
            segments: {
              ...state.segments,
              [segment.id]: {
                ...segment,
                sounds: [...segment.sounds, ""],
              },
            },
          };
        });
      },

      updateSegmentSound: (segmentId: Id, idx: number, src: string) => {
        const state = get();
        const segment = state.segments[segmentId];

        useSoundsStore.getState().updateSound(segmentId, idx, src);

        set((state) => {
          return {
            segments: {
              ...state.segments,
              [segment.id]: {
                ...segment,
                sounds: segment.sounds.map((ssrc, sidx) => {
                  if (sidx === idx) return src;
                  else return ssrc;
                }),
              },
            },
          };
        });
      },
      deleteSegmentSound: (segmentId: Id, idx: number) => {
        const state = get();
        const segment = state.segments[segmentId];

        useSoundsStore.getState().deleteSound(segmentId, idx);

        set((state) => {
          return {
            segments: {
              ...state.segments,
              [segment.id]: {
                ...segment,
                sounds: segment.sounds.filter((ssrc, sidx) => idx !== sidx),
              },
            },
          };
        });
      },

      deleteSegment: (segmentId, force) => {
        const state = get();
        const segment = state.segments[segmentId];
        const cylinder = state.cylinders[segment.cylinderId];

        if (!cylinder) return;
        if (!force && cylinder.segments.length <= 3) return;

        const updatedCylinder = {
          ...cylinder,
          segments: cylinder.segments.filter((id) => id !== segment.id),
        };

        useSoundsStore.getState().deleteSegment(segmentId);

        set((state) => {
          const segments = { ...state.segments };
          delete segments[segmentId];
          return {
            cylinders: {
              ...state.cylinders,
              [updatedCylinder.id]: updatedCylinder,
            },
            segments,
            activeEntity: null,
          };
        });
      },

      toggleMuteSegment: (segmentId: Id) => {
        const state = get();
        const segment = state.segments[segmentId];
        set((state) => {
          return {
            segments: {
              ...state.segments,
              [segment.id]: {
                ...segment,
                isMuted: !segment.isMuted,
              },
            },
          };
        });
      },

      changeSegmentName: (id, name) => {
        const segment = get().segments[id];
        if (!segment) return;

        set((state) => {
          return {
            segments: { ...state.segments, [segment.id]: { ...segment, name } },
          };
        });
      },
    }),
    {
      name: STORAGE_KEY, // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

const appState = useAppStore.getState();
const segments = appState.segments;
const getResultSegmentVolume = appState.getResultSegmentVolume;
const segmentsSounds: SegmentsSounds = {};
Object.values(segments).forEach((segment) => {
  const sounds: Sound[] = [];
  segment.sounds.forEach((src) => {
    const audio = new AudioPool(src, 10);
    const sound: Sound = { src, audio };
    audio.setVolume(getResultSegmentVolume(segment.id));
    sounds.push(sound);
  });
  segmentsSounds[segment.id] = sounds;
});

export const useSoundsStore = create<SoundsState>()((set, get) => ({
  segmentsSounds,

  getSegmentSoundDuration: (id) => {
    const { segmentsSounds } = get();
    const sounds = segmentsSounds[id];
    if (!sounds) return 0;

    return sounds.reduce((acc, s) => Math.max(acc, s.audio.duration), 0);
  },

  addSegment: (id) => {
    set((state) => ({
      segmentsSounds: { ...state.segmentsSounds, [id]: [] },
    }));
  },

  deleteSegment: (id) => {
    set((state) => {
      const segmentsSounds = { ...state.segmentsSounds };
      delete segmentsSounds[id];
      return { segmentsSounds };
    });
  },

  addSound: (segmentId, src) => {
    set((state) => {
      const audio = new AudioPool(src, 10);
      const sound: Sound = { src, audio };

      const segmentSounds = state.segmentsSounds[segmentId] ?? [];

      return {
        segmentsSounds: {
          ...state.segmentsSounds,
          [segmentId]: [...segmentSounds, sound],
        },
      };
    });
  },

  updateSound: (segmentId, idx, src) => {
    set((state) => {
      const segmentSounds = state.segmentsSounds[segmentId];

      return {
        segmentsSounds: {
          ...state.segmentsSounds,
          [segmentId]: segmentSounds.map((s, sidx) => {
            if (idx !== sidx) return s;

            const audio = s.audio;
            audio.setSrc(src);

            return { src, audio };
          }),
        },
      };
    });
  },

  deleteSound: (segmentId, idx) => {
    set((state) => {
      const segmentSounds = state.segmentsSounds[segmentId];
      return {
        segmentsSounds: {
          ...state.segmentsSounds,
          [segmentId]: segmentSounds.filter((s, sidx) => sidx !== idx),
        },
      };
    });
  },
}));

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // @ts-expect-error
  window.getState = useAppStore.getState;
}
