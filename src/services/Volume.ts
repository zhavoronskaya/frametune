const Volume = {
  calculate(...values: number[]) {
    return values.reduce((acc, val) => {
      return acc * val;
    }, 1);
  },
};

export default Volume;
