/**
 * supplier is a default factory method for creating schema supplier for the
 * resolve function. This default implimentation works with AJV however you can
 * create your own. Simle create a function that takes a schema id as an argument,
 * and returns that schema as an object literal.
 *
 * @param {Object} ajv An instance of the Ajv object.
 * @return {Function}  A function which takes a schema id as an arugment and
 *                     returns it as an object literal.
 */
const supplier = (ajv) => (id) => ajv.getSchema(id).schema;

export default supplier;
