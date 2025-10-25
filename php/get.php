<?php
require_once "pdoconn.php";
if ($method == "GET") {
  try {
    $stmt = $conn->prepare("SELECT id, title, category,price FROM $tablename");
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($result);
  } catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
  }
} else {
  exit();
}
