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
<main class="addSubCatContainer mainContainer">
    <section class="addSubCatHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/adminProfile.php?mobilenumber=<?php echo $_SESSION['mobileNumber']; ?>" id="addSubCatBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="addSubCatPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="addSubCatWrapper">
		<h2>ADD SUB CATEGORY</h2>
		<form id="subCategoryForm">
			<div class="form-group">
				<label for="selectMainCat" class="formLabel">Select Main Category</label>
				<div class="customSelectWrapper">
					<select class="form-control formInputBlue customSelectMenu" id="selectMainCat" name="selectMainCat" value="">
						<option value="">Select Main Category</option>
						<?php
							$stmt = mysqli_stmt_init($conn);
							$getCategories = "SELECT mainCatId, mainCatName FROM maincategories";
							mysqli_stmt_prepare($stmt, $getCategories);
							mysqli_stmt_execute($stmt);

							mysqli_stmt_store_result($stmt);

							$result = mysqli_stmt_num_rows($stmt);

							if($result > 0):
								mysqli_stmt_bind_result($stmt, $mainCatId, $mainCatName);
								while(mysqli_stmt_fetch($stmt)):
						?>
									<option value="<?php echo $mainCatName; ?>"><?php echo $mainCatName; ?></option>
						<?php
								endwhile;
							endif;
						?>
					</select>
					<div class="form-control formInputBlue customSelectContainer">
						<span class="currentSelected">Select Main Category</span>
						<i class="fas fa-caret-down"></i>
					</div>
				</div>
			</div>
			<div class="form-group">
				<label for="subCategoryName" class="formLabel">Sub Category Name</label>
				<input type="text" class="form-control formInputBlue" id="subCategoryName" name="subCategoryName">
			</div>
			<div class="form-group text-center">
				<button type="button" class="btnContentManageBlue globalBtn" id="addSubCategoryBtn">Add</button>
			</div>
		</form>
	</section>
    <script src="../../../jsscripts/addSubCategory.js" defer></script>
</main>
<?php include('../../footer.php'); ?>