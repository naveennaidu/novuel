import { getServerSession } from "#auth";
import { z, parseBodyAs } from "@sidebase/nuxt-parse";

const bodySchema = z.object({
  folderId: z
    .string()
    .optional()
    .transform((value) => Number(value)),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const body = await parseBodyAs(event, bodySchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const document = await prisma.document.create({
    data: {
      userId: session.user.id,
      title: "",
      content: "",
      folderId: body.folderId,
    },
  });
  return { document };
});
