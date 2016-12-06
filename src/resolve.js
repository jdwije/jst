require('./object'); // loads extension to the native JS object literal type.

const setProperties = (obj) => {
  if (!obj.hasOwnProperty('properties')) obj.properties = {};

  return obj;
};

const resolver = (schema, ajv, definitions) => {
  let compiledSchema = {};
  const baseSchema = schema;

  // handle static values
  if (typeof schema !== 'object' && !Array.isArray(schema)) {
    return schema;
  }

  // handle arrays
  else if (Array.isArray(schema)) {
    return schema.map((v) => resolver(v, ajv, definitions));
  }

  // otherwise handle object
  baseSchema.iterate((key, value) => {
    if (key === 'properties') {
      if (!compiledSchema.hasOwnProperty('properties'))
        compiledSchema.properties = {};

      compiledSchema.properties = resolver(value, ajv, definitions);
    }

    // resolverd referenced schema
    else if (key === '$ref') {
      // check for local definition
      if (value.indexOf('#/definitions') === 0) {
        const pieces = value.split('/');
        compiledSchema = compiledSchema.merge(
          resolver(
            definitions[pieces[pieces.length - 1]],
            ajv,
            definitions
          )
        );
      }
      // otherwise assume schema ID definition to be fetched from the supplier.
      else {
      const ast = resolver(value, ajv);

        compiledSchema = compiledSchema.merge(ast);
      }
    }

    // resolver validation keywords
    else if (key === 'oneOf' || key === 'anyOf' || key === 'allOf') {
      // compiledSchema.properties = {};
      // match array of validation
      if (Array.isArray(value)) {
        compiledSchema[key] = value.map((el) => {
          return resolver(el, ajv, definitions);
        });
      }
      // otherwise assume validation object
      else {
        compiledSchema[key] = resolver(value, ajv, definitions);
      }
    }

    // else resolver named properties
    else {
      compiledSchema[key] = resolver(value, ajv, definitions);
    }
  });

  return compiledSchema;
};

/**
 * Parses a schema by fetching its dependencies and flattening them into
 * a single schema object. This is in itself an AST. Schema are expected
 * to be available for fetching from there id URL.
 */
const resolve = (id, ajv) => {
  let baseSchema;

  if (typeof id === 'string') {
    baseSchema = ajv.getSchema(id).schema;
  } else if (typeof id === 'object') {
    baseSchema = id;
  } else {
    throw new ArgumentError(
      'Schema argument must be either a valid schema ID or an raw schema object.');
  }

  const compiledSchema = {};

  const definitions = baseSchema.definitions || null;

  baseSchema.iterate((key, value) => {
    // resolve properties
    if (key === 'properties') {
      compiledSchema.properties = resolve(value, ajv, definitions);
    }
    // ignore definitions we don't want these
    else if (key === 'definitions') {}
    // handle validation keywords
    else if (key === 'allOf' || key === 'oneOf' || key === 'anyOf') {
      if (Array.isArray(value)) {
        compiledSchema[key] = value.map((v) => resolve(v, ajv, definitions));
      }
      // handle object
      else {
        compiledSchema[key] = resolve(value, ajv, definitions);
      }
    }
    // handle property assignment
    else {
      compiledSchema[key] = resolve(value, ajv, definitions);
    }
  });

  return compiledSchema;
};

export default resolve;
