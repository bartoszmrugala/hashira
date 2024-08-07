import * as v from "valibot";

const ID = v.pipe(v.string(), v.regex(/^\d{17,19}$/));

const SpaceSeparatedArray = <
  TInput extends v.BaseSchema<string, unknown, v.BaseIssue<unknown>>,
>(
  matcher: TInput,
) =>
  v.pipe(
    v.string(),
    v.transform((value) => value.split(" ")),
    v.array(matcher),
  );

const Bool = v.pipe(
  v.union([v.literal("true"), v.literal("false")]),
  v.transform((value) => value === "true"),
);

const Env = v.object({
  BOT_CLIENT_ID: ID,
  BOT_DEVELOPER_GUILD_IDS: SpaceSeparatedArray(ID),
  BOT_TOKEN: v.string(),
  SENTRY_DSN: v.optional(v.string()),
  DATABASE_URL: v.pipe(v.string(), v.url()),
  DATABASE_TEST_URL: v.pipe(v.string(), v.url()),
});

export default v.parse(Env, process.env);
