<?php require('connection/dbConnection.php'); ?>
<?php
	session_start();
	
	if(isset($_POST['subCatId'])){
		echo json_encode(['test' => $_POST['subCatId']]);
	}

?>