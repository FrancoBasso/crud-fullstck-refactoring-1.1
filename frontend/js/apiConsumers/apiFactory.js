/**
*    File        : frontend/js/api/apiFactory.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 2.0 ( prototype )
*/

export function createAPI(moduleName, config = {}) 
{
    const API_URL = config.urlOverride ?? `../../backend/server.php?module=${moduleName}`;

    async function sendJSON(method, data) 
    {
        const res = await fetch(API_URL,
        {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        /* if (!res.ok) throw new Error(`Error en ${method}`); */
        if (!res.ok) 
        {
            let errorData;
            try {
                // 1. Intentamos leer el JSON que nos mandó el backend
                errorData = await res.json();
            } catch (e) {
                // 2. Si el backend mandó un error 500 (con HTML) o algo no-JSON
                errorData = { error: `Error ${res.status}: ${res.statusText}` };
            }
            
            // 3. Lanzamos el error con el mensaje del backend
            throw new Error(errorData.error || `Error en ${method}`);
        }

        // 4. Si todo salió bien (res.ok fue true), devolvemos el JSON de éxito        
        return await res.json();
    }

    return {
        async fetchAll()
        {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("No se pudieron obtener los datos");
            return await res.json();
        },
        //2.0
        async fetchPaginated(page = 1, limit = 10)
        {
            const url = `${API_URL}&page=${page}&limit=${limit}`;
            const res = await fetch(url);
            if (!res.ok)
                throw new Error("Error al obtener datos paginados");
            return await res.json();
        },
        async create(data)
        {
            return await sendJSON('POST', data);
        },
        async update(data)
        {
            return await sendJSON('PUT', data);
        },
        async remove(id)
        {
            return await sendJSON('DELETE', { id });
        }
    };
}
