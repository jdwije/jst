import { MockValidator as Validator } from './MockValidator';

const validator = new Validator();

/**
 * A resolve function must simply take a schema id as an argument and return
 * that schema as an object literal or throw an error if it can't find it.
 */
const mockResolve = (id) => {
  const result = validator.getSchema(id);

  if (!result) {
    throw new Error(`could not resolve schema with id: ${id}`);
  }

  return result;
};

export { mockResolve };
