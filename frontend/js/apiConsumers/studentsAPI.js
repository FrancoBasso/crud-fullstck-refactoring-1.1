/**
*    File        : frontend/js/api/studentsAPI.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*/

import { createAPI } from './apiFactory.js';

const baseAPI = createAPI('students');

//Val ej 4
export const studentsAPI = {
    ...baseAPI,  

    // Nuevo método que sí nos deja leer status + body
    async removeWithResponse(id) 
    {
        const API_URL = '../../backend/server.php?module=students';

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
