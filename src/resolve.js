import { map, merge, iterate, clone, contains } from './index';

/**
 * This function _resolves_ a schema set into one logical schema. Any referenced
 * schema is pulled into the resolved schema, any extensions are applied and
 * resolved in a logical order. The resulting resolved schema can be considered
 * as the base schema with all its extensions applied to it.
 *
 * @param {Object} get A schema supplier function, takes an ID and returns a schema.
 * @param {Array} ...schema A list of schema to resolve.
 * @return {Object} The resolved schema as an object litteral.
 */
const resolve = (get, ...args) => {
  if (args.length === 1) {
    // if only one argument is provided and it is not an object or array we can
    // safely resolve its value.
    if (typeof args[0] !== 'object') return args[0];

    // if only one argument is provided and it is an array we must recursively
    // resolve it's individual values
    if (Array.isArray(args[0])) {
      return args[0].map((v) => {
        if (contains(args[0], 'definitions') && typeof v === 'object' && v !== null) {
          v.definitions = args[0].definitions;
        }
        return resolve(get, v);
      });
    }

    // if we are here, the first argument is not an array or value and we expect
    // it to be a schema.
    const schema = args[0];
    let resolution = {};

    iterate(schema, (key, value) => {
      // Skip the following properties
      if (key === 'definitions') return;

      // If value is not an array, object, or JSON schema reference we can
      // resolve it immediately. 'typeof array' equals 'object' in JS.
      if (typeof value !== 'object' && key !== '$ref') {
        resolution[key] = value;
      }
      // If we have a schema reference we must fetch it, resolve it, then merge
      // it into the base schema object.
      else if (key === '$ref') {
        // We have two types of references - definitions which are defined
        // within the current schema and external schema references which we
        // have to query AJV for as such we must fetch the schema for the
        // reference appropriately.
        let reference = null;

        if (value.indexOf('#/definitions') === 0) {
          // First check where to get the definitions from. If argument
          // 'definitions' is false we expect to be able to get to the
          // definitions from the current schema being iterated.
          const pieces = value.split('/');

          reference = schema.definitions[pieces[pieces.length - 1]];

          if (typeof reference === 'object' && reference !== null)
            reference.definitions = clone(schema.definitions, true);
        } else {
          reference = get(value);
        }

        if (!reference) throw new ReferenceError(`Could not find a reference to ${value}`);

        resolution = merge(
          resolution,
          resolve(get, reference),
          true
        );
      }
      // Otherwise the value is an array or object and we need to traverse it
      // and resolve it's properties.
      else {
        if (contains(schema, 'definitions')) value.definitions = schema.definitions;

        resolution[key] = resolve(get, value);
      }
    });

    return resolution;
  }
  // If multiple args are provided we assume a list of schema. We assume the
  // first schema provided is the base and successive arguments are extensions
  // to it in increasing order of priority.
  else if (args.length > 1) {
    // first validate our arguments assumption!
    args.forEach((v) => {
      if (Object.prototype.toString.call(v) !== '[object Object]')
        throw new TypeError(`expecting an array of object literals found: ${v}`);
    });

    // next we must resolve the individual schema
    const schema = args.map((v) => resolve(get, v));

    // and then we must merge them. schema is the base schema and we merge from
    // left to right - ie: properties in args[2] will override duplicate
    // properties in args[1] which in turn would override duplicates in schema
    // the base schema.
    return schema.reduce((accumulator, value) => merge(accumulator, value, true), {});
  }
  else {
    throw new TypeError('One or more arguments was expected');
  }
};

export default resolve;
