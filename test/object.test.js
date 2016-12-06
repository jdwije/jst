import chai from 'chai';
import { contains, map, merge, iterate } from '../src/object';

const expect = chai.expect;

describe('native object literal extensions', () => {
  it('can iterate an object correctly', () => {
    const fixture = {
      key1: 1,
      key2: 2,
      key3: 3,
    };

    iterate(fixture, (key, value) => {
      expect(value).to.eq(fixture[key]);
    });
  });

  it('can map an objects properties', () => {
    const fixture = {
      foo: 'bar',
    };

    expect(map(fixture, (k, v) => 'foo')).to.deep.eq({
      foo: 'foo',
    });
  });

  it('can guard overide during a deep merge', () => {
    const fixedTime = new Date().toISOString();
    const list = {
      id: '#123',
      items: [{
        content: 'do the things',
      }, {
        content: 'do the things',
      }],
      created: fixedTime,
    };
    const otherList = {
      id: '#321',
      items: [{
        content: 'do some things',
      }, {
        content: 'do nothing',
      }],
      created: new Date().toISOString(),
    };

    expect(merge(list, otherList)).to.deep.eq({
      id: '#123',
      items: [{
        content: 'do the things',
      }, {
        content: 'do the things',
      }],
      created: fixedTime,
    });
  });

  it('can overide properties during a deep merge', () => {
    const a = {
      foo: 'test',
      bar: {
        foo: 'test',
      },
    };
    const b = {
      bar: {
        foo: 'bingo',
      },
    };
    const cnf = { overide: true };

    expect(merge(a, b, true)).to.deep.eq({
      foo: 'test',
      bar: {
        foo: 'bingo',
      },
    });
  });
});
