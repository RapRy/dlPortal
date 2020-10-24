<?php require('connection/dbConnection.php'); ?>
<?php

	function getContents($stmt, $subCatId){
		$contentQuery = "SELECT contentId, contentFilename, folderName, mainCatName, subCatName FROM contents WHERE subCatId = ?";
		mysqli_stmt_prepare($stmt, $contentQuery);
		mysqli_stmt_bind_param($stmt, "i", $subCatId);

		if(mysqli_stmt_execute($stmt)){
			mysqli_stmt_store_result($stmt);

			$resultContent = mysqli_stmt_num_rows($stmt);

			if($resultContent > 0){
				mysqli_stmt_bind_result($stmt, $contentId, $contentFilename, $folderName, $mainCatName, $subCatName);

				$content = [];

                while(mysqli_stmt_fetch($stmt)){
                    array_push(
						$content,
						[
							'contentId' => $contentId,
							'ext' => pathinfo($contentFilename, PATHINFO_EXTENSION),
							'folderName' => $folderName,
							'mainCatName' => $mainCatName,
							'subCatName' => $subCatName
						]
					);
				}
				
				return $content;
			}
		}
	}
	
	function deleteScreenshots($stmt, $contentId, $ext, $folderName, $mainCatName, $subCatName){
		$screenshotsPath = "../uploads/contents/{$mainCatName}/{$subCatName}/{$folderName}/screenshots";

		$images = glob("{$screenshotsPath}/*");

		foreach($images as $image){
			if(is_file($image)){
				unlink($image);
			}
		}

        if(rmdir($screenshotsPath)){
			$screens = "DELETE FROM screenshots WHERE contentId = ?";
        	mysqli_stmt_prepare($stmt, $screens);
			mysqli_stmt_bind_param($stmt, "i", $contentId);

			return mysqli_stmt_execute($stmt);
		}
	}

	function deleteContents($stmt, $contentId, $ext, $folderName, $mainCatName, $subCatName){
		$contentPath = "../uploads/contents/{$mainCatName}/{$subCatName}/{$folderName}";
		$files = glob("{$contentPath}/*");

		foreach($files as $file){
            if(is_file($file)){
                unlink($file);
            }
		}
		
		if(rmdir($contentPath)){
			$deleteContent = "DELETE FROM contents WHERE contentId = ?";
			mysqli_stmt_prepare($stmt, $deleteContent);
			mysqli_stmt_bind_param($stmt, "i", $contentId);
			
			mysqli_stmt_execute($stmt);
		}
	}

	function deleteSubCategory($stmt, $subCatId, $subCatName, $mainCatName, $msg){
		$subCatPath = "../uploads/contents/{$mainCatName}/{$subCatName}";
		if(rmdir($subCatPath)){
			$deleteSubCat = "DELETE FROM subcategories WHERE subCatId=?";
			mysqli_stmt_prepare($stmt, $deleteSubCat);
			mysqli_stmt_bind_param($stmt, "i", $subCatId);
			mysqli_stmt_execute($stmt);
			
			echo $msg;
		}
	}

	function contentGroupFn($stmt, $contents){
		foreach($contents as $content){
			$contentId = $content['contentId'];
			$ext = $content['ext'];
			$folderName = $content['folderName'];
			$mainCatName = str_replace(" ", "", $content['mainCatName']);
			$subCatName = str_replace(" ", "", $content['subCatName']);

			if($ext === 'apk' || $ext === 'xapk'){
				$delScreens = deleteScreenshots($stmt, $contentId, $ext, $folderName, $mainCatName, $subCatName);

				if($delScreens){
					deleteContents($stmt, $contentId, $ext, $folderName, $mainCatName, $subCatName);
				}
			}else{
				deleteContents($stmt, $contentId, $ext, $folderName, $mainCatName, $subCatName);
			}
		}

		return true;
	}

	if(isset($_POST['subCatId'])){
		
		$subCatId = filter_var($_POST['subCatId'], FILTER_SANITIZE_SPECIAL_CHARS);
		
		$stmt = mysqli_stmt_init($conn);

		$contents = getContents($stmt, $subCatId);

		if($contents){
			$contentFnGroup = contentGroupFn($stmt, $contents);
			if($contentFnGroup){
				$mainCatName = str_replace(" ", "", $contents[0]['mainCatName']);
				$subCatName = str_replace(" ", "", $contents[0]['subCatName']);

				deleteSubCategory($stmt, $subCatId, $subCatName, $mainCatName, "success with content");
			}
		}else{
			// $getDetails = "SELECT mainCatId, subCatName FROM subcategories WHERE subCatId=?";
			// mysqli_stmt_prepare($stmt, $getDetails);
			// mysqli_stmt_bind_param($stmt, "i", $subCatId);

			// if(mysqli_stmt_execute($stmt)){
			// 	mysqli_stmt_store_result($stmt);

			// 	$resultDetails = mysqli_stmt_num_rows($stmt);

			// 	if($resultDetails > 0){
			// 		mysqli_stmt_bind_result($stmt, $mainCatId, $subCatName);

            //     	while(mysqli_stmt_fetch($stmt)){
			// 			$getMainCatName = "SELECT mainCatName FROM maincategories WHERE mainCatId=?";
			// 			mysqli_stmt_prepare($stmt, $getMainCatName);
			// 			mysqli_stmt_bind_param($stmt, "i", $mainCatId);

			// 			if(mysqli_stmt_execute($stmt)){
			// 				mysqli_stmt_store_result($stmt);

			// 				$resultMainCatName = mysqli_stmt_num_rows($stmt);

			// 				if($resultMainCatName > 0){
			// 					mysqli_stmt_bind_result($stmt, $mainCatName);

			// 					while(mysqli_stmt_fetch($stmt)){
			// 						$subCat = str_replace(" ", "", $subCatName);
			// 						$mainCat = str_replace(" ", "", $mainCatName);

			// 						deleteSubCategory($stmt, $subCatId, $subCat, $mainCat, "success no content");
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// }

			$deleteSubCat = "DELETE FROM subcategories WHERE subCatId=?";
			mysqli_stmt_prepare($stmt, $deleteSubCat);
			mysqli_stmt_bind_param($stmt, "i", $subCatId);
			mysqli_stmt_execute($stmt);
			
			echo "success no content";
		}
		
		mysqli_stmt_close($stmt);
		mysqli_close($conn);
		
	}
?>