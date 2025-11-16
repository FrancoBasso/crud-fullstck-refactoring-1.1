<?php
/**
*    File        : backend/controllers/studentsSubjectsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

require_once("./repositories/studentsSubjects.php");

function handleGet($conn) 
{
    header('Content-Type: application/json');

    if (isset($_GET['student_id']) && isset($_GET['subject_id'])) {
        $student_id = (int) $_GET['student_id'];
        $subject_id = (int) $_GET['subject_id'];

        if ($student_id <= 0 || $subject_id <= 0) {
            echo json_encode(["error" => "Parámetros inválidos"]);
            return;
        }

        $stmt = $conn->prepare("SELECT 1 FROM students_subjects WHERE student_id = ? AND subject_id = ? LIMIT 1");
        if (!$stmt) {
            echo json_encode(["error" => $conn->error]);
            return;
        }

        $stmt->bind_param("ii", $student_id, $subject_id);
        $stmt->execute();
        $stmt->store_result();

        $exists = $stmt->num_rows > 0;

        $stmt->close();

        echo json_encode(["exists" => $exists]);
        return;
    }

     if (isset($_GET['id'])) 
    {

    $studentsSubjects = getAllSubjectsStudents($conn);
    echo json_encode($studentsSubjects);
    }//2.0
    else if (isset($_GET['page']) && isset($_GET['limit'])) 
    {
        $page = (int)$_GET['page'];
        $limit = (int)$_GET['limit'];
        $offset = ($page - 1) * $limit;

        $studentsSubjects = getPaginatedStudentSubjects($conn, $limit, $offset);
        $total = getTotalStudentSubject($conn);

        echo json_encode([
            'studentsSubjects' => $studentsSubjects, // ya es array
            'total' => $total        // ya es entero
        ]);
    }
    else
    {
        $studentsSubjects= getAllSubjectsStudents($conn); // ya es array
        echo json_encode($studentsSubjects);
    }
      
}

function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['student_id'], $input['subject_id'], $input['approved'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos (student_id, subject_id, approved)."]);
        return;
    }

    $student_id = filter_var($input['student_id'], FILTER_VALIDATE_INT);
    $subject_id = filter_var($input['subject_id'], FILTER_VALIDATE_INT);
    $approved   = filter_var($input['approved'], FILTER_VALIDATE_INT);

    if ($student_id === false || $subject_id === false || $approved === false) {
        http_response_code(400);
        echo json_encode(["error" => "Los campos deben ser números enteros."]);
        return;
    }

    if ($approved !== 0 && $approved !== 1) {
        http_response_code(400);
        echo json_encode(["error" => "El campo 'approved' solo puede ser 0 o 1."]);
        return;
    }


    $check = $conn->prepare("SELECT 1 FROM students_subjects WHERE student_id = ? AND subject_id = ? LIMIT 1");
    if ($check === false) {
        http_response_code(500);
        echo json_encode(["error" => "Error en la consulta de verificación."]);
        return;
    }
    $check->bind_param("ii", $student_id, $subject_id);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["error" => "La asignación ya existe"]);
        return;
    }
    $check->close();

    
    $result = assignSubjectToStudent($conn, $input['student_id'], $input['subject_id'], $input['approved']);

    if (isset($result['inserted']) && $result['inserted'] > 0) {
        echo json_encode(["message" => "Asignación realizada", "id" => isset($result['id']) ? $result['id'] : null]);
    } else {
        if (isset($result['error']) && $result['error'] === true) {
            http_response_code(500);
            echo json_encode(["error" => $result['message']]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al asignar"]);
        }
    }

}

function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['id'], $input['student_id'], $input['subject_id'], $input['approved'])) 
    {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos"]);
        return;
    }

    $result = updateStudentSubject($conn, $input['id'], $input['student_id'], $input['subject_id'], $input['approved']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Actualización correcta"]);
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

    $result = removeStudentSubject($conn, $input['id']);
    if ($result['deleted'] > 0) 
    {
        echo json_encode(["message" => "Relación eliminada"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo eliminar"]);
    }
}
?>
