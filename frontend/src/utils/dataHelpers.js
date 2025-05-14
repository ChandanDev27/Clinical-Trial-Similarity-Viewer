export const createConstantBins = (data, binCount, minRange, maxRange) => {
  if (!data || !Array.isArray(data)) return [];
  
  const binInterval = (maxRange - minRange) / binCount;
  
  return Array.from({ length: binCount }, (_, i) => {
    const lowerBound = minRange + i * binInterval;
    const upperBound = lowerBound + binInterval;
    return {
      range: lowerBound,
      upperBound: upperBound,
      value: data.filter(d => d >= lowerBound && d < upperBound).length,
      binInterval
    };
  });
};

export const groupStudyDuration = (duration) => {
  if (!duration || isNaN(duration)) return 0;
  return Number(duration);
};

