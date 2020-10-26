<?php include('../../header.php'); ?>
    <link rel="stylesheet" href="../../../stylesheets/styles.css">
</head>
<?php
    require('../../../backend/connection/dbConnection.php');
	session_start();
	
	$contId = filter_var($_GET['contId'], FILTER_SANITIZE_SPECIAL_CHARS);

    if(empty($_SESSION['userId'])){
        header('Location: ../../signIn.php');
	}
	
	if(isset($_GET['contId'])){
		$stmtContent = mysqli_stmt_init($conn);
		$getContent = "SELECT contentName, folderName, contentDescription, contentThumb, contentFilename, subCatName, mainCatName FROM contents WHERE contentId = ?";
		mysqli_stmt_prepare($stmtContent, $getContent);
		mysqli_stmt_bind_param($stmtContent, "i", $contId);
		mysqli_stmt_execute($stmtContent);

		mysqli_stmt_store_result($stmtContent);

		$resultContent = mysqli_stmt_num_rows($stmtContent);

		if($resultContent > 0){
			mysqli_stmt_bind_result($stmtContent, $contentName, $folderName, $contentDescription, $contentThumb, $contentFilename, $subCatName, $mainCatName);

			mysqli_stmt_fetch($stmtContent);
			mysqli_stmt_close($stmtContent);
		}
	}

