const prisma = require('./lib/prisma').default;

async function deleteUserOrWaitlist(name) {
  // Delete from User table
  await prisma.user.deleteMany({ where: { name } });
  // Delete from Waitlist table
  await prisma.waitlist.deleteMany({ where: { name } });
}

// Run the deletion for 'ngaluafeansley'
deleteUserOrWaitlist('ngaluafeansley').then(() => {
  console.log('Deleted ngaluafeansley from User and Waitlist tables.');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
