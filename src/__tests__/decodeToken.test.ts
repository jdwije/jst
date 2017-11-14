import { expect } from 'chai';
import { decodeToken } from './../index';

describe('@jdw/jst/decodeToken', () => {
  it('can decode an encoded / character', () => {
    expect(decodeToken('foo~1bar')).to.eq('foo/bar');
    expect(decodeToken('~1foo~1bar')).to.eq('/foo/bar');
  });

  it('can decode an encoded ~ character', () => {
    expect(decodeToken('~0home')).to.eq('~home');
    expect(decodeToken('~0hello~0goodbye')).to.eq('~hello~goodbye');
  });

  it('can decode a mixed ~ and / character string', () => {
    expect(decodeToken('~0~1home')).to.eq('~/home');
  });
});
