import { expect } from 'chai';
import { dereference } from './../index';
import { resolve } from './lib';

describe('dereference schema utility function', () => {
  it('dereferences referenced schema correctly', () => {
    const ast: any = dereference(resolve('http://footown.com/generic/address#'), resolve);
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
    const ast: any = dereference(schema, resolve);
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
    const ast: any = dereference(schema, resolve);

    expect(ast).to.have.property('allOf');
    expect(ast.allOf.length).to.eq(1);
    expect(ast.allOf[0]).to.have.property('properties');
  });

  it('dereferences null values correctly', () => {
    const schema = resolve('http://footown.com/generic/edit-person+v1#');
    const ast: any = dereference(schema, resolve);
    expect(ast.foo).to.eq(null);
  });

  it('dereferences circular references correctly', () => {
    const schema = resolve('http://footown.com/generic/circular#');
    const ast: any = dereference(schema, resolve);
    expect(ast).to.be.an('object');
  });

  it('dereferences conditional allOf references correctly', () => {
    const schema = resolve('http://footown.com/generic/conditional#');
    const ast: any = dereference(schema, resolve);
    expect(ast).to.be.an('object');
    expect(ast.allOf[0]).deep.eq({
      type: 'object',
      properties: {
        foobar: {
          type: 'string',
          minLength: 1,
        },
      },
    });
    expect(ast.allOf[1]).deep.eq({
      type: 'object',
      properties: {
        barfoo: {
          type: 'number',
        },
      },
    });
  });

  it('can dereference referenced circular schema correctly', () => {
    const schema = require('./fixture/circular-referenced.schema.json');

    const ast: any = dereference(schema, resolve);

    expect(ast).to.be.an('object');
    expect(ast.properties.circular.properties.circle.id).to.eq('http://footown.com/generic/circular#');
  });

  it('dereferences without a resolver', () => {
    const schema = require('./fixture/profile+v1.schema.json');

    const ast: any = dereference(schema);
    expect(ast).to.be.an('object');
    expect(ast.properties.profile).deep.eq({
      type: 'object',
      properties: {
        avatarUrl: {
          description: 'The url that the users avatar can be found on',
          type: 'string',
          format: 'uri',
        },
        pictures: {
          type: 'array',
          items: [
            {
              type: 'string',
              format: 'uri',
            },
          ],
        },
      },
    });
  });

  it('fails when attempting to dereference remote references without a resolver', () => {
    const schema = require('./fixture/address+v1.schema.json');

    expect(() => dereference(schema)).to.throw('argument: resolver is required to dereference a json uri.');
  });
});
