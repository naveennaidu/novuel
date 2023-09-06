import { getServerSession } from "#auth";
import { z, parseQueryAs } from "@sidebase/nuxt-parse";

const querySchema = z.object({
  folderId: z
    .string()
    .optional()
    .transform((value) => Number(value)),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { folderId } = parseQueryAs(event, querySchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const folders = await prisma.folder.findMany({
    where: {
      userId: session.user.id,
      parentFolderId: folderId,
    },
  });

  const documents = await prisma.document.findMany({
    where: {
      userId: session.user.id,
      folderId: folderId,
    },
  });

  let files: {
    id: number;
    title: string;
    type: "folder" | "document";
    updatedAt: Date;
  }[] = [];

  folders.forEach((folder) => {
    files.push({
      id: folder.id,
      title: folder.name,
      type: "folder",
      updatedAt: folder.updatedAt,
    });
  });

  documents.forEach((document) => {
    files.push({
      id: document.id,
      title: document.title,
      type: "document",
      updatedAt: document.updatedAt,
    });
  });

  return { files };
});
