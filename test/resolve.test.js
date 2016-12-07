import chai from 'chai';
import { resolve } from '../src/index';
import Validator from './schema/BogusValidator';

const expect = chai.expect;

describe('resolve function', () => {
  it('resolves referenced schema correctly', () => {
    const validator = new Validator();
    const schema = validator.getSchema('http://footown.com/generic/address#').schema;
    const ast = resolve(validator, schema);

    expect(ast.properties).to.have.property('addressLines');
    expect(ast.properties).to.have.property('contact');
    expect(ast.properties.contact).to.have.property('properties');
    expect(ast.properties.contact.properties).to.have.property('firstname');
    expect(ast.properties.contact.properties).to.have.property('lastname');
    expect(ast.properties.contact.properties).to.have.property('title');
  });

    it('resolves schema correctly with multiple arguments', () => {
    const validator = new Validator();
    const schema = validator.getSchema('http://footown.com/generic/address#').schema;
    const ast = resolve(validator, schema);

    expect(ast.properties).to.have.property('addressLines');
    expect(ast.properties).to.have.property('contact');
    expect(ast.properties.contact).to.have.property('properties');
    expect(ast.properties.contact.properties).to.have.property('firstname');
    expect(ast.properties.contact.properties).to.have.property('lastname');
    expect(ast.properties.contact.properties).to.have.property('title');
  });
});
