import { expect } from 'chai';
import { setPointer } from './../src/index';

describe('@jdw/jst/setPointer', () => {
  const fixture = {
    array: [1, 2, null],
    object: {
      foo: null,
      array: [{ foo: null }, null]
    },
    foo: null,
  };

  it('can set an property on an object', () => {
    setPointer(fixture, '#/foo', 'bar');
    expect(fixture.foo).to.eq('bar');
  });

  it('can set an index on an array', () => {
    setPointer(fixture, '#/array/2', 3);
    expect(fixture.array[2]).to.eq(3);
  });

  it('can set an property on a nested object', () => {
    setPointer(fixture, '#/object/foo', 'bar');
    expect(fixture.object.foo).to.eq('bar');
  });

  it('can set an property on a nested array', () => {
    setPointer(fixture, '#/object/array/1', 'bar');
    expect(fixture.object.array[1]).to.eq('bar');
  });

  it('can set an property on an object in an array', () => {
    setPointer(fixture, '#/object/array/0/foo', 'bar');
    expect(fixture.object.array[0].foo).to.eq('bar');
  });
});
