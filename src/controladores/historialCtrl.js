import { conmysql } from "../db.js";

export const registrarSolucion = async (req, res) => {
    // 1. Extraemos los datos de forma segura
    const {
        id_reporte,
        id_usuario_cambio,
        comentario,
        url_imagen = ''
    } = req.body || {};

    const archivoSubido = req.files?.file?.[0] || req.files?.url_imagen?.[0] || req.file;

    // 2. Resolver la URL final con prioridad a la enviada por el cliente
    const urlImagenFinal = (
        url_imagen && url_imagen !== 'undefined' && url_imagen !== ''
            ? url_imagen
            : archivoSubido?.path || archivoSubido?.secure_url || null
    );

    try {
        // 3. Insertar en el historial
        const queryHistorial = `
            INSERT INTO historial_reportes (id_reporte, id_usuario_cambio, comentario, url_imagen_evidencia) 
            VALUES (?, ?, ?, ?)
        `;
        await conmysql.query(queryHistorial, [id_reporte, id_usuario_cambio, comentario, urlImagenFinal]);

        // 4. Actualizar el estado en la tabla reportes
        const queryUpdate = "UPDATE reportes SET id_estado = 4 WHERE id = ?";
        await conmysql.query(queryUpdate, [id_reporte]);

        res.status(200).json({ 
            ok: true, 
            message: "Solución registrada correctamente",
            url_guardada: urlImagenFinal 
        });
    } catch (error) {
        console.error("Error al registrar:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getHistorialPorPersonal = async (req, res) => {
    const { id_personal } = req.params;
    try {
        const query = `
            SELECT 
                p.nombre AS nombre_personal, 
                d.nombre_dep, 
                c.nombre_categoria, 
                r.*, 
                h.*,
                e.nombre_estado
            FROM personal_departamento p 
            JOIN departamentos d ON p.departamento_id = d.id 
            JOIN categorias c ON d.id = c.departamento_id 
            JOIN reportes r ON c.id = r.id_categoria 
            LEFT JOIN historial_reportes h ON r.id = h.id_reporte 
            JOIN estados e ON r.id_estado = e.id 
            WHERE p.id = ? 
            ORDER BY r.fecha_creacion DESC, h.fecha_cambio DESC
        `;
        const [rows] = await conmysql.query(query, [id_personal]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error en getHistorialPorPersonal:", error);
        res.status(500).json({ error: error.message });
    }
};