import { Router } from 'express';
import { registrarSolucion, getHistorialPorPersonal } from '../controladores/historialCtrl.js';
import upload from '../middlewares/uploads.js';

const router = Router();

// La ruta será POST /api/historial/registrar
router.post('/registrar', upload.any(), registrarSolucion);
router.get('/historial-personal/:id_personal', getHistorialPorPersonal);

export default router;