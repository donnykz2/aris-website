import prisma from './prisma';

async function deleteUserOrWaitlist(email: string) {
  // Delete from User table
  await prisma.user.deleteMany({ where: { email } });
  // Delete from Waitlist table
  await prisma.waitlist.deleteMany({ where: { email } });
}

// Run the deletion for 'ngaluafeansley@gmail.com'
deleteUserOrWaitlist('ngaluafeansley@gmail.com')
  .then(() => {
    console.log('Deleted ngaluafeansley@gmail.com from User and Waitlist tables.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
