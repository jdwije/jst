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
    const schema = args[0];
    const definitions = contains(schema, 'definitions') ? schema.definitions : null;

    // traverse is an internal recursive function that we bind to this lexical
    // scope in order to easily get to schema definitons whilst traversing an
    // objects nested properties. This is primarily for efficiency concerns.
    const traverse = (node) => {
      let resolution = {};

      if (typeof node !== 'object') return node;

      // if only one argument is provided and it is an array we must recursively
      // resolve it's individual values
      if (Array.isArray(node)) {
        return node.map((v) => traverse(v));
      }

      // if we are here, the first argument is not an array or value and we expect
      // it to be a json schema.
      iterate(node, (key, value) => {
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

            reference = definitions[pieces[pieces.length - 1]];
            resolution = merge(
              resolution,
              traverse(reference),
              true
            );
          } else {
            reference = get(value);
            resolution = merge(
              resolution,
              resolve(get, reference),
              true
            );
          }

          if (!reference)
            throw new ReferenceError(`Could not find a reference to ${value}`);
        }
        // Otherwise the value is an array or object and we need to traverse it
        // and dereference it's properties.
        else {
          resolution[key] = traverse(value);
        }
      });

      return resolution;
    };

    return traverse(schema);
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
    // right to left - ie: properties in args[2] will override duplicate
    // properties in args[1] which in turn would override duplicates in schema
    // the base schema.
    return schema.reduce((accumulator, value) => merge(accumulator, value, true), {});
  }
  else {
    throw new TypeError('One or more arguments was expected');
  }
};

export default resolve;
