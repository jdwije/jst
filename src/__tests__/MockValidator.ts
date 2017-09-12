import * as Ajv from 'ajv';

import * as address from './fixture/address+v1.schema.json';
import * as addressOverride from './fixture/address-override+v1.schema.json';
import * as circular from './fixture/circular.schema.json';
import * as conditional from './fixture/conditional.schema.json';
import * as credentials from './fixture/credentials+v1.schema.json';
import * as editPerson from './fixture/edit-person+v1.schema.json';
import * as person from './fixture/person+v1.schema.json';
import * as profile from './fixture/profile+v1.schema.json';

/**
 * A validation helper for our test schema.
 */
export class MockValidator {
  public schema: object[] = [];
  private ajv;

  constructor(config: object = {}) {
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
      ...config,
    };
    this.ajv = new Ajv(cnf);
    this.load(schema);
  }

  load(schema: object[]) {
    schema.map((scm) => {
      this.ajv.addSchema(scm);
      this.schema.push(scm);
    });

    return this;
  }

  getSchema(id: string): object | undefined {
    const lookup = this.ajv.getSchema(id);

    return !lookup ? undefined : lookup.schema;
  }
}
