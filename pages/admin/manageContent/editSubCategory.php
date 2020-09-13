<?php include('../../header.php'); ?>
    <link rel="stylesheet" href="../../../stylesheets/styles.css">
</head>
<?php
    require('../../../backend/connection/dbConnection.php');
    session_start();

    if(empty($_SESSION['userId'])){
        header('Location: ../../signIn.php');
    }

    if(isset($_GET['subcategory'])){
        $stmtSubCat = mysqli_stmt_init($conn);
        $getSubCategories = "SELECT subCatId, mainCatId, subCatName FROM subcategories WHERE subCatName=? ";
        mysqli_stmt_prepare($stmtSubCat, $getSubCategories);
        mysqli_stmt_bind_param($stmtSubCat, "s", $_GET['subcategory']);
        mysqli_stmt_execute($stmtSubCat);

        mysqli_stmt_store_result($stmtSubCat);
        
        $result = mysqli_stmt_num_rows($stmtSubCat);
		
		if($result > 0){
			mysqli_stmt_bind_result($stmtSubCat, $subCatId, $mainCatIdForeign, $subCatName);
            mysqli_stmt_fetch($stmtSubCat);
            mysqli_stmt_close($stmtSubCat);
		}
    }

?>
<main class="editSubCatContainer mainContainer">
    <section class="editSubCatHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/adminProfile.php?mobilenumber=<?php echo $_SESSION['mobileNumber']; ?>" id="editSubCatBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="editSubCatPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="editSubCatWrapper">
		<h2>EDIT SUB CATEGORY</h2>
		<form id="subCategoryForm">
			<div class="form-group">
				<label for="selectMainCat" class="formLabel">Select Main Category</label>
				<div class="customSelectWrapper">
					<select class="form-control formInputBlue customSelectMenu" id="selectMainCat" name="selectMainCat" value="">
						<option value="">Select Main Category</option>
						<?php
							$stmtCat = mysqli_stmt_init($conn);
							$getCategories = "SELECT mainCatId, mainCatName FROM maincategories";
							mysqli_stmt_prepare($stmtCat, $getCategories);
							mysqli_stmt_execute($stmtCat);

							mysqli_stmt_store_result($stmtCat);

                            $result = mysqli_stmt_num_rows($stmtCat);
                            
                            $currentCat = "";

							if($result > 0):
								mysqli_stmt_bind_result($stmtCat, $mainCatIdPrimary, $mainCatName);
                                while(mysqli_stmt_fetch($stmtCat)):
                                    if($mainCatIdForeign === $mainCatIdPrimary){
                                        $currentCat = $mainCatName;
                                    }
						?>
									<option value="<?php echo $mainCatName; ?>" <?php echo ($mainCatIdForeign === $mainCatIdPrimary) ? "selected" : ""; ?> ><?php echo $mainCatName; ?></option>
						<?php
                                endwhile;
                                mysqli_stmt_close($stmtCat);
							endif;
						?>
					</select>
					<div class="form-control formInputBlue customSelectContainer">
						<span class="currentSelected"><?php echo $currentCat; ?></span>
						<i class="fas fa-caret-down"></i>
					</div>
				</div>
			</div>
			<div class="form-group">
				<label for="subCategoryName" class="formLabel">Sub Category Name</label>
				<input type="text" class="form-control formInputBlue" id="subCategoryName" name="subCategoryName" value="<?php echo $subCatName; ?>">
			</div>
			<div class="form-group text-center">
				<button type="button" class="btnContentManageBlue globalBtn" id="editSubCategoryBtn">Edit</button>
			</div>
		</form>
	</section>
    <script src="../../../jsscripts/editSubCategory.js" defer></script>
</main>
<?php mysqli_close($conn); ?>
<?php include('../../footer.php'); ?>