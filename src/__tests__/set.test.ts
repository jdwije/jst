import { expect } from 'chai';
import { set } from './../index';

describe('@jdw/jst/set', () => {
  const fixture = {
    array: [1, 2, null],
    object: {
      foo: null,
      array: [{ foo: null }, null]
    },
    foo: null,
  };

  it('can set an property on an object', () => {
    set(fixture, '#/foo', 'bar');
    expect(fixture.foo).to.eq('bar');
  });

  it('can set an index on an array', () => {
    set(fixture, '#/array/2', 3);
    expect(fixture.array[2]).to.eq(3);
  });

  it('can set an property on a nested object', () => {
    set(fixture, '#/object/foo', 'bar');
    expect(fixture.object.foo).to.eq('bar');
  });

  it('can set an property on a nested array', () => {
    set(fixture, '#/object/array/1', 'bar');
    expect(fixture.object.array[1]).to.eq('bar');
  });

  it('can set an property on an object in an array', () => {
    set(fixture, '#/object/array/0/foo', 'bar');
    expect(fixture.object.array[0].foo).to.eq('bar');
  });
});
