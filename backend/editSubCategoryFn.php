<?php require('connection/dbConnection.php'); ?>
<?php
	session_start();
	
	function getCatId($mainCategory, $stmt){
		$selectCategory = "SELECT mainCatId FROM maincategories WHERE mainCatName = ?";
        mysqli_stmt_prepare($stmt, $selectCategory);
        mysqli_stmt_bind_param($stmt, "s", $mainCategory);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $result = mysqli_stmt_num_rows($stmt);

        if($result > 0){
            mysqli_stmt_bind_result($stmt, $mainCatId);
            while(mysqli_stmt_fetch($stmt)){
                return $mainCatId;
            }
        }else{
            return false;
        }
	}
	
	function updateData($inputValue, $key, $param, $stmt){
		$subCatId = filter_var($_POST['subCatId'], FILTER_SANITIZE_SPECIAL_CHARS);

		if($key === "subCatName"){
			if(isset($_POST['categoryName']) && isset($_POST['subCategoryName'])){
				$updateContents = "UPDATE contents SET subCatName=?, mainCatName=? WHERE subCatId=?";
				mysqli_stmt_prepare($stmt, $updateContents);
				mysqli_stmt_bind_param($stmt, "{$param}{$param}i", $inputValue, $_POST['categoryName'], $subCatId);
				mysqli_stmt_execute($stmt);
			}else{
				$updateContents = "UPDATE contents SET subCatName=? WHERE subCatId=?";
				mysqli_stmt_prepare($stmt, $updateContents);
				mysqli_stmt_bind_param($stmt, "{$param}i", $inputValue, $subCatId);
				mysqli_stmt_execute($stmt);
			}
		}
		
		$insertData = "UPDATE subcategories SET $key=? WHERE subCatId=?";
		mysqli_stmt_prepare($stmt, $insertData);
		mysqli_stmt_bind_param($stmt, "{$param}i", $inputValue, $subCatId);
		mysqli_stmt_execute($stmt);
		
		return ['result' => "success:{$key}"];
	}

	
	if(isset($_POST['subCatId'])){
		// echo json_encode(['test' => $_POST['subCatId']]);
		$stmt = mysqli_stmt_init($conn);
		$result = [];
		$subCatInitial = str_replace(" ", "", $_POST['subCatInitialName']);

		if(isset($_POST['categoryName']) && isset($_POST['subCategoryName'])){
			// if both fields changed values change
			$newSubCatName = str_replace(" ", "", $_POST['subCategoryName']);
			$newPath = "../uploads/contents/{$_POST['categoryName']}/{$newSubCatName}";
			$oldPath = "../uploads/contents/{$_POST['catInitialName']}";
			
			if(is_dir($oldPath)){
				if($dh = opendir($oldPath)){
					while(($file = readdir($dh)) !== false){
						if($file === $subCatInitial){
							// transfer the subcategory and contents
							rename("{$oldPath}/{$file}", $newPath);
							array_push($result, ["result" => "success:moveFolder"]);
						}
					}
				}
			}
		}
		
		if(isset($_POST['categoryName'])){
			$categoryName = filter_var($_POST['categoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
			$catId = getCatId($categoryName, $stmt);

			if($catId){
				if(isset($_POST['categoryName']) && isset($_POST['subCategoryName'])){
					// if both fields changed values change update only the database
					$sqlResult = updateData($catId, "mainCatId", "i", $stmt);
					array_push($result, $sqlResult);
				}else{
					// rename folder and update database
					$newPath = "../uploads/contents/{$_POST['categoryName']}/{$_POST['subCatInitialName']}";
					$oldPath = "../uploads/contents/{$_POST['catInitialName']}/{$_POST['subCatInitialName']}";

					if(is_dir($oldPath)){
						$sqlResult = updateData($catId, "mainCatId", "i", $stmt);
						array_push($result, $sqlResult);
					}else{
						array_push($result, ["error" => "catId"]);
					}
				}
			}
		}

		if(isset($_POST['subCategoryName'])){
			$subCategoryName = filter_var($_POST['subCategoryName'], FILTER_SANITIZE_SPECIAL_CHARS);

			if(isset($_POST['categoryName']) && isset($_POST['subCategoryName'])){
				// if both fields changed values change update only the database
				$sqlResult = updateData($subCategoryName, "subCatName", "s", $stmt);
				array_push($result, $sqlResult);
			}else{
				// rename folder and update database
				$newPath = "../uploads/contents/{$_POST['catInitialName']}/{$subCategoryName}";
				$oldPath = "../uploads/contents/{$_POST['catInitialName']}/{$_POST['subCatInitialName']}";

				if(is_dir($oldPath)){
					$renameFolder = rename($oldPath, $newPath);
	
					if($renameFolder){
						$sqlResult = updateData($subCategoryName, "subCatName", "s", $stmt);
						array_push($result, $sqlResult);
					}else{
						array_push($result, ["error" => "rename"]);
					}
				}
			}

			// if(is_dir($oldPath)){
			// 	$renameFolder = rename($oldPath, $newPath);

			// 	if($renameFolder){
			// 		$sqlResult = updateData($subCategoryName, "subCatName", "s", $stmt);
			// 		array_push($result, $sqlResult);
			// 	}else{
			// 		array_push($result, ["error" => "rename"]);
			// 	}
			// }
		}
		
		mysqli_stmt_close($stmt);
		mysqli_close($conn);
		
		echo json_encode($result);
	}

?>