const encodePointer = (pointer: string) => {
  return pointer
    .replace(new RegExp('~', 'g'), '~0')
    .replace(new RegExp('/', 'g'), '~1');
};

export {
  encodePointer,
};
