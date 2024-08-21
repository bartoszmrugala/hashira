import { relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { currency } from "./economy";
import { wallet } from "./economy/wallet";
import { mute, warn } from "./moderation";
import { userTextActivity } from "./userTextActivity";

export const verificationLevel = pgEnum("verification_level", [
  "13_plus",
  "16_plus",
  "18_plus",
]);

export const user = pgTable("users", {
  id: text("id").primaryKey(),
  verificationLevel: verificationLevel("verificationLevel"),
  marriedTo: text("marriedTo")
    .references((): AnyPgColumn => user.id)
    .default(sql`null`),
  marriedAt: timestamp("marriedAt"),
});

export const userRelations = relations(user, ({ many }) => ({
  textActivities: many(userTextActivity),
  wallets: many(wallet),
  currencies: many(currency),
  receivedWarns: many(warn, { relationName: "warnedUser" }),
  givenWarns: many(warn, { relationName: "moderator" }),
  receivedMutes: many(mute, { relationName: "mutedUser" }),
  givenMutes: many(mute, { relationName: "moderator" }),
}));
