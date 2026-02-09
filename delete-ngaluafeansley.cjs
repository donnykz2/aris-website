const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUserAndWaitlist(email) {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.waitlist.deleteMany({ where: { email } });
}

deleteUserAndWaitlist('ngaluafeansley@gmail.com')
  .then(() => {
    console.log('Deleted ngaluafeansley@gmail.com from User and Waitlist tables.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });