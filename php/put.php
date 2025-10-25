<?php
require_once "pdoconn.php";
if ($method == "PUT") {
  try {
    $title = $input['title'];
    $category = $input['category'];
    $price = $input['price'];
    $id = $input['id'];

    $stmt = $conn->prepare("UPDATE $tablename SET title = :title, category = :category, price = :price WHERE id = :id");

    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':id', $id);


    $stmt->execute();

    echo $stmt->rowCount() . " records UPDATED successfully";

  } catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
  }
} else {
  exit();
}