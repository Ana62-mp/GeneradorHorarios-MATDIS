export function calculateCombinationCount(total, selected) {
  if (
    !Number.isInteger(total) ||
    !Number.isInteger(selected) ||
    selected < 0 ||
    selected > total
  ) {
    return 0;
  }

  const smallerSelection = Math.min(
    selected,
    total - selected,
  );

  let result = 1;

  for (let index = 1; index <= smallerSelection; index += 1) {
    result =
      (result * (total - smallerSelection + index)) /
      index;
  }

  return Math.round(result);
}