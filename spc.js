function computeMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function classify(values, median) {
  return values.map(v =>
    v > median ? "over" :
    v < median ? "under" :
    "on"
  );
}

function longestRun(classified) {
  let max = 0, current = 0, last = null;
  for (const side of classified) {
    if (side === "on") continue;
    if (side === last) {
      current++;
    } else {
      current = 1;
      last = side;
    }
    if (current > max) max = current;
  }
  return max;
}

function countCrosses(classified) {
  let crosses = 0;
  let last = null;
  for (const side of classified) {
    if (side === "on") continue;
    if (last && side !== last) crosses++;
    last = side;
  }
  return crosses;
}

const anhoejLimits = {
  12: { run: 7, cross: 3 },
  13: { run: 7, cross: 3 },
  14: { run: 7, cross: 4 },
  15: { run: 7, cross: 4 },
  16: { run: 7, cross: 4 },
  17: { run: 7, cross: 5 },
  18: { run: 7, cross: 5 },
  19: { run: 7, cross: 6 },
  20: { run: 7, cross: 6 },
  21: { run: 7, cross: 6 },
  22: { run: 7, cross: 7 },
  23: { run: 8, cross: 7 },
  24: { run: 8, cross: 8 },
  25: { run: 8, cross: 8 },
  26: { run: 8, cross: 8 },
  27: { run: 8, cross: 9 },
  28: { run: 8, cross: 9 },
  29: { run: 8, cross: 10 },
  30: { run: 8, cross: 10 }
};

function analyzeSPC(values) {
  if (values.length < 12) {
    return { status: "for få datapunkter", median: null };
  }

  const median = computeMedian(values);
  const classified = classify(values, median);
  const usable = classified.filter(x => x !== "on").length;

  const run = longestRun(classified);
  const crosses = countCrosses(classified);

  const limits = anhoejLimits[usable];
  if (!limits) return { status: "mangler grænseværdier" };

  const special =
    run > limits.run ||
    crosses < limits.cross;

  return {
    median,
    run,
    crosses,
    usable,
    limits,
    status: special ? "ikke-tilfældig variation" : "tilfældig variation"
  };
}
