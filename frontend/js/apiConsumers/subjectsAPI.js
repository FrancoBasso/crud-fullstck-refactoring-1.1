/**
*    File        : frontend/js/api/subjectsAPI.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

import { createAPI } from './apiFactory.js';

// API base generada por apiFactory
const baseAPI = createAPI('subjects');

// Exportación final del módulo
export const subjectsAPI = {
    ...baseAPI,

    // Método personalizado para poder leer status + body en DELETE
    async removeWithResponse(id) 
    {
        const API_URL = '../../backend/server.php?module=subjects';

        const res = await fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        // Intentamos parsear JSON en todas las respuestas
        let body = null;
        try { 
            body = await res.json(); 
        } catch (_) {}

        return { res, body };
    }
};