// A JSON `pointer` must begin with the symbols '#', '/' or be an empty string ''.
export const isPointer = (input: string): boolean => {
  if (typeof input !== 'string') {
    return false;
  }

  if (input === '') {
    return true;
  }

  if (/^#|^\//.test(input)) {
    return true;
  }

  return false;
};
