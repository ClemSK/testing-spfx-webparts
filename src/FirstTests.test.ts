// make sure that jest is in the ts config file.

import 'jest';

test('1+1 should equal 2', () => {
  const result: number = 1 + 1;

  //   if (result != 2) {
  //     throw new Error('1+1 expected to equal 2');
  //   }

  expect(result).toEqual(2);
});

test('2+2 should equal 2', (done) => {
  const result: number = 2 + 2;

  expect(result).toEqual(4);
  done();
});

test('async example', (done) => {
  setTimeout(() => {
    expect(7 - 1).toEqual(6);
    done();
  }, 1000);
});
