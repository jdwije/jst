import { expect } from 'chai';
import { isPointer } from './../index';

describe('@jdw/jst/isPointer', () => {
  const cases = {
    success: ['#', '/', '', '#/foo/bar/baz', '/bar/baz'],
    failure: ['yolo', 123, {}, false, true, null, undefined], //  '#adasd']
  };

  cases.success.forEach((testCase) => {
    it(`can recognize ${JSON.stringify(testCase)} as a pointer`, () => {
      expect(isPointer(testCase)).to.eq(true);
    });
  });

  cases.failure.forEach((testCase) => {
    it(`can recognize ${JSON.stringify(testCase)} is NOT a pointer`, () => {
      expect(isPointer(testCase)).to.eq(false);
    });
  });
});
