<?php require('connection/dbConnection.php'); ?>
<?php
	session_start();
	
	function updateData($inputValue, $key, $conn, $stmt){
		$catId = filter_var($_POST['categoryId'], FILTER_SANITIZE_SPECIAL_CHARS);
		$insertData = "UPDATE maincategories SET $key=? WHERE mainCatId=?";
		mysqli_stmt_prepare($stmt, $insertData);
		mysqli_stmt_bind_param($stmt, "si", $inputValue, $catId);
		mysqli_stmt_execute($stmt);

		$updateContents = "UPDATE contents SET mainCatName=? WHERE mainCatId=?";
		mysqli_stmt_prepare($stmt, $updateContents);
		mysqli_stmt_bind_param($stmt, "si", $inputValue, $catId);
		mysqli_stmt_execute($stmt);
		
		return ['result' => "success:{$key}"];
	}
	
	if(isset($_POST['categoryId'])){
		$stmt = mysqli_stmt_init($conn);
		$result = [];
		
		if(isset($_FILES['categoryIcon'])){
			$categoryName = filter_var($_POST['iconCategoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
			$initialCategoryName = filter_var($_POST['iconInitialCategoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
			
			// get image name
			$iconName = $_FILES['categoryIcon']['name'];
			// get temporary path
			$iconTmp = $_FILES['categoryIcon']['tmp_name'];
			// get error if there is any
			$error = $_FILES['categoryIcon']['error'];
			// get the icon file extension
			$iconExt = strtolower(pathinfo($iconName, PATHINFO_EXTENSION));
			
			if($error > 0){
				array_push($result, ['error', 'icon']);
			}else{
				$path = "";
				
				if($categoryName === $initialCategoryName){
					// no change on the name of the category
					$initialCategoryName = str_replace(" ", "", $initialCategoryName);
					$path = "../uploads/categoryIcons/{$initialCategoryName}/";
				}else if($categoryName != $initialCategoryName){
					// if the category name is changed
					$categoryName = str_replace(" ", "", $categoryName);
					$oldPath = "../uploads/categoryIcons/{$initialCategoryName}/";
					$newPath = "../uploads/categoryIcons/{$categoryName}/";
					if(is_dir($newPath)){
						// if recently updated the category name without leaving the editcategory page
						$path = $newPath;
					}else if(!is_dir($newPath)){
						// if the category icon update first
						// remove the previous folder and it's files then create new folder
						$renameFolder = rename($oldPath, $newPath);
					
						if($renameFolder){
							$path = $newPath;
						}
					}
				}
				
				date_default_timezone_set("Asia/Brunei");
				$dateTime = date("YmdHis");
				// new name of the icon
				$iconFinalName = strtolower(str_replace(" ", "", $categoryName))."_".$dateTime.".".$iconExt;
				// file path
				$newFilePath = $path.$iconFinalName;
				// upload the icon to the new file path or previous file path
				move_uploaded_file($iconTmp, $newFilePath);
				// update database
				$sqlResult = updateData($iconFinalName, "mainCatIcon", $conn, $stmt);
				array_push($result, $sqlResult);
			}
		}
		
		if(isset($_POST['categoryName'])){
			$categoryName = filter_var($_POST['categoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
			$initialCategoryName = filter_var($_POST['initialCategoryName'], FILTER_SANITIZE_SPECIAL_CHARS);
			
			$newPath = "../uploads/categoryIcons/".str_replace(" ", "", $categoryName)."/";
			$oldPath = "../uploads/categoryIcons/".$initialCategoryName."/";
			
			if(is_dir($oldPath)){
				// remove the previous folder and it's files then create new folder
				$renameFolder = rename($oldPath, $newPath);
				if($renameFolder){

					// // update database
					// $sqlResult = updateData($categoryName, "mainCatName", $conn, $stmt);
					// array_push($result, $sqlResult);

					$stripCatName = str_replace(" ", "", $categoryName);
					$stripInitial = str_replace(" ", "", $initialCategoryName);
					$newPathContent  = "../uploads/contents/{$stripCatName}/";
					$oldPathContent  = "../uploads/contents/";

					if(is_dir($oldPathContent)){
						if($dh = opendir($oldPathContent)){
							while(($file = readdir($dh)) !== false){
								if($file === $stripInitial){
									rename("{$oldPathContent}/{$file}", $newPathContent);
									// update database
									$sqlResult = updateData($categoryName, "mainCatName", $conn, $stmt);
									array_push($result, $sqlResult);
								}
							}
						}
					}
				}else{
					array_push($result, ['error' => 'rename']);
				}
			}else if(is_dir($newPath)){
				// if recently updated the category name without leaving the editcategory page
				$sqlResult = updateData($categoryName, "mainCatName", $conn, $stmt);
				array_push($result, $sqlResult);
			}else{
				array_push($result, ['error' => 'checkpath']);
			}
		}
		
		if(isset($_POST['categoryFileExt'])){
			// update database
			$categoryFileExt = filter_var($_POST['categoryFileExt'], FILTER_SANITIZE_SPECIAL_CHARS);
			$sqlResult = updateData($categoryFileExt, "mainCatExt", $conn, $stmt);
			array_push($result, $sqlResult);
		}
		
		mysqli_stmt_close($stmt);
		mysqli_close($conn);
		
		echo json_encode($result);
	}
	
?>