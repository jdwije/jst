import chai from 'chai';
import { supplier } from '../src/';
import Ajv from 'ajv';
import Validator from './schema/BogusValidator';

const expect = chai.expect;

describe('suppier class', () => {
  it('can be initialised', () => {
    const get = supplier(new Validator());

    expect(get).to.be.a('function');
  });

  it('it can supply a schema', () => {
    const get = supplier(new Validator());

    expect(get).to.be.a('function');

    const schema = get('http://footown.com/generic/address#');

    expect(schema).to.be.an('object');
    expect(schema).to.have.property('properties');
  });
});