?>
<main class="editContentContainer mainContainer">
    <section class="editContentHeader">
        <div class="backBtnContainer">
            <a href="<?php echo (isset($_GET['cat'])) ? "../../../pages/admin/manageContent/viewContents.php" : "../../../pages/admin/adminProfile.php?mobilenumber={$_SESSION['mobileNumber']}" ?>" id="editContentBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="editContentPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="editContentWrapper">
        <h2>EDIT CONTENT</h2>
		<form id="contentForm" enctype='multiple/form-data' method='POST'>
			<input type="hidden" id="contentId" value="<?php echo $contId; ?>" />
            <div class="form-group">
				<label for="contentName" class="formLabel">Content Name</label>
				<input type="text" class="form-control formInputBlue" id="contentName" name="contentName" value="<?php echo $contentName; ?>">
            </div>
            <div class="form-group">
				<label for="selectMainCat" class="formLabel">Main Category</label>
				<div class="customSelectWrapper customSelectMainCatWrapper">
					<select class="form-control formInputBlue customSelectMainCatMenu" id="selectMainCat" name="selectMainCat" value="">
						<option value="">Select Main Category</option>
						<?php

							$currentCat = "";
							$displayCat = "";

							if(isset($_GET['cat'])){
								$currentCat = str_replace("+", " ", $_GET['cat']);
							}

							$stmt = mysqli_stmt_init($conn);
							$getCategories = "SELECT mainCatId, mainCatName, mainCatExt FROM maincategories";
							mysqli_stmt_prepare($stmt, $getCategories);
							mysqli_stmt_execute($stmt);

							mysqli_stmt_store_result($stmt);

							$result = mysqli_stmt_num_rows($stmt);

							if($result > 0):
								mysqli_stmt_bind_result($stmt, $mainCatId, $mainCatName, $mainCatExt);
								while(mysqli_stmt_fetch($stmt)):
									if($currentCat === $mainCatName){
										$displayCat = $mainCatName;
									}
						?>
									<option 
										value="<?php echo $mainCatName; ?>" <?php echo ($currentCat === $mainCatName) ? "selected" : "" ?> ><?php echo $mainCatName; ?></option>
						<?php
								endwhile;
							endif;
						?>
					</select>
					<div class="form-control formInputBlue customSelectContainer customSelectMainCatContainer">
						<span class="currentSelected currentMainCatSelected"><?php echo (empty($displayCat)) ? "Select Main Category" : $currentCat ?></span>
						<i class="fas fa-caret-down"></i>
					</div>
				</div>
            </div>
			<div class="form-group">
				<label for="selectSubCat" class="formLabel">Sub Category</label>
				<div class="customSelectWrapper customSelectSubCatWrapper">
					<select class="form-control formInputBlue customSelectSubCatMenu" id="selectSubCat" name="selectSubCat" value="">
						<option value="">Select Sub Category</option>
					</select>
					<div class="form-control formInputBlue customSelectContainer customSelectSubCatContainer">
						<?php echo (isset($_GET['subCat'])) ? "<input type='hidden' value='{$_GET['subCat']}' />" : "" ?>
						<span class="currentSelected currentSubCatSelected">Select Sub Category</span>
						<i class="fas fa-caret-down"></i>
					</div>
				</div>
			</div>
			<div class="custom-file">
				<span class="formLabel customFormLabel">Content File</span>
				<input type="file" class="custom-file-input" id="contentFile" name="contentFile" value="<?php echo $contentFilename; ?>">
				<label class="custom-file-label formInputBlue" for="contentFile" id="contentFileLabel"></label>
			</div>
			<div class="custom-file">
				<span class="formLabel customFormLabel">Content Icon</span>
				<input type="file" class="custom-file-input" id="contentIcon" name="contentIcon" value="<?php echo $contentThumb; ?>">
				<label class="custom-file-label formInputBlue" for="contentIcon" id="contentIconLabel"><?php echo $contentThumb; ?></label>
			</div>
			<div class="form-group">
				<label for="contentDescription" class="formLabel">Content Description</label>
				<textarea class="form-control formInputBlue" id="contentDescription" rows="7" value="<?php echo $contentDescription; ?>"></textarea>
			</div>
			<!-- <div class="custom-file customFileMB">
				<span class="formLabel customFormLabel">Content Screenshots</span>
				<input type="file" id="contentScreenshots" class="contentScreenshots" name="contentScreenshots" multiple>
				<div class="contentScreenshotsWrapper">
					<div class="text-center">
						<label type="button" class="screenshotsBtnSubmit" id="screenshotsBtnSubmit" for="contentScreenshots">
							Choose Files
						</label>
						<p class="screenshotsReminder">Only png and jpg are allowed.</p>
					</div>
					<div class="screenshotsBody"></div>
				</div>
			</div> -->
			<div class="custom-file customFileMB">
				<span class="formLabel customFormLabel">Content Screenshots</span>
				<input type="file" id="contentScreenshots" class="contentScreenshots" name="contentScreenshots" multiple>
				<div class="contentScreenshotsWrapper">
					<div class="text-center">
						<label type="button" class="screenshotsBtnSubmit" id="screenshotsBtnSubmit" for="contentScreenshots">Add Images</label>
						<p class="screenshotsReminder">Only png and jpg are allowed.</p>
					</div>
					<div class="screenshotsBody">
						<?php
							$cat = filter_var($_GET['cat'], FILTER_SANITIZE_SPECIAL_CHARS);
							$stmtExtScreen = mysqli_stmt_init($conn);
							$getExt = "SELECT mainCatExt FROM maincategories WHERE mainCatName = ?";

							mysqli_stmt_prepare($stmtExtScreen, $getExt);
							mysqli_stmt_bind_param($stmtExtScreen, "i", $cat);
							mysqli_stmt_execute($stmtExtScreen);

							mysqli_stmt_store_result($stmtExtScreen);

							mysqli_stmt_num_rows($stmtExtScreen);

							mysqli_stmt_bind_result($stmtExtScreen, $mainCatExt);

							mysqli_stmt_fetch($stmtExtScreen);

							if($mainCatExt === "APK" || $mainCatExt === "XAPK"):
								$getScreens = "SELECT screenshotName FROM screenshots WHERE contentId = ?";
								mysqli_stmt_prepare($stmtExtScreen, $getScreens);
								mysqli_stmt_bind_param($stmtExtScreen, "i", $contId);
								mysqli_stmt_execute($stmtExtScreen);

								mysqli_stmt_store_result($stmtExtScreen);

								mysqli_stmt_num_rows($stmtExtScreen);

								mysqli_stmt_bind_result($stmtExtScreen, $screenshot);

								while(mysqli_stmt_fetch($stmtExtScreen)):
						?>
									<div class="imgContainer">
										<i class="fas fa-file-image screenImgThumb"></i>
										<p><?php echo $screenshot; ?></p>
										<button type="button" class="btnRedSolid deleteCategoryBtn deleteScreen">
											<i class="fas fa-trash-alt"></i>
										</button>
									</div>
						<?php
								endwhile;
								mysqli_stmt_close($stmtExtScreen);
							endif;
						?>
					</div>
				</div>
			</div>
			<div class="form-group text-center">
				<button type="button" class="btnContentManageBlue globalBtn" id="editContentBtn">Add</button>
			</div>
			<!-- insert here -->
        </form>
    </section>
    <script src="../../../jsscripts/editContent.js" defer></script>
</main>
<?php mysqli_close($conn); ?>
<?php include('../../footer.php'); ?>