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
<main class="viewMainCatContainer mainContainer">
    <section class="viewMainCatHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/adminProfile.php?mobilenumber=<?php echo $_SESSION['mobileNumber']; ?>" id="viewMainCatBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="viewMainCatPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="viewMainCatWrapper">
		<div class="viewMainCat">
            <div class="viewMainCatTitle">
                <h6>Categories</h6>
            </div>
            <div class="viwMainCatListWrapper container">
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
						<div class="mainCatContainer row align-items-center">
							<input type="hidden" class="categoryId" value="<?php echo $mainCatId; ?>" />
							<div class="catNameContainer col-8">
								<p class="catName"><?php echo $mainCatName; ?></p>
							</div>
							<div class="viewMainCatCta col-4">
								<a href="./editMainCategory.php?category=<?php echo $mainCatName; ?>" class="btnBlueSolid btnLink editCategoryBtn">
									<i class="fas fa-edit"></i>
								</a>
								<button type="button" class="btnRedSolid deleteCategoryBtn">
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
			<?php
					endwhile;
				mysqli_stmt_close($stmt);
				endif;
				
				mysqli_close($conn);
			?>
            </div>
        </div>
	</section>
	<script src="../../../jsscripts/deleteMainCategory.js" defer></script>
</main>
<?php include('../../footer.php'); ?>