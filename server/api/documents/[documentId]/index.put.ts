import { getServerSession } from "#auth";
import { z, parseBodyAs, parseParamsAs } from "@sidebase/nuxt-parse";

const bodySchema = z.object({
  content: z.string(),
});

const paramSchema = z.object({
  documentId: z
    .string()
    .optional()
    .transform((value) => Number(value)),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const body = await parseBodyAs(event, bodySchema);
  const { documentId } = parseParamsAs(event, paramSchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const parsedContent = JSON.parse(body.content);
  let title = "";
  try {
    title = parsedContent.content[0]?.content[0]?.text;
  } catch (error) {}

  const document = await prisma.document.update({
    where: {
      id: documentId,
      userId: session.user.id,
    },
    data: {
      title,
      content: body.content,
    },
  });
  return { document };
});
