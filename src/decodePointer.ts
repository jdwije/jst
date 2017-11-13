const decodePointer = (pointer: string) => {
  return pointer
    .replace(new RegExp('~1', 'g'), '/')
    .replace(new RegExp('~0', 'g'), '~');
};

export {
  decodePointer,
};
