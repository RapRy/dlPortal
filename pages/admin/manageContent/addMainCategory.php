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
<main class="addMainCatContainer mainContainer">
    <section class="addMainCatHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/adminProfile.php?mobilenumber=<?php echo $_SESSION['mobileNumber']; ?>" id="addMainCatBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="addMainCatPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="addMainCatWrapper">
		<h2>ADD MAIN CATEGORY</h2>
		<form id="categoryForm">
			<div class="form-group">
				<label for="categoryName" class="formLabel">Category Name</label>
				<input type="text" class="form-control formInputBlue" id="categoryName" name="categoryName">
			</div>
			<div class="custom-file">
				<span class="formLabel customFormLabel">Category Icon</span>
				<input type="file" class="custom-file-input" id="customFileIcon" name="categoryIcon">
				<label class="custom-file-label formInputBlue" for="customFile" id="customFileLabel">Only png are allowed.(Dimension 25x25px)</label>
			</div>
			<div class="form-group">
				<label for="selectFileExt" class="formLabel">Content File Extension Reference</label>
				<div class="customSelectWrapper">
					<select class="form-control formInputBlue customSelectMenu" id="selectFileExt" name="fileExt" value="">
						<option value="">Select file extension</option>
						<option value="APK">APK</option>
						<option value="MP4">MP4</option>
						<option value="MP3">MP3</option>
					</select>
					<div class="form-control formInputBlue customSelectContainer">
						<span class="currentSelected">Select file extension</span>
						<i class="fas fa-caret-down"></i>
					</div>
				</div>
			</div>
			<div class="form-group text-center">
				<button type="button" class="btnContentManageBlue globalBtn" id="addCategoryBtn">Add</button>
			</div>
		</form>
	</section>
    <script src="../../../jsscripts/addMainCategory.js" defer></script>
</main>
<?php include('../../footer.php'); ?>