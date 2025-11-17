
export function showErrorBox(message) {
    //se inserta el mensaje
    document.getElementById('errorMsg').textContent = message; 

    // Lo muestra
    document.getElementById('errorBox').style.display = 'block'; 
}

export function showConfirmBox(id, message) {
    const deleteBtn = document.getElementById('botonConfirmar'); 

    // **
    //  SOLO GUARDA EL ID EN EL BOTÓN (Lógica Clave) 
    // **
    deleteBtn.dataset.currentId = id; 

    // Se inserta el mensaje
    document.getElementById('confirmErrorMsg').textContent = message;

    // Lo muestra
    document.getElementById('confirmDeleteBox').style.display = 'block';
}