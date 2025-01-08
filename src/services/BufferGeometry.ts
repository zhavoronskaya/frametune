import { BufferAttribute, BufferGeometry, Color } from "three";

const BufferGeometryService = {
  colorizeGeometryVertices: (geometry?: BufferGeometry) => {
    if (!geometry) return;

    const count = geometry.attributes.position.array.length;
    const colors = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const color = new Color(0xffffff);
      color.setHSL(Math.random(), Math.random(), 0.2);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("color", new BufferAttribute(colors, 3, true));
  },
};

export default BufferGeometryService;
