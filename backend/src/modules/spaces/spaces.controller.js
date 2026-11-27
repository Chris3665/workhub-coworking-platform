import prisma from '../../config/db.js';

// GET /api/spaces?page=1&limit=6
export const getSpaces = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 6);
    const skip = (page - 1) * limit;

    const [total, spaces] = await Promise.all([
      prisma.space.count(),
      prisma.space.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: true,
          owner: { select: { id: true, fullName: true, email: true } },
          amenities: { include: { amenity: true } },
        },
      }),
    ]);

    res.json({
      data: spaces,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener espacios', error: error.message });
  }
};

// POST /api/spaces (Protegido: Solo OWNER y ADMIN, multipart/form-data)
export const createSpace = async (req, res) => {
  try {
    const { name, description, address, capacity, hourlyRate, dailyRate } = req.body;
    const files = req.files || [];

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imagesData = files.map((file, index) => ({
      url: `${baseUrl}/uploads/${file.filename}`,
      isPrimary: index === 0,
    }));

    const newSpace = await prisma.space.create({
      data: {
        ownerId: req.user.id,
        name,
        description,
        address,
        capacity: parseInt(capacity),
        hourlyRate: parseFloat(hourlyRate),
        dailyRate: parseFloat(dailyRate),
        status: 'APPROVED', // Aprobado por defecto en Fase 2 para lucir en el catálogo
        images: {
          create: imagesData,
        },
      },
      include: { images: true },
    });

    res.status(201).json({
      message: 'Espacio creado exitosamente',
      data: newSpace,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el espacio', error: error.message });
  }
};