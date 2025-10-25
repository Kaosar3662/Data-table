<?php
require_once "pdoconn.php";
if ($method == "POST") {
  try {
    $title = $input['title'];
    $category = $input['category'];
    $price = $input['price'];

    $stmt = $conn->prepare("INSERT INTO $tablename (title, category, price) VALUES (:title, :category, :price)");
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':price', $price);
    $stmt->execute();

    $lastId = $conn->lastInsertId();

    echo json_encode(['status' => 'success', 'id' => $lastId]);
    
  } catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
  }
} else {
  exit();
}