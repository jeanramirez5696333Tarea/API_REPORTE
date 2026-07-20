import { conmysql } from "../db.js";

export const registrarSolucion = async (req, res) => {
    // Agregamos logs para debugear qué recibe exactamente el servidor
    console.log("--- DEBUG REGISTRAR SOLUCIÓN ---");
    console.log("Cuerpo (req.body):", req.body);
    console.log("Archivo (req.file):", req.file);

    // 1. Extraemos los datos
    const { id_reporte, id_usuario_cambio, comentario, url_imagen } = req.body;
    
    // 2. Lógica de prioridad:
    // Si viene url_imagen desde Cloudinary (vía FormData), esa es la absoluta.
    // Solo si es nula o undefined, revisamos si hay un archivo físico.
    let urlImagenFinal = url_imagen || null;

    if (!urlImagenFinal && req.file) {
        urlImagenFinal = `/uploads/${req.file.filename}`;
    }

    console.log("URL final a guardar en BD:", urlImagenFinal);

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
};import { conmysql } from "../db.js";

export const registrarSolucion = async (req, res) => {
    // Agregamos logs para debugear qué recibe exactamente el servidor
    console.log("--- DEBUG REGISTRAR SOLUCIÓN ---");
    console.log("Cuerpo (req.body):", req.body);
    console.log("Archivo (req.file):", req.file);

    // 1. Extraemos los datos
    const { id_reporte, id_usuario_cambio, comentario, url_imagen } = req.body;
    
    // 2. Lógica de prioridad:
    // Si viene url_imagen desde Cloudinary (vía FormData), esa es la absoluta.
    // Solo si es nula o undefined, revisamos si hay un archivo físico.
    let urlImagenFinal = url_imagen || null;

    if (!urlImagenFinal && req.file) {
        urlImagenFinal = `/uploads/${req.file.filename}`;
    }

    console.log("URL final a guardar en BD:", urlImagenFinal);

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