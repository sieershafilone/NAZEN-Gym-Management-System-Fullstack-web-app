const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Starting cleanup...');

    // Delete records in reverse order of dependency
    console.log('🗑️ Deleting Payments...');
    const deletedPayments = await prisma.payment.deleteMany();
    console.log(`✅ Deleted ${deletedPayments.count} payments`);

    console.log('🗑️ Deleting Memberships...');
    const deletedMemberships = await prisma.membership.deleteMany();
    console.log(`✅ Deleted ${deletedMemberships.count} memberships`);

    console.log('🗑️ Deleting Membership Plans...');
    const deletedPlans = await prisma.membershipPlan.deleteMany();
    console.log(`✅ Deleted ${deletedPlans.count} plans`);

    console.log('\n✨ Cleanup completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Cleanup error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
