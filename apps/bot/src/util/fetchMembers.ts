import { Collection, type GuildMember, type UserResolvable } from "discord.js";
import { chunk } from "es-toolkit";

// TODO: holy, this type is a mess, we probably should only take in fetch method by itself
export async function fetchMembers(
  guild: {
    members: {
      fetch: (options: { user: UserResolvable[] }) => Promise<
        Collection<string, GuildMember>
      >;
    };
  },
  users: string[],
): Promise<Collection<string, GuildMember>> {
  const members = chunk(users, 100).map((chunk) =>
    guild.members.fetch({ user: chunk }),
  );
  const resolvedMembers = await Promise.all(members);

  return new Collection<string, GuildMember>().concat(...resolvedMembers);
}
