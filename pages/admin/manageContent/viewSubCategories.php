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
<main class="viewSubCatContainer mainContainer">
    <section class="viewSubCatHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/adminProfile.php?mobilenumber=<?php echo $_SESSION['mobileNumber']; ?>" id="viewSubCatBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="viewSubCatPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="viewSubCatWrapper">
		<?php
			$stmtCat = mysqli_stmt_init($conn);
			$getCategories = "SELECT mainCatId, mainCatName FROM maincategories";
			mysqli_stmt_prepare($stmtCat, $getCategories);
			mysqli_stmt_execute($stmtCat);
			
			mysqli_stmt_store_result($stmtCat);
			
			$resultCat = mysqli_stmt_num_rows($stmtCat);
			
			if($resultCat > 0):
				mysqli_stmt_bind_result($stmtCat, $mainCatId, $mainCatName);
				
				while(mysqli_stmt_fetch($stmtCat)):
		?>
					<div class="viewSubCat">
						<div class="viewSubCatTitle">
							<h6><?php echo $mainCatName; ?></h6>
						</div>
						<div class="viewSubCatListWrapper container">
							<?php
								$stmtSubCat = mysqli_stmt_init($conn);
								$getSubCategories = "SELECT subCatId, subCatName FROM subcategories WHERE mainCatId = ?";
								mysqli_stmt_prepare($stmtSubCat, $getSubCategories);
								mysqli_stmt_bind_param($stmtSubCat, "i", $mainCatId);
								mysqli_stmt_execute($stmtSubCat);
								
								mysqli_stmt_store_result($stmtSubCat);
								
								$resultSubCat = mysqli_stmt_num_rows($stmtSubCat);
								
								if($resultSubCat > 0):
									mysqli_stmt_bind_result($stmtSubCat, $subCatId, $subCatName);
									
									while(mysqli_stmt_fetch($stmtSubCat)):
							?>
										<div class="subCatContainer row align-items-center">
											<div class="subCatNameContainer col-8">
												<p class="subCatName"><?php echo $subCatName; ?></p>
											</div>
											<div class="viewSubCatCta col-4">
												<a href="./editSubCategory.php?category=<?php echo $mainCatName; ?>&subcategory=<?php echo $subCatName; ?>" class="btnBlueSolid btnLink editSubCategoryBtn">
													<i class="fas fa-edit"></i>
												</a>
												<button type="button" class="btnRedSolid deleteSubCategoryBtn">
													<i class="fas fa-trash-alt"></i>
												</button>
											</div>
										</div>
							<?php
									endwhile;
									mysqli_stmt_close($stmtSubCat);
								endif;
							?>
						</div>
					</div>
		<?php
				endwhile;
				mysqli_stmt_close($stmtCat);
			endif;
			mysqli_close($conn);
		?>
	</section>
	<script src="../../../jsscripts/viewSubCategories.js" defer></script>
</main>
<?php include('../../footer.php'); ?>