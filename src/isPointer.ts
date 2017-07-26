const isPointer = (input: string): boolean => {
  if (typeof input !== 'string') return false;
  else if (input === '') return true;
  else if (input.match(/^#|^\//) !== null) return true;
  else return false;
}

export default isPointer;
