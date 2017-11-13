import { expect } from 'chai';
import { encodePointer } from './../index';

describe('@jdw/jst/encodePointer', () => {
  it('can encode the / character', () => {
    expect(encodePointer('foo/bar')).to.eq('foo~1bar');
    expect(encodePointer('/foo/bar')).to.eq('~1foo~1bar');
  });

  it('can encode the ~ character', () => {
    expect(encodePointer('~home')).to.eq('~0home')
    expect(encodePointer('~hello~goodbye')).to.eq('~0hello~0goodbye')
  });

  it('can encode both the ~  and / characters in the one string', () => {
    expect(encodePointer('~/home')).to.eq('~0~1home')
  });
});
