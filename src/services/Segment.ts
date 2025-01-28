import { Id, Segment } from "@/types";

const SegmentService = {
  createSegment: (cylinderId: Id, segmentId: Id) => {
    const segment: Segment = {
      id: segmentId,
      type: "segment",
      name: `Segment ${segmentId}`,
      cylinderId,
      sounds: [],
      volume: 1,
      isMuted: false,
      tags: [],
    };

    return segment;
  },
};

export default SegmentService;
