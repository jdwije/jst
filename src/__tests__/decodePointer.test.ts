import { expect } from 'chai';
import { decodePointer } from './../index';

describe('@jdw/jst/decodePointer', () => {
  it('can decode an encoded / character', () => {
    expect(decodePointer('foo~1bar')).to.eq('foo/bar');
    expect(decodePointer('~1foo~1bar')).to.eq('/foo/bar');
  });

  it('can decode an encoded ~ character', () => {
    expect(decodePointer('~0home')).to.eq('~home')
    expect(decodePointer('~0hello~0goodbye')).to.eq('~hello~goodbye')
  });

  it('can decode a mixed ~ and / character string', () => {
    expect(decodePointer('~0~1home')).to.eq('~/home')
  });
});
