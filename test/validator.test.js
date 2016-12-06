import chai from 'chai';
import Validator from '../src/Validator';

const expect = chai.expect;
const schema = {
  person: require('./schema/person+v1.schema.json'),
};

describe('Utility Methods', () => {
  it('can be initialised', () => {
    const validator = new Validator(schema.person);

    expect(validator).to.be.an.instanceof(Validator);
  });

  it('can validate schema', () => {
    const validator = new Validator(schema.person);
    const invalidSchema = {
      firtname: 20,
      lastname: null,
    };

    expect(validator.validate(schema.person.id, invalidSchema)).to.eq(false);
    expect(validator.errors).to.be.an('array');
  });
});
