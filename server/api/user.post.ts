import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = await prisma?.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (user) {
    return { user };
  }
  const newUser = await prisma?.user.create({
    data: {
      email: body.email,
    },
  });

  if (newUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "User not created",
    });
  }

  return { user: newUser };
});
