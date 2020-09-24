<?php include('../../header.php'); ?>
    <link rel="stylesheet" href="../../../stylesheets/styles.css">
</head>
<?php
    require('../../../backend/connection/dbConnection.php');
    session_start();

    if(empty($_SESSION['userId'])){
        header('Location: ../../signIn.php');
    }

?>
<main class="addContentContainer mainContainer">
    <section class="addContentHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/adminProfile.php?mobilenumber=<?php echo $_SESSION['mobileNumber']; ?>" id="addContentBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="addContentPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="addContentWrapper">
        <h2>ADD CONTENT</h2>
        <form id="contentForm" enctype='multiple/form-data' method='POST'>
            <div class="form-group">
				<label for="contentName" class="formLabel">Category Name</label>
				<input type="text" class="form-control formInputBlue" id="contentName" name="contentName">
            </div>
            <div class="form-group">
				<label for="selectMainCat" class="formLabel">Main Category</label>
				<div class="customSelectWrapper customSelectMainCatWrapper">
					<select class="form-control formInputBlue customSelectMainCatMenu" id="selectMainCat" name="selectMainCat" value="">
						<option value="">Select Main Category</option>
						<?php

							$stmt = mysqli_stmt_init($conn);
							$getCategories = "SELECT mainCatId, mainCatName, mainCatExt FROM maincategories";
							mysqli_stmt_prepare($stmt, $getCategories);
							mysqli_stmt_execute($stmt);

							mysqli_stmt_store_result($stmt);

							$result = mysqli_stmt_num_rows($stmt);

							if($result > 0):
								mysqli_stmt_bind_result($stmt, $mainCatId, $mainCatName, $mainCatExt);
                                while(mysqli_stmt_fetch($stmt)):
						?>
									<option 
										value="<?php echo $mainCatName; ?>" 
									><?php echo $mainCatName; ?></option>
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
						<span class="currentSelected currentSubCatSelected">Select Sub Category</span>
						<i class="fas fa-caret-down"></i>
					</div>
				</div>
			</div>
			<div class="custom-file">
				<span class="formLabel customFormLabel">Content File</span>
				<input type="file" class="custom-file-input" id="contentFile" name="contentFile">
				<label class="custom-file-label formInputBlue" for="contentFile" id="contentFileLabel"></label>
			</div>
			<div class="custom-file">
				<span class="formLabel customFormLabel">Content Icon</span>
				<input type="file" class="custom-file-input" id="contentIcon" name="contentIcon">
				<label class="custom-file-label formInputBlue" for="contentIcon" id="contentIconLabel">Only png and jpg are allowed. (45x45px)</label>
			</div>
			<div class="form-group">
				<label for="contentDescription" class="formLabel">Content Description</label>
				<textarea class="form-control formInputBlue" id="contentDescription" rows="7"></textarea>
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
			<div class="form-group text-center">
				<button type="button" class="btnContentManageBlue globalBtn" id="addContentBtn">Add</button>
			</div>
			<!-- insert here -->
        </form>
    </section>
    <script src="../../../jsscripts/addContent.js" defer></script>
</main>
<?php include('../../footer.php'); ?>