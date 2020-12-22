<?php require('backend/connection/dbConnection.php'); ?>
<main class="homeContainer mainContainer">
    <section class="homeHeader">
        <img src="assets/downloadStoreLogo.svg" alt="Download Store" class="logo">
        <img src="assets/homeBg.svg" alt="" class="bg">
        <div class="userIconContainer">
			<div class="userIcon">
				<span class="userFirstName">Hi, <?php echo $_SESSION['firstName']; ?></span>
				<a href="<?php echo ($_SESSION['userType'] === "admin") ? "pages/admin/adminProfile.php?mobilenumber=".$_SESSION['mobileNumber']."" : "pages/user/profile.php?mobilenumber=".$_SESSION['mobileNumber'].""; ?>" class="homeUserThumb" id="homeUserThumb">
					<img src="<?php echo (!empty($_SESSION['profilePic']) || $_SESSION['profilePic'] != null) ? "uploads/avatars/".$_SESSION['mobileNumber']."/".$_SESSION['profilePic'] : "assets/userThumb.png" ?>" alt="">
				</a>
			</div>
        </div>
    </section>
    <section class="homeWrapper">
		<section class="featuredWrapper">
			<h2>FEATURED</h2>
			<div class="featuredSlide" id="featuredSlide">
				<?php
					$stmtFeatured = mysqli_stmt_init($conn);
					$fetchFeatured = "SELECT * FROM featured";

					mysqli_stmt_prepare($stmtFeatured, $fetchFeatured);
					mysqli_stmt_execute($stmtFeatured);

					mysqli_stmt_bind_result($stmtFeatured, $featuredId, $contentId, $contentName, $featureDesc, $featureImage);

					while(mysqli_stmt_fetch($stmtFeatured)):
				?>
						<a draggable="false" href="pages/preview.php?content=<?php echo substr($featureImage, 0, strpos($featureImage, "_"))."_".$contentId; ?>" class="featuredImgCont">
							<p><?php echo $featureDesc; ?></p>
							<img draggable="false" src="uploads/banners/<?php echo $featureImage; ?>" alt="">
						</a>
				<?php
					endwhile;
				?>
			</div>
		</section>
		<section class="menuCategoryWrapper container">
			<?php
				$stmt = mysqli_stmt_init($conn);
				$fetchCategories = "SELECT * FROM maincategories";
				
				mysqli_stmt_prepare($stmt, $fetchCategories);
				mysqli_stmt_execute($stmt);
				
				mysqli_stmt_store_result($stmt);
				
				$resultData = mysqli_stmt_num_rows($stmt);
				
				if($resultData > 0):
					mysqli_stmt_bind_result($stmt, $mainCatId, $mainCatName, $mainCatIcon, $mainCatExt);
					
					while(mysqli_stmt_fetch($stmt)):

			?>
			<div class="catWrapper">
				<div class="menuCategory btnGreenGradient row no-gutters align-items-center">
					<input type="hidden" name="catId" value="<?php echo $mainCatId; ?>" />
					<input type="hidden" name="catExt" value="<?php echo $mainCatExt; ?>" />
					<div class="catIconWrapper col-1">
						<img src="uploads/categoryIcons/<?php echo str_replace(" ", "", $mainCatName)."/".$mainCatIcon ?>" alt="icon" />
					</div>
					<div class="catNameWrapper col-10">
						<span class="col-2"><?php echo strtoupper($mainCatName); ?></span>
					</div>
					<div class="catArrowWrapper col-1">
						<i class="fas fa-chevron-right col-1"></i>
					</div>
				</div>
			</div>
			<?php
					endwhile;
					mysqli_stmt_close($stmt);
				endif;
				mysqli_close($conn);
			?>
		</section>
    </section>
</main>
<script src="jsScripts/home.js" defer></script>