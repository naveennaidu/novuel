import { getServerSession } from "#auth";
import { z, parseQueryAs } from "@sidebase/nuxt-parse";

const querySchema = z.object({
  parentFolderId: z
    .string()
    .optional()
    .transform((value) => Number(value)),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const query = parseQueryAs(event, querySchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const folders = await prisma.folder.findMany({
    where: {
      userId: session.user.id,
      parentFolderId: query.parentFolderId,
    },
  });
  return { folders };
});
