import { getServerSession } from "#auth";
import { z, parseBodyAs } from "@sidebase/nuxt-parse";

const bodySchema = z.object({
  name: z.string(),
  parentFolderId: z.number().optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const body = await parseBodyAs(event, bodySchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const folder = await prisma.folder.create({
    data: {
      userId: session.user.id,
      name: body.name,
      parentFolderId: body.parentFolderId,
    },
  });
  return { folder };
});
