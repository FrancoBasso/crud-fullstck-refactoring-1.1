<?php
/**
*    File        : backend/controllers/subjectsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

require_once("./repositories/subjects.php");

function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['id'])) 
    {
        $subject = getSubjectById($conn, $input['id']);
        echo json_encode($subject);
    } //2.0
    else if (isset($_GET['page']) && isset($_GET['limit'])) 
    {
        $page = (int)$_GET['page'];
        $limit = (int)$_GET['limit'];
        $offset = ($page - 1) * $limit;

        $subjects = getPaginatedSubjects($conn, $limit, $offset);
        $total = getTotalSubjects($conn);

        echo json_encode([
            'subjects' => $subjects, // ya es array
            'total' => $total        // ya es entero
        ]);
    }
    else 
    {
        $subjects = getAllSubjects($conn);
        echo json_encode($subjects);
    }
}

function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    /*if (empty($input['name']) || empty($input['credits'])) {
        http_response_code(400); 
        echo json_encode(["error" => "Faltan datos obligatorios (nombre, créditos)"]);
        return;
    }
    if (!is_numeric($input['credits']) || $input['credits'] <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Los créditos deben ser un número positivo"]);
        return;
    }*/

    // --- 2. VALIDACIÓN DE UNICIDAD (Nombre de materia) ---
    $existingSubject = getSubjectByName($conn, $input['name']);
    
    if ($existingSubject) {
        http_response_code(409); // 409 Conflict
        echo json_encode(["error" => "El nombre de la materia ya existe"]);
        return; // ¡Frenamos!
    }
    
    // --- 3. CREAR ---
    // (Ajustá los parámetros a tu función createSubject)
    $result = createSubject($conn, $input['name']);
    if ($result['inserted'] > 0) 
    {
        echo json_encode(["message" => "Materia creada correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo crear"]);
    }
}

function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    // --- 1. VALIDACIONES BÁSICAS ---
   /* if (empty($input['id']) || empty($input['name']) || empty($input['credits'])) {
        http_response_code(400); 
        echo json_encode(["error" => "Faltan datos obligatorios"]);
        return;
    }
     if (!is_numeric($input['credits']) || $input['credits'] <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Los créditos deben ser un número positivo"]);
        return;
    }*/

    // --- 2. VALIDACIÓN DE UNICIDAD (La lógica corregida para PUT) ---
    $existingSubject = getSubjectByName($conn, $input['name']);

    // ¡Error! si el nombre existe Y el ID es DIFERENTE al mío
    if ($existingSubject && $existingSubject['id'] != $input['id']) {
        http_response_code(409); 
        echo json_encode(["error" => "Ese nombre ya está en uso por otra materia"]);
        return;
    }
    
    // --- 3. ACTUALIZAR ---
    // (Ajustá los parámetros a tu función updateSubject)
        
    $result = updateSubject($conn, $input['id'], $input['name']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Materia actualizada correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}

function handleDelete($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    
    $result = deleteSubject($conn, $input['id']);
    if ($result['deleted'] > 0) 
    {
        echo json_encode(["message" => "Materia eliminada correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo eliminar"]);
    }
}
?>