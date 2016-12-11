import chai from 'chai';
import { dereference, contains } from '../src/index';
import Validator from './MockValidator';

const expect = chai.expect;
const validator = new Validator();

/**
 * A resolve function must simply take a schema id as an argument and return
 * that schema as an object literal or throw an error if it can't find it.
 */
const resolve = (id) => {
  const result = validator.getSchema(id);

  if (!contains(result, 'schema'))
    throw new Error(`could not resolve schema with id: ${id}`);

  return result.schema;
};

describe('dereference schema utility function', () => {
  it('dereferences referenced schema correctly', () => {
    const ast = dereference(resolve('http://footown.com/generic/address#'), resolve);

    expect(ast.properties).to.have.property('addressLines');
    expect(ast.properties).to.have.property('contact');
    expect(ast.properties.contact).to.have.property('properties');
    expect(ast.properties.contact.properties).to.have.property('firstname');
    expect(ast.properties.contact.properties).to.have.property('lastname');
    expect(ast.properties.contact.properties).to.have.property('title');
  });

  it('dereferences schema correctly with multiple arguments', () => {
    const schema = [
      resolve('http://footown.com/generic/address#'),
      resolve('http://footown.com/generic/address-override#'),
    ];
    const ast = dereference(schema, resolve);

    expect(ast.properties).to.have.property('addressLines');
    expect(ast.properties).to.have.property('country');
    expect(ast.properties.country).to.have.property('enum');
    expect(ast.properties.country.enum).to.deep.eq(['AU', 'GB', 'VN', 'DE', 'CH']);
    expect(ast.properties).to.have.property('contact');
    expect(ast.properties.contact).to.have.property('properties');
    expect(ast.properties.contact.properties).to.have.property('firstname');
    expect(ast.properties.contact.properties).to.have.property('lastname');
    expect(ast.properties.contact.properties).to.have.property('title');
  });

  it('can dereference circular schema references', () => {
    const schema = resolve('http://footown.com/generic/edit-person+v1#');
    const ast = dereference(schema, resolve);

    expect(ast).to.have.property('allOf');
    expect(ast.allOf.length).to.eq(1);
    expect(ast.allOf[0]).to.have.property('properties');
  });
});
