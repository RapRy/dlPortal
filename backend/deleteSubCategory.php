<?php require('connection/dbConnection.php'); ?>
<?php


	
	if(isset($_POST['subCatId'])){
		
		// echo $_POST['subCatId'];

		$subCatId = filter_var($_POST['subCatId'], FILTER_SANITIZE_SPECIAL_CHARS);
		
		$stmtSubCat = mysqli_stmt_init($conn);
		$deleteSubCat = "DELETE FROM subcategories WHERE subCatId=?";
		mysqli_stmt_prepare($stmtSubCat, $deleteSubCat);
		mysqli_stmt_bind_param($stmtSubCat, "i", $subCatId);
		mysqli_stmt_execute($stmtSubCat);
		
		echo "success";
		
		mysqli_stmt_close($stmtSubCat);
		mysqli_close($conn);
		
	}
?>