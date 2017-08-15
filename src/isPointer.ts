export const isPointer = (input: string): boolean => {
  if (typeof input !== 'string') {
    return false;
  }

  if (input === '') {
    return true;
  }

  if (input.match(/^#|^\//) !== null) {
    return true;
  }

  return false;
};
