import { conmysql } from "../db.js";

export const registrarSolucion = async (req, res) => {
    // 1. Extraemos la URL si viene desde el body (Cloudinary) 
    // o el archivo si todavía usaras Multer
    const { id_reporte, id_usuario_cambio, comentario, url_imagen } = req.body;
    
    // Lógica inteligente: 
    // Si viene url_imagen en el body, usamos esa. 
    // Si no, verificamos si existe un archivo físico (legacy).
    const urlImagenFinal = url_imagen || (req.file ? `/uploads/${req.file.filename}` : null);

    try {
        const queryHistorial = `
            INSERT INTO historial_reportes (id_reporte, id_usuario_cambio, comentario, url_imagen_evidencia) 
            VALUES (?, ?, ?, ?)
        `;
        // Usamos urlImagenFinal en lugar de la variable antigua
        await conmysql.query(queryHistorial, [id_reporte, id_usuario_cambio, comentario, urlImagenFinal]);

        const queryUpdate = "UPDATE reportes SET id_estado = 4 WHERE id = ?";
        await conmysql.query(queryUpdate, [id_reporte]);

        res.status(200).json({ message: "Solución registrada correctamente" });
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
                e.nombre_estado  -- <--- ESTO ES LO QUE FALTABA
            FROM personal_departamento p 
            JOIN departamentos d ON p.departamento_id = d.id 
            JOIN categorias c ON d.id = c.departamento_id 
            JOIN reportes r ON c.id = r.id_categoria 
            LEFT JOIN historial_reportes h ON r.id = h.id_reporte 
            JOIN estados e ON r.id_estado = e.id  -- <--- ESTE JOIN UNE LA TABLA ESTADOS
            WHERE p.id = ? 
            ORDER BY r.fecha_creacion DESC, h.fecha_cambio DESC
        `;
        const [rows] = await conmysql.query(query, [id_personal]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};