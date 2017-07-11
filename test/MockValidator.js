import Validator from '../src/Validator';
import fs from 'fs';

/**
 * A validation helper for our test schema.
 */
export default class MockValidator extends Validator {
  constructor() {
    const filepaths = [
      './schema/address+v1.schema.json',
      './schema/address-override+v1.schema.json',
      './schema/circular.schema.json',
      './schema/credentials+v1.schema.json',
      './schema/edit-person+v1.schema.json',
      './schema/person+v1.schema.json',
      './schema/profile+v1.schema.json',
    ];
    const schema = filepaths.map((v) => require(v));
    // call base object contructor with loaded JSON schema
    super(schema);
  }
}
