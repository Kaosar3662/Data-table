<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$connection = new mysqli("localhost", "root", "", "kaosar");
$input = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER['REQUEST_METHOD'];


// GET ALL ROWS ----------------------------

if ($method == 'GET') {
	$sql = "SELECT * FROM products";
	$result = $connection->query($sql);

	$data = [];
	while ($row = $result->fetch_assoc()) {
		$data[] = $row;
	}
	echo json_encode($data);


	// CREATE A ROW ----------------------------

} elseif ($method == 'POST') {

	$title = $connection->real_escape_string($input['title']);
	$category = $connection->real_escape_string($input['category']);
	$price = $connection->real_escape_string($input['price']);

	$sql = "INSERT INTO products (title,category,price) VALUES ('$title', '$category', '$price')";
	$result = $connection->query($sql);


	// UPDATE A ROW ----------------------------

} elseif ($method == 'PUT') {
	$id = (int)$input['id'];
	$title = $connection->real_escape_string($input['title']);
	$category = $connection->real_escape_string($input['category']);
	$price = $connection->real_escape_string($input['price']);

	if ($id > 0) {
		$sql = "UPDATE products SET title='$title', category='$category', price='$price' WHERE id=$id";

		if ($connection->query($sql)) {
			echo json_encode(["success" => true, "id" => $id]);
		}
	}


	// DELETE A ROW ----------------------------

} elseif ($method == 'DELETE') {
	$id = isset($input['id']) ? (int)$input['id'] : 0;

	if ($id) {
		$sql = "DELETE FROM products WHERE id=$id";
		$result = $connection->query($sql);
	}
	// OTHERER WIS EXIT THIS ----------------------------
} elseif ($method === 'OPTIONS') {
	http_response_code(200);
	exit();
} else {
	exit();
};
