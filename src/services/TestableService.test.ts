import 'jest';
import { TestableService } from './TestableService';

test('add() return the correct result', () => {
  const sut = new TestableService();
  const result = sut.add(5, 2);
  expect(result).toEqual(7);
});

test('addAsync() return the correct result', (done) => {
  const sut = new TestableService();
  const result = sut.addAsync(5, 2, (result) => {
    expect(result).toEqual(7);
    done();
  });
});

test('addPromise() return correct result', () => {
  const sut = new TestableService();

  expect.assertions(1);

  return sut.addPromise(4, 1).then((result: number) => {
    expect(result).toEqual(5);
  });
});

test('addPromise() catch expected error', () => {
  const sut = new TestableService();

  expect.assertions(1);

  return sut
    .addPromise(8, 1)
    .then((result: number) => {
      expect(result).toEqual(9);
    })
    .catch((e: Error) => {
      expect(e.message).toEqual('Forced reject when result = 9');
    });
});
