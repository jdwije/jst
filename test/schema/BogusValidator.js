import Validator from '../../src/Validator';
import fs from 'fs';

/**
 * A validation helper for our bogus schema.
 */
export default class BogusValidator extends Validator {
  constructor() {
    const filepaths = [
      './person+v1.schema.json',
      './address+v1.schema.json',
    ];
    const schema = filepaths.map((v) => require(v));
    // call base object contructor with loaded JSON schema
    super(schema);
  }
}
