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
<main class="viewBannersContainer mainContainer">
    <section class="viewBannersHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/adminProfile.php?mobilenumber=<?php echo $_SESSION['mobileNumber']; ?>" id="viewBannersBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="viewBannersPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="viewBannersWrapper">
        <section class="bannersWrapper">
            <div class="viewBanners">
                <h6>Featured Banners</h6>
            <?php
                $stmt = mysqli_stmt_init($conn);
                $getBanners = "SELECT featureId, contentName, featureDesc, featureImage FROM featured";
                mysqli_stmt_prepare($stmt, $getBanners);
                mysqli_stmt_execute($stmt);

                mysqli_stmt_store_result($stmt);

                $result = mysqli_stmt_num_rows($stmt);

                if($result > 0):
                    mysqli_stmt_bind_result($stmt, $featureId, $contentName, $featureDesc, $featureImage);

                    while(mysqli_stmt_fetch($stmt)):
            ?>
                      <div class="bannerContainer container">
                          <div class="bannerDetailsContainer row align-items-center">
                                <input type="hidden" value="<?php echo $featureId; ?>" />
                                <input type="hidden" value="<?php echo $featureImage; ?>" />
                                <span class="bannerName col-10"><?php echo $contentName; ?></span>
                                <button type="button" class="btnRedSolid deleteBannerBtn col-2">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                          </div>
                          <div class="bannerImgContainer">
                              <p><?php echo $featureDesc; ?></p>
                              <img src="../../../uploads/banners/<?php echo $featureImage; ?>" alt="">
                          </div>
                      </div>  
            <?php
                    endwhile;
                else:
            ?>
                    <p>No Banners</p>
            <?php
                endif;
            ?>
            </div>
        </section>
    </section>
    <script src="../../../jsscripts/viewbanners.js" defer></script>
</main>

<?php include('../../footer.php'); ?>