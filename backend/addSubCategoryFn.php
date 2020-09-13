<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();
	
	function checkTable($stmt){
		$selectAll = "SELECT * FROM subcategories";
		mysqli_stmt_prepare($stmt, $selectAll);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $result = mysqli_stmt_num_rows($stmt);
		
		if($result > 0){
			return true;
		}else{
			return false;
		}
	}

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

    function validateSubCategoryName($catId, $subCategoryName, $stmt){
		$selectSubCat = "SELECT * FROM subcategories WHERE mainCatId=? AND subCatName=?";
		mysqli_stmt_prepare($stmt, $selectSubCat);
		mysqli_stmt_bind_param($stmt, "is", $catId, $subCategoryName);
		mysqli_stmt_execute($stmt);
		mysqli_stmt_store_result($stmt);
		
		$result = mysqli_stmt_num_rows($stmt);
		
		if($result > 0){
			return true;
		}else{
			return false;
		}
    }
	
	function insertData($catId, $subCategoryName, $stmt){
		$insertSubCat = "INSERT INTO subcategories (mainCatId, subCatName) VALUES (?, ?)";
		
		mysqli_stmt_prepare($stmt, $insertSubCat);
		mysqli_stmt_bind_param($stmt, "is", $catId, $subCategoryName);
		if(mysqli_stmt_execute($stmt)){

			// echo json_encode(['result' => "succesful"]);
			echo json_encode(['success' => 'success']);
		}
	}

    if(isset($_SESSION['userId'])){
        $subCategoryName = filter_var($_POST['subCategoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $mainCategory = filter_var($_POST['selectMainCat'], FILTER_SANITIZE_SPECIAL_CHARS);

        $stmt = mysqli_stmt_init($conn);
		$table = checkTable($stmt);
		$catId = getCatId($mainCategory, $stmt);
		
		if($table){
			if($catId){
				$subCatExists = validateSubCategoryName($catId, $subCategoryName, $stmt);
				if($subCatExists){
					echo json_encode(["error" => "subCatExists"]);
				}else{
					insertData($catId, $subCategoryName, $stmt);
				}
			}else{
				echo json_encode(["error" => "catId"]);
			}
		}else{
			insertData($catId, $subCategoryName, $stmt);
		}
		mysqli_stmt_close($stmt);
		mysqli_close($conn);
    }
?>