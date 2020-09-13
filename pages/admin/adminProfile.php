<?php include('../header.php'); ?>
    <link rel="stylesheet" href="../../stylesheets/styles.css">
</head>
<?php
    require('../../backend/connection/dbConnection.php');
    session_start();

    if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }

?>
<main class="adminProfileContainer mainContainer">
    <section class="adminProfileHeader">
        <div class="backBtnContainer">
            <a href="../../index.php" id="adminProfileBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../assets/downloadStoreLogo.svg" alt="Download Store" class="adminPageLogo">
        <img src="../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="adminProfileWrapper">
        <section class="adminMenuWrapper container">
            <section class="adminAccountMenu container">
                <div class="adminAcctBtn btnProfileManage">
                    <i class="fas fa-users"></i>
                    <span>Manage Users</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
                <div class="adminAcctBtn btnProfileManage">
                    <i class="fas fa-th"></i>
                    <span>Manage Contents</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
                <div class="adminAcctBtn btnProfileManage">
                    <i class="fas fa-comments"></i>
                    <span>Reviews</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
            </section>
            <section class="adminAccountLogOut container">
                <button type="submit" class="btnGreenGradient globalBtn" id="adminLogoutBtn">
                    <input type="hidden" value="<?php echo $_SESSION['userId']; ?>" />
                    <i class="fas fa-sign-out-alt"></i>
                    <span>SIGN OUT</span>
                </button>
            </section>
        </section>
    </section>
    <script src="../../jsscripts/adminProfile.js" defer></script>
</main>
<?php include('../footer.php'); ?>