import { expect } from 'chai';
import { encodeToken } from './../index';

describe('@jdw/jst/encodeToken', () => {
  it('can encode the / character', () => {
    expect(encodeToken('foo/bar')).to.eq('foo~1bar');
    expect(encodeToken('/foo/bar')).to.eq('~1foo~1bar');
  });

  it('can encode the ~ character', () => {
    expect(encodeToken('~home')).to.eq('~0home');
    expect(encodeToken('~hello~goodbye')).to.eq('~0hello~0goodbye');
  });

  it('can encode both the ~  and / characters in the one string', () => {
    expect(encodeToken('~/home')).to.eq('~0~1home');
  });
});
