export function calculateCombinationCount(totalElements: number,selectedElements: number,): number {
  if (selectedElements < 0 || selectedElements > totalElements) {
    return 0;
  }

  const smallerSelection = Math.min(
    selectedElements,
    totalElements - selectedElements,
  );

  let result = 1;

  for (let index = 1; index <= smallerSelection; index++) {
    result = (result * (totalElements - smallerSelection + index)) / index;
  }

  return Math.round(result);
}

export function generateCombinations<T>(elements: T[], size: number): T[][] {
  const results: T[][] = [];

  function combine(startIndex: number, currentCombination: T[]): void {
    if (currentCombination.length === size) {
      results.push([...currentCombination]);
      return;
    }

    for (let index = startIndex; index < elements.length; index++) {
      currentCombination.push(elements[index]!);

      combine(index + 1, currentCombination);

      currentCombination.pop();
    }
  }

  combine(0, []);

  return results;
}
