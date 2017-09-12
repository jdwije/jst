import { expect } from 'chai';
import { get } from './../index';

describe('@jdw/jst/get', () => {
  const fixture = {
    foo: {
      bar: 20,
    },
    '/': {
      '~': 400,
      bar: {
        '~': 10
      }
    },
    arr: [{
      arr: [{
        foo: 100,
      }]
    }, 30]
  };

  it('should resolve valid JSON pointers', () => {
    const cases = [
      ['/foo/bar', 20],
      ['#/foo/bar', 20],
      ['', fixture],
    ];
    cases.forEach((t) => {
      expect(get(fixture, t[0].toString())).to.eq(t[1]);
    });
  });

  it('can resolve the encoded values of the / and ~ symbols correctly', () => {
    const cases = [
      ['#/~1/~0', 400],
      ['#/~1/bar/~0', 10],
    ];
    cases.forEach((t) => {
      expect(get(fixture, t[0].toString())).to.eq(t[1]);
    });
  });

  it('can resolve JSON pointers that reference array indexes correctly', () => {
    const cases = [
      ['#/arr/0/arr/0/foo', 100],
      ['#/arr/1', 30],
    ];
    cases.forEach((t) => {
      expect(get(fixture, t[0].toString())).to.eq(t[1]);
    });
  });

  it('should throw an error up-front when providing an invalid json pointer', () => {
    const cases = [
      'abcd',
      '~#/foo/bar',
      'foo/bar',
    ];

    cases.forEach((t) => {
      expect(() => get(fixture, t)).to.throw();
    });
  });
});
