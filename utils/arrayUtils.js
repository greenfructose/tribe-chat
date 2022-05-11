
export const arraysAreEqual = (array1, array2) => {
  // Returns true if both arrays contain the same values regardless of order
  if (array1.length === array2.length) {
    return array1.every(element => {
      if (array2.includes(element)) {
        return true;
      }
      return false;
    });
  }

  return false;
}