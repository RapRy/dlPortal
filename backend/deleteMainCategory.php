<?php require('connection/dbConnection.php'); ?>
<?php
	// echo $_POST['catId'], $_POST['catName'];
	
	
	function deleteIcons($pathIcons){
		// delete files inside the folder before deleting the folder itself
		// get all the files
		$icons = glob($pathIcons);
		// delete files one by one
		foreach($icons as $icon){
			if(is_file($icon)){
				unlink($icon);
			}
		}
		// return true if all the files has been deleted
		return true;
	}
	
	function deleteDir($pathDir){
		// delete the folder
		rmdir($pathDir);
		return true;
	}
	
	if(isset($_POST['catId'])){
		$categoryName = filter_var(str_replace(" ", "", $_POST['catName']), FILTER_SANITIZE_SPECIAL_CHARS);
		
		$pathIcons = "../uploads/categoryIcons/{$categoryName}/*";
		$pathDir = "../uploads/categoryIcons/{$categoryName}/";
		
		$deleteIconsRes = deleteIcons($pathIcons);
		
		if($deleteIconsRes){
			
			$deleteDirRes = deleteDir($pathDir);
			
			if($deleteDirRes){
				// update table 
				$stmt = mysqli_stmt_init($conn);
				$deleteCat = "DELETE FROM maincategories WHERE mainCatId=?";
				mysqli_stmt_prepare($stmt, $deleteCat);
				mysqli_stmt_bind_param($stmt, "i", $_POST['catId']);
				mysqli_stmt_execute($stmt);
				
				mysqli_stmt_close($stmt);
				mysqli_close($conn);
				
				echo "success";
			}
		}
		
		
	}
?>