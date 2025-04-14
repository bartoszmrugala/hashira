type BuildArray<
  Length extends number,
  Arr extends unknown[] = [],
> = Arr["length"] extends Length ? Arr : BuildArray<Length, [...Arr, unknown]>;

type Sum<A extends number, B extends number> = [
  ...BuildArray<A>,
  ...BuildArray<B>,
]["length"];

type Add<A extends number, B extends number> = Sum<A, B> extends number
  ? Sum<A, B>
  : never;

type Increment<N extends number> = Add<N, 1>;

/**
 * Type that represents range of numbers from `start` to `end - 1` as an array.
 * Please keep in mind that this WILL cause issues if negative numbers are passed.
 * @example
 * type MyRange = Range<0, 5>;
 * // MyRange: [0, 1, 2, 3, 4]
 * @param Start - The starting number (inclusive).
 * @param End - The ending number (exclusive).
 * @returns An array of numbers from `start` to `end - 1`.
 */
export type Range<
  Start extends number,
  End extends number,
  Acc extends number[] = [],
> = Start extends End ? Acc : Range<Increment<Start>, End, [...Acc, Start]>;

/**
 * Returns an array of numbers from `start` to `end - 1`.
 * Please keep in mind that this WILL cause type issues if negative numbers are passed.
 *
 * @example
 * const result = range(0, 5);
 * // result: [0, 1, 2, 3, 4]
 * const result2 = range(2, 6);
 * // result2: [2, 3, 4, 5]
 *
 * @param start - The starting number (inclusive).
 * @param end - The ending number (exclusive).
 * @returns An array of numbers from `start` to `end - 1`.
 */
export function range<Start extends number, End extends number>(
  start: Start,
  end: End,
): Range<Start, End> {
  if (start < 0 || end < 0) {
    throw new Error("Range bounds must be non-negative integers");
  }

  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }

  return result as Range<Start, End>;
}

export type RangeUnion<Start extends number, End extends number> = Start extends End
  ? never
  : Start | RangeUnion<Increment<Start>, End>;

type RangeObjectType<Start extends number, End extends number, T> = {
  [K in RangeUnion<Start, End>]: T;
};

/**
 * Creates an object with keys from `start` to `end - 1` and values generated by the `mapper` function.
 * Please keep in mind that this WILL cause issues if negative numbers are passed.
 * @example
 * const result = rangeObject(0, 3, (i) => i * 2);
 * // result: { 0: 0, 1: 2, 2: 4 }
 *
 * @param start - The starting number (inclusive).
 * @param end  - The ending number (exclusive).
 * @param mapper - A function that takes a number and returns a value of type `T`.
 * @returns An object with keys from `start` to `end - 1` and values generated by the `mapper` function.
 *
 */
export function rangeObject<Start extends number, End extends number, T>(
  start: Start,
  end: End,
  mapper: (i: RangeUnion<Start, End>) => T,
): RangeObjectType<Start, End, T> {
  if (start < 0 || end < 0) {
    throw new Error("Range bounds must be non-negative integers");
  }

  const result = {} as RangeObjectType<Start, End, T>;

  for (let i = start as RangeUnion<Start, End>; i < end; i++) {
    result[i] = mapper(i);
  }

  return result;
}
