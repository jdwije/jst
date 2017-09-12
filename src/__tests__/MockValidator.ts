import * as Ajv from 'ajv';

const address = require('./fixture/address+v1.schema.json');
const addressOverride = require('./fixture/address-override+v1.schema.json');
const circular = require('./fixture/circular.schema.json');
const conditional = require('./fixture/conditional.schema.json');
const credentials = require('./fixture/credentials+v1.schema.json');
const editPerson = require('./fixture/edit-person+v1.schema.json');
const person = require('./fixture/person+v1.schema.json');
const profile = require('./fixture/profile+v1.schema.json');

/**
 * A validation helper for our test schema.
 */
export default class MockValidator {
  public schema: Array<Object> = [];
  private ajv;

  constructor(config: Object = {}) {
    const schema = [
      address,
      addressOverride,
      circular,
      conditional,
      credentials,
      editPerson,
      person,
      profile,
    ];
    const cnf = {
      extendRefs: true,
      allErrors: true,
      ...config
    };
    this.ajv = new Ajv(cnf);
    this.load(schema);
  }

  load(schema: Array<Object>) {
    schema.map((scm) => {
      this.ajv.addSchema(scm)
      this.schema.push(scm);
    });

    return this;
  }

  getSchema(id: string): Object | undefined {
    const lookup = this.ajv.getSchema(id);

    return !lookup ? undefined : lookup.schema;
  }
}
