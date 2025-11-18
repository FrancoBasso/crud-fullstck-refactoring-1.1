/**
*    File        : frontend/js/controllers/subjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/
import {showErrorBox} from './ControllerFunction.js';
import { subjectsAPI } from '../apiConsumers/subjectsAPI.js';
import {showConfirmBox} from './ControllerFunction.js';
//2.0
//For pagination:
let currentPage = 1;
let totalPages = 1;
const limit = 5;
document.addEventListener('DOMContentLoaded', () => 
{
    loadSubjects();
    setupSubjectFormHandler();
    setupCancelHandler();
    setupPaginationControls();//2.0
    const deleteBtn = document.getElementById('botonConfirmar');
    const confirmBox = document.getElementById('confirmDeleteBox');

    //accion para el boton de eliminar
    deleteBtn.addEventListener('click', async () => {
   
    const idToDelete = deleteBtn.dataset.currentId; 

    if (idToDelete) {
       
        await confirmDeleteSubjects(idToDelete);
    }

    // 5. Ocultar la caja de confirmación (siempre)
    confirmBox.style.display = 'none';

    // Opcional: limpiar el atributo después de usar
    deleteBtn.dataset.currentId = ''; 
});
});

function setupSubjectFormHandler() 
{
  const form = document.getElementById('subjectForm');
  form.addEventListener('submit', async e => 
  {
        e.preventDefault();
        const subject = 
        {
            id: document.getElementById('subjectId').value.trim(),
            name: document.getElementById('name').value.trim()
        };

        try 
        {
            if (subject.id) 
            {
                await subjectsAPI.update(subject);
            }
            else
            {
                await subjectsAPI.create(subject);
            }
            
            form.reset();
            document.getElementById('subjectId').value = '';
            loadSubjects();
        }
        catch (err)
        {
           console.error(err.message); 
           /* alert('Error: ' + err.message);  */
           showErrorBox(err.message);
        }
  });
}
//2.0
function setupPaginationControls() 
{
    document.getElementById('prevPage').addEventListener('click', () => 
    {
        if (currentPage > 1) 
        {
            currentPage--;
            loadSubjects();
        }
    }); 

    document.getElementById('nextPage').addEventListener('click', () => 
    {
        if (currentPage < totalPages) 
        {
            currentPage++;
            loadSubjects();
        }
    });

    document.getElementById('resultsPerPage').addEventListener('change', e => 
    {
        currentPage = 1;
        loadSubjects();
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = '';
    });
}

async function loadSubjects()
{
    try
    {
        const resPerPage = parseInt(document.getElementById('resultsPerPage').value, 10) || limit;
        const data = await subjectsAPI.fetchPaginated(currentPage, resPerPage);
        console.log(data);
        // const subjects = await subjectsAPI.fetchAll();
        renderSubjectTable(data.subjects);
        totalPages = Math.ceil(data.total / resPerPage);
        document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;

    }
    catch (err)
    {
        console.error('Error cargando materias:', err.message);
    }
}

function renderSubjectTable(subjects)
{
    const tbody = document.getElementById('subjectTableBody');
    tbody.replaceChildren();

    subjects.forEach(subject =>
    {
        const tr = document.createElement('tr');

        tr.appendChild(createCell(subject.name));
        tr.appendChild(createSubjectActionsCell(subject));

        tbody.appendChild(tr);
    });
}

function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createSubjectActionsCell(subject)
{
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = subject.id;
        document.getElementById('name').value = subject.name;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => showConfirmBox(subject.id, "Desea eliminar esta materia?")
);

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

async function confirmDeleteSubjects(id) {
    const { res, body } = await subjectsAPI.removeWithResponse(id);

    if (res.status === 409) {
        if (body.assignments?.length > 0) {
            const names = body.assignments
                .map(a => a.fullname)
                .join(', ');
            showErrorBox(`No se puede eliminar la materia: está asignada a ${names}`);
        } else {
            showErrorBox(body.error);
        }
        return;
    }

    if (!res.ok) {
        showErrorBox(body.error || "Error eliminando materia.");
        return;
    }

    loadSubjects();
}
