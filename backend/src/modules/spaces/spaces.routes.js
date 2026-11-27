import { Router } from 'express';
import { getSpaces, createSpace } from './spaces.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';
import { uploadImages } from '../../middlewares/upload.middleware.js';

const router = Router();

// Público: Listar espacios paginados
router.get('/', getSpaces);

// Protegido: Solo OWNER o ADMIN pueden crear espacios con imágenes
router.post(
  '/',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  uploadImages.array('images', 5),
  createSpace
);

export default router;