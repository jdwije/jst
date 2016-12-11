import chai from 'chai';
import { dereference, supplier } from '../src/index';
import Validator from './schema/BogusValidator';

const expect = chai.expect;

describe('dereference function', () => {
  it('dereferences referenced schema correctly', () => {
    const get = supplier(new Validator());
    const schema = get('http://footown.com/generic/address#');
    const ast = dereference(get, schema);

    expect(ast.properties).to.have.property('addressLines');
    expect(ast.properties).to.have.property('contact');
    expect(ast.properties.contact).to.have.property('properties');
    expect(ast.properties.contact.properties).to.have.property('firstname');
    expect(ast.properties.contact.properties).to.have.property('lastname');
    expect(ast.properties.contact.properties).to.have.property('title');
  });

  it('dereferences schema correctly with multiple arguments', () => {
    const get = supplier(new Validator());
    const schema = get('http://footown.com/generic/address#');
    const override = get('http://footown.com/generic/address-override#');
    const ast = dereference(get, schema, override);

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

  it('can dereference nested referenced schema', () => {
    const get = supplier(new Validator());
    const schema = get('http://footown.com/generic/edit-person+v1#');
    const ast = dereference(get, schema);

    expect(ast).to.have.property('allOf');
    expect(ast.allOf.length).to.eq(1);
    expect(ast.allOf[0]).to.have.property('properties');
  });
});
