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
		
		if(isset($_POST['categoryName'])){
			$categoryName = filter_var($_POST['categoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
			$catId = getCatId($categoryName, $stmt);
			
			if($catId){
				$sqlResult = updateData($catId, "mainCatId", "i", $stmt);
				array_push($result, $sqlResult);
			}else{
				array_push($result, ["error" => "catId"]);
			}
		}
		
		if(isset($_POST['subCategoryName'])){
			$subCategoryName = filter_var($_POST['subCategoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
			
			$sqlResult = updateData($subCategoryName, "subCatName", "s", $stmt);
			
			array_push($result, $sqlResult);
		}
		
		mysqli_stmt_close($stmt);
		mysqli_close($conn);
		
		echo json_encode($result);
	}

?>