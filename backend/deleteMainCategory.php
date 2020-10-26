<?php require('connection/dbConnection.php'); ?>
<?php
	
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

	function getSubCategories($stmt, $mainCatId){
		$subcategoryQuery = "SELECT subCatId, subCatName FROM subcategories WHERE mainCatId = ?";
		mysqli_stmt_prepare($stmt, $subcategoryQuery);
		mysqli_stmt_bind_param($stmt, "i", $mainCatId);

		if(mysqli_stmt_execute($stmt)){
			mysqli_stmt_store_result($stmt);
			$resultContent = mysqli_stmt_num_rows($stmt);

			if($resultContent > 0){
				mysqli_stmt_bind_result($stmt, $subCatId, $subCatName);

				$subCategories = [];

				while(mysqli_stmt_fetch($stmt)){
                    array_push(
						$subCategories,
						[
							'subCatId' => $subCatId,
							'subCatName' => $subCatName
						]
					);
				}
				
				return $subCategories;
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

	function contentGroupFn($stmt, $contents){
		foreach($contents as $content){
			$contentId = $content['contentId'];
			$ext = $content['ext'];
			$folderName = $content['folderName'];
			$mainCatName = str_replace(" ", "", $content['mainCatName']);
			$subCatName = str_replace(" ", "", $content['subCatName']);

			if($ext === 'apk' || $ext === 'xapk'){
				// delete screenshots
				$delScreens = deleteScreenshots($stmt, $contentId, $ext, $folderName, $mainCatName, $subCatName);

				if($delScreens){
					// then delete content
					deleteContents($stmt, $contentId, $ext, $folderName, $mainCatName, $subCatName);
				}
			}else{
				deleteContents($stmt, $contentId, $ext, $folderName, $mainCatName, $subCatName);
			}
		}

		return true;
	}

	function deleteSubCategory($stmt, $subCatId, $subCatName, $mainCatName){
		$subCatPath = "../uploads/contents/{$mainCatName}/{$subCatName}";
		if(rmdir($subCatPath)){
			$deleteSubCat = "DELETE FROM subcategories WHERE subCatId=?";
			mysqli_stmt_prepare($stmt, $deleteSubCat);
			mysqli_stmt_bind_param($stmt, "i", $subCatId);
			mysqli_stmt_execute($stmt);
		}
	}

	function subCategoryGroupFn($stmt, $subCategories){
		foreach($subCategories as $subCategory){
			$subCatId = $subCategory['subCatId'];
			$subCatName = str_replace(" ", "", $subCategory['subCatName']);

			$contents = getContents($stmt, $subCatId);

			$mainCatName = str_replace(" ", "", $contents[0]['mainCatName']);

			if($contents){
				$contentFnGroup = contentGroupFn($stmt, $contents);
				if($contentFnGroup){
					// delete sub category once all the contents had been deleted
					deleteSubCategory($stmt, $subCatId, $subCatName, $mainCatName);
				}
			}else{
				// deleteSubCategory($stmt, $subCatId, $subCatName, $mainCatName);
				$deleteSubCat = "DELETE FROM subcategories WHERE subCatId=?";
				mysqli_stmt_prepare($stmt, $deleteSubCat);
				mysqli_stmt_bind_param($stmt, "i", $subCatId);
				mysqli_stmt_execute($stmt);
			}
		}

		return true;
	}

	function deleteMainCategory($stmt, $mainCatId, $categoryName, $msg){
		$mainCatPath = "../uploads/contents/{$categoryName}";
		$pathIcons = "../uploads/categoryIcons/{$categoryName}";
		
		$icons = glob("{$pathIcons}/*");

		foreach($icons as $icon){
			if(is_file($icon)){
				unlink($icon);
			}
		}
		
		if(is_dir($mainCatPath)){
			rmdir($mainCatPath);
		}

		if(rmdir($pathIcons)){
			$deleteCat = "DELETE FROM maincategories WHERE mainCatId=?";
			mysqli_stmt_prepare($stmt, $deleteCat);
			mysqli_stmt_bind_param($stmt, "i", $mainCatId);
			mysqli_stmt_execute($stmt);
			
			mysqli_stmt_close($stmt);

			echo $msg;
		}
	}

	if(isset($_POST['catId'])){
		$categoryName = filter_var(str_replace(" ", "", $_POST['catName']), FILTER_SANITIZE_SPECIAL_CHARS);

		$mainCatId = filter_var($_POST['catId'], FILTER_SANITIZE_SPECIAL_CHARS);

		$stmt = mysqli_stmt_init($conn);

		$subCategories = getSubCategories($stmt, $mainCatId);
		if($subCategories){
			$subCategoriesFnGroup = subCategoryGroupFn($stmt, $subCategories);

			if($subCategoriesFnGroup){
				// delete category once all of sub categories and contents had been deleted

				deleteMainCategory($stmt, $mainCatId, $categoryName, "success with subcat and content");
			}
		}else{
			// if there are no sub categories
			$pathIcons = "../uploads/categoryIcons/{$categoryName}";

			$icons = glob("{$pathIcons}/*");

			foreach($icons as $icon){
				if(is_file($icon)){
					unlink($icon);
				}
			}

			if(rmdir("$pathIcons")){
				$deleteCat = "DELETE FROM maincategories WHERE mainCatId=?";
				mysqli_stmt_prepare($stmt, $deleteCat);
				mysqli_stmt_bind_param($stmt, "i", $mainCatId);
				mysqli_stmt_execute($stmt);
				
				mysqli_stmt_close($stmt);

				echo "success no subcat and content";
			}
		}
	}
?>