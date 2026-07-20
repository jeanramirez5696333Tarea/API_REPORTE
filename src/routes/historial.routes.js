import { Router } from 'express';
import { registrarSolucion, getHistorialPorPersonal } from '../controladores/historialCtrl.js';
import upload from '../middlewares/uploads.js';

const router = Router();

// La ruta será POST /api/historial/registrar
router.post(
  '/registrar',
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'url_imagen', maxCount: 1 }
  ]),
  registrarSolucion
);
router.get('/historial-personal/:id_personal', getHistorialPorPersonal);

export default router;