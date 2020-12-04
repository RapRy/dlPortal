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
<main class="addBannerContainer mainContainer">
    <section class="addBannerHeader">
        <div class="backBtnContainer">
            <a href="<?php echo (isset($_GET['cat'])) ? "../../../pages/admin/manageContent/viewContents.php" : "../../../pages/admin/adminProfile.php?mobilenumber={$_SESSION['mobileNumber']}" ?>" id="addContentBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="addBannerPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="addBannerWrapper">
        <h2>ADD BANNER</h2>
        <form id="bannerForm" enctype='multiple/form-data' method='POST'>
            <div class="form-group">
				<label for="selectContent" class="formLabel">Content</label>
				<div class="customSelectWrapper customSelectContentWrapper">
					<select class="form-control formInputBlue customSelectContent" id="selectContent" name="selectContent" value="">
						<option value="">Select Content</option>
						<?php

							$stmt = mysqli_stmt_init($conn);
							$getContent = "SELECT contentId, contentName FROM contents";
							mysqli_stmt_prepare($stmt, $getContent);
							mysqli_stmt_execute($stmt);

							mysqli_stmt_store_result($stmt);

							$result = mysqli_stmt_num_rows($stmt);

							if($result > 0):
								mysqli_stmt_bind_result($stmt, $contentId, $contentName);
								while(mysqli_stmt_fetch($stmt)):
						?>
									<option 
										value="<?php echo $contentName; ?>"><?php echo $contentName; ?></option>
						<?php
								endwhile;
							endif;
						?>
					</select>
					<div class="form-control formInputBlue customSelectContainer customSelectContentContainer">
						<span class="currentSelected currentContentSelected">Select Content</span>
						<i class="fas fa-caret-down"></i>
					</div>
				</div>
            </div>
			<div class="custom-file">
				<span class="formLabel customFormLabel">Banner Image</span>
				<input type="file" class="custom-file-input" id="bannerImg" name="bannerImg">
				<label class="custom-file-label formInputBlue" for="bannerImg" id="bannerImgLabel">Only png and jpg are allowed. (300x215px)</label>
            </div>
            <div class="form-group">
				<label for="bannerTagLine" class="formLabel">Banner Tagline</label>
				<textarea class="form-control formInputBlue" id="bannerTagLine" rows="3"></textarea>
			</div>
			<div class="form-group text-center">
				<button type="button" class="btnContentManageBlue globalBtn" id="addBannerBtn">Add</button>
			</div>
			<!-- insert here -->
        </form>
    </section>
    <script src="../../../jsscripts/addBanner.js" defer></script>
</main>
<?php include('../../footer.php'); ?>