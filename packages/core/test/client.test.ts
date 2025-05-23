import { describe, test } from "bun:test";
import type { Prettify } from "@hashira/utils/types";
import { expectTypeOf } from "expect-type";
import { Hashira, type decoratorInitBase } from "../src";
import type { BaseDecorator } from "../src/types";

type CreateDecorators<T extends Partial<BaseDecorator>> = Prettify<
  typeof decoratorInitBase & T
>;

describe("Hashira", () => {
  const bar = new Hashira({ name: "bar" }).state("bux", 1);
  const foo = new Hashira({ name: "foo" })
    .const("foo", 1)
    .state("bar", 2)
    .derive(({ foo }) => ({ baz: foo + 1 }));
  const baz = new Hashira({ name: "baz" }).use(bar).state("baz", 3);

  test("should be able to chain const, derive, and state", () => {
    expectTypeOf(bar).toEqualTypeOf<
      Hashira<CreateDecorators<{ state: { bux: number } }>>
    >();

    expectTypeOf(foo).toEqualTypeOf<
      Hashira<
        CreateDecorators<{
          state: { bar: number };
          const: { foo: 1 };
          derive: { readonly baz: number };
        }>
      >
    >();
  });

  test("should be able to use another Hashira instance", () => {
    expectTypeOf(baz).toEqualTypeOf<
      Hashira<
        CreateDecorators<{
          state: { bux: number; baz: number };
        }>
      >
    >();
  });
});
