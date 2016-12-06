import Ajv from 'ajv';

/**
 * Validator is a generic & re-usable schema validation system. It's primary
 * purpose is to supply AJV with some given schema set and make it convientent
 * for users to validate JSON objects against the said schema set.
 *
 */
export default class Validator extends Ajv {
  constructor(schema, config = null) {
    // sane default config
    const cnf = {
      extendRefs: true,
      allErrors: true,
    };

    if (config) Object.assign(cnf, config);

    super(cnf);

    // process an array of schema
    if (Array.isArray(schema)) {
      schema.forEach((v) => this.addSchema(v));
    }
    // process a single schema
    else if (typeof schema === 'object') {
      this.addSchema(schema);
    }
    // unknown, throw
    else {
      throw new ArugmentError(`cannot process schema: ${schema}`);
    }
  }
}
