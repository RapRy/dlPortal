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
				$stmtSubCat = mysqli_stmt_init($conn);
				$deleteSubCat = "DELETE FROM subcategories WHERE mainCatId=?";
				mysqli_stmt_prepare($stmtSubCat, $deleteSubCat);
				mysqli_stmt_bind_param($stmtSubCat, "i", $_POST['catId']);
				
				
				if(mysqli_stmt_execute($stmtSubCat)){
					$stmtMainCat = mysqli_stmt_init($conn);
					$deleteCat = "DELETE FROM maincategories WHERE mainCatId=?";
					mysqli_stmt_prepare($stmtMainCat, $deleteCat);
					mysqli_stmt_bind_param($stmtMainCat, "i", $_POST['catId']);
					mysqli_stmt_execute($stmtMainCat);
					
					mysqli_stmt_close($stmtMainCat);
					
					echo "success";
				}
				
				mysqli_stmt_close($stmtSubCat);
				mysqli_close($conn);
			}
		}
		
		
	}
?>