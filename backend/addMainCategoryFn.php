<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();
	
	function validateCategoryName($categoryName, $conn, $stmt){
		$selectCategory = "SELECT mainCatName FROM maincategories WHERE mainCatName = ?";
		mysqli_stmt_prepare($stmt, $selectCategory);
		mysqli_stmt_bind_param($stmt, "s", $categoryName);
		mysqli_stmt_execute($stmt);
		mysqli_stmt_store_result($stmt);
		
		$result = mysqli_stmt_num_rows($stmt);
		
		if($result == 0){
			return false;
		}else{
			return true;
		}
	}
	
    if(isset($_SESSION['userId'])){
		// sanitize datas
        $categoryName = filter_var($_POST['categoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $categoryFileExt = filter_var($_POST['fileExt'], FILTER_SANITIZE_SPECIAL_CHARS);
		$stmt = mysqli_stmt_init($conn);
		
		$categoryExist = validateCategoryName($categoryName, $conn, $stmt);
		
		if($categoryExist){
			echo json_encode(['error' => "categoryName"]);
		}else{
			// get name and extension of icon
			$iconName = $_FILES['categoryIcon']['name'];
			// get temporary path and name of icon
			$iconTmp = $_FILES['categoryIcon']['tmp_name'];
			// get errors
			$error = $_FILES['categoryIcon']['error'];
			// get file extension
			$iconExt = strtolower(pathinfo($iconName, PATHINFO_EXTENSION));

			if($error > 0){
				// send error
				echo json_encode(['error' => "icon"]);
			}else{
				// remove white spaces to category name
				$path = "../uploads/categoryIcons/".str_replace(" ", "", $categoryName)."/";
				
				if(!is_dir($path)){
					// create directory if it doesnt exist
					mkdir($path, 0777, true);
				}
				
				date_default_timezone_set("Asia/Brunei");
				$dateTime = date("YmdHis");
				// new filename for the icon will be sent to database
				$iconFinalName = strtolower(str_replace(" ", "", $categoryName))."_".$dateTime.".".$iconExt;
				// new file path
				$newFilePath = $path.$iconFinalName;
				// save the image to the new file path
				move_uploaded_file($iconTmp, $newFilePath);

				$insertCat = "INSERT INTO maincategories (mainCatName, mainCatIcon, mainCatExt) VALUES (?, ?, ?)";

				mysqli_stmt_prepare($stmt, $insertCat);
				mysqli_stmt_bind_param($stmt, "sss", $categoryName, $iconFinalName, $categoryFileExt);
				if(mysqli_stmt_execute($stmt)){
					mysqli_stmt_close($stmt);

					echo json_encode(['result' => "succesful"]);
				}
			}
		}
		
        mysqli_close($conn);
    }
?>