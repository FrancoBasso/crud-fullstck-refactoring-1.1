/**
*    File        : frontend/js/api/studentsSubjectsAPI.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

import { createAPI } from './apiFactory.js';
const baseAPI = createAPI('studentsSubjects');

/**
 * Ejemplo de extensión de la API:
*/
// import { createAPI } from './apiFactory.js';
// const baseAPI = createAPI('studentsSubjects');

// export const studentsSubjectsAPI = 
// {
//     ...baseAPI, // hereda fetchAll, create, update, remove

//     // método adicional personalizado
//     async fetchByStudentId(id) 
//     {
//         const res = await fetch(`../../backend/server.php?module=studentsSubjects&studentId=${id}`);
//         if (!res.ok) throw new Error("No se pudieron obtener asignaciones del estudiante");
//         return await res.json();
//     }
// };

/**
 * También permite url personalizadas ahora:
*/
// const customAPI = createAPI('custom', 
// {
//     urlOverride: '../../backend/misRutas/personalizadas.php'
// });


export const studentsSubjectsAPI = {
    ...baseAPI, // hereda fetchAll, create, update, remove, etc.

    /**
     *
     * @param {number|string} studentId
     * @param {number|string} subjectId
     * @returns {Promise<Object>} -> { exists: boolean } (o lanza error)
     */
    async exists(studentId, subjectId) {
        const params = new URLSearchParams({
            student_id: studentId,
            subject_id: subjectId
        });

        const url = `../../backend/server.php?module=studentsSubjects&${params.toString()}`;

        const res = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin' // mantener si usás sesión/cookies en el backend
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error('Error al validar existencia: ' + text);
        }

        const json = await res.json();
        if (json.error) throw new Error(json.error);
        return json;
    }
};