export const createBins = (data, binSize) => {
  if (!data || !Array.isArray(data)) return [];

  const sortedData = [...data].sort((a, b) => a - b);
  const minValue = sortedData[0] || 0;
  const maxValue = sortedData[sortedData.length - 1] || 0;
  const binInterval = Math.ceil((maxValue - minValue) / binSize);

  return Array.from({ length: binSize }, (_, i) => {
    const lowerBound = minValue + i * binInterval;
    const upperBound = lowerBound + binInterval;
    return {
      range: `${lowerBound}-${upperBound}`,
      value: sortedData.filter(d => d >= lowerBound && d < upperBound).length,
    };
  });
};
