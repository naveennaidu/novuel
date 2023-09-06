import { getServerSession } from "#auth";
import { z, parseParamsAs } from "@sidebase/nuxt-parse";

const paramSchema = z.object({
  documentId: z
    .string()
    .optional()
    .transform((value) => Number(value)),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { documentId } = parseParamsAs(event, paramSchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
      userId: session.user.id,
    },
  });
  if (!document) {
    throw createError({ statusMessage: "Not Found", statusCode: 404 });
  }
  return { document };
});
