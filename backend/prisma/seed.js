import prisma from '../src/config/db.js';

async function main() {
  const roles = [
    { name: 'CLIENT', description: 'Usuario final que reserva espacios' },
    { name: 'OWNER', description: 'Propietario que publica y gestiona espacios' },
    { name: 'ADMIN', description: 'Administrador general de la plataforma' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  const amenities = ['Fibra Óptica', 'Proyector 4K', 'Pizarra Acrílica', 'Café Ilimitado', 'Aire Acondicionado'];
  for (const name of amenities) {
    await prisma.amenity.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Seed completado: Roles (CLIENT, OWNER, ADMIN) y Amenidades creados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });