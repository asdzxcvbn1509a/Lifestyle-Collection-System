import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin1234', 10);
  const userPass = await bcrypt.hash('user1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      username: 'admin',
      passwordHash: adminPass,
      displayName: 'Administrator',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      email: 'user@demo.com',
      username: 'demo',
      passwordHash: userPass,
      displayName: 'Demo User',
      role: 'USER',
    },
  });

  // Seed sample categories + items for the demo user only if they have none.
  const existing = await prisma.category.count({ where: { ownerId: user.id } });
  if (existing === 0) {
    const samples = [
      {
        name: 'Coffee Shops',
        icon: 'Coffee',
        detail: 'Cafés worth revisiting',
        items: [
          { name: 'Blue Bottle', detail: 'Great pour-over', rating: 5, isFavorite: true },
          { name: 'Local Roasters', detail: 'Cozy corner spot', rating: 4 },
        ],
      },
      {
        name: 'Books',
        icon: 'BookOpen',
        detail: 'Reading list',
        items: [
          { name: 'Atomic Habits', detail: 'Habits & systems', rating: 5, isFavorite: true },
          { name: 'Deep Work', detail: 'On focus', rating: 4 },
          { name: 'The Pragmatic Programmer', detail: 'Classic dev book', rating: 5 },
        ],
      },
      {
        name: 'Workouts',
        icon: 'Dumbbell',
        detail: 'Gym & home routines',
        items: [
          { name: 'Push day', detail: 'Chest / shoulders / triceps', rating: 3 },
          { name: 'Morning run', detail: '5 km easy pace', rating: 4, isFavorite: true },
        ],
      },
    ];

    for (const s of samples) {
      await prisma.category.create({
        data: {
          name: s.name,
          icon: s.icon,
          detail: s.detail,
          ownerId: user.id,
          items: { create: s.items.map((it) => ({ ...it, ownerId: user.id })) },
        },
      });
    }
  }

  // Default system settings (UC-10).
  const defaults = {
    siteName: 'Lifestyle Collection',
    allowRegistration: 'true',
    maintenanceMode: 'false',
  };
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.systemSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  console.log('Seed complete.');
  console.log(`   Admin: admin@demo.com / admin1234 (id ${admin.id})`);
  console.log(`   User:  user@demo.com  / user1234  (id ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
