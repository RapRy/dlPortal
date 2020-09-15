<?php include('../../header.php'); ?>
    <link rel="stylesheet" href="../../../stylesheets/styles.css">
</head>
<?php
    require('../../../backend/connection/dbConnection.php');
    session_start();

    if(empty($_SESSION['userId'])){
        header('Location: ../../signIn.php');
    }else if(!isset($_GET['category'])){
		header('Location: ../adminProfile.php?mobilenumber='.$_SESSION['mobileNumber'].'');
	}
	
	if(isset($_GET['category'])){
		$stmt = mysqli_stmt_init($conn);
		$getCategories = "SELECT mainCatId, mainCatName, mainCatIcon, mainCatExt FROM maincategories WHERE mainCatName=?";
		mysqli_stmt_prepare($stmt, $getCategories);
		mysqli_stmt_bind_param($stmt, "s", $_GET['category']);
		mysqli_stmt_execute($stmt);
		
		mysqli_stmt_store_result($stmt);
		
		$result = mysqli_stmt_num_rows($stmt);
		
		if($result > 0){
			mysqli_stmt_bind_result($stmt, $mainCatId, $mainCatName, $mainCatIcon, $mainCatExt);
			mysqli_stmt_fetch($stmt);
		}
	}
	
?>
<main class="editMainCatContainer mainContainer">
    <section class="editMainCatHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/manageContent/viewMainCategories.php" id="editMainCatBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="editMainCatPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="editMainCatWrapper">
		<h2>EDIT MAIN CATEGORY</h2>
		<form id="categoryForm">
			<input type="hidden" id="categoryId" value="<?php echo $mainCatId; ?>" />
			<div class="form-group">
				<label for="categoryName" class="formLabel">Category Name</label>
				<input type="text" class="form-control formInputBlue" id="categoryName" name="categoryName" value="<?php echo $mainCatName; ?>" />
			</div>
			<div class="custom-file">
				<span class="formLabel customFormLabel">Category Icon</span>
				<input type="file" class="custom-file-input" id="customFileIcon" name="categoryIcon" value="">
				<label class="custom-file-label formInputBlue" for="customFile" id="customFileLabel"><?php echo $mainCatIcon; ?></label>
			</div>
			<div class="form-group">
				<label for="selectFileExt" class="formLabel">Content File Extension Reference</label>
				<div class="customSelectWrapper">
					<select class="form-control formInputBlue customSelectMenu" id="selectFileExt" name="fileExt" value="<?php echo $mainCatExt; ?>">
						<option value="">Select file extension</option>
						<option value="APK" <?php echo ($mainCatExt === "APK") ? "selected" : ""; ?>>APK</option>
						<option value="MP4" <?php echo ($mainCatExt === "MP4") ? "selected" : ""; ?>>MP4</option>
						<option value="MP3" <?php echo ($mainCatExt === "MP3") ? "selected" : ""; ?>>MP3</option>
					</select>
					<div class="form-control formInputBlue customSelectContainer">
						<span class="currentSelected"><?php echo $mainCatExt; ?></span>
						<i class="fas fa-caret-down"></i>
					</div>
				</div>
			</div>
			<div class="form-group text-center">
				<button type="button" class="btnContentManageBlue globalBtn" id="editCategoryBtn">Save</button>
			</div>
		</form>
	</section>
	<script src="../../../jsscripts/editMainCategory.js" defer></script>
</main>
<?php 
	mysqli_stmt_close($stmt);
	mysqli_close($conn);
?>
<?php include('../../footer.php'); ?>