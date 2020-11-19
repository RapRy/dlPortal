<?php include('header.php'); ?>
    <link rel="stylesheet" href="../stylesheets/styles.css">
</head>
<body>
<?php 
    require('../backend/connection/dbConnection.php');
    // get all session variables that we store in global
    session_start();
    // $test = $_SESSION['firstName'];

    if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<main class="previewContainer mainContainer">
    <img src="../assets/homeBg.svg" alt="" class="bg">
    <section class="contentContainer">
        <a href="../index.php" id="contentBackBtn"><i class="fas fa-level-up-alt"></i></a>
    <?php
        $idIndex = strpos($_GET['content'], "_") + 1;
        $contentId = substr($_GET['content'], $idIndex);

        $stmt = mysqli_stmt_init($conn);
        $contentDetails = "SELECT mainCatId, subCatName, mainCatName, contentName, folderName, contentDescription, contentThumb, contentFilename, contentFileSize FROM contents WHERE contentId = ?";
        mysqli_stmt_prepare($stmt, $contentDetails);
        mysqli_stmt_bind_param($stmt, "i", $contentId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $mainCatId, $subCatName, $mainCatName, $contentName, $folderName, $contentDescription, $contentThumb, $contentFilename, $contentFilseSize);
        mysqli_stmt_fetch($stmt);

        $mainCatName = str_replace(" ", "", $mainCatName);
        $subCatName = str_replace(" ", "", $subCatName);

        $contExt = pathinfo($contentFilename, PATHINFO_EXTENSION);
    ?>
        <?php
            if($contExt === "mp4"):
        ?>
            <div class="videoContainer">
                <video controls>
                    <source src="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/{$contentFilename}"; ?>" type="video/mp4">
                </video>
                <div class="controls">
                    <button class="mediaBtn" id="play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="mediaBtn" id="stop">
                        <i class="fas fa-stop"></i>
                    </button>
                    <input type="range" id="progress" class="mediaProgress" min="0" max="100" step="0.1" value="0" />
                    <span class="mediaTimestamp" id="timestamp">00:00</span>
                </div>
            </div>
        <?php
            else:
        ?>
            <div class="thumbAndName">
                <div class="thumb">
                    <img src="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/{$contentThumb}" ?>" alt="thumbnail">
                </div>
                <div class="name">
                    <p><?php echo $contentName; ?></p>
                    <span><?php echo $subCatName; ?></span>
                </div>
            </div>
        <?php
            endif;

            if($contExt === "apk" || $contExt === "xapk"): 
                $queryScreens = "SELECT screenshotName FROM screenshots WHERE contentId = ?";
                mysqli_stmt_prepare($stmt, $queryScreens);
                mysqli_stmt_bind_param($stmt, "i", $contentId);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $screenshotName);
        ?>
                <div class="contScreenshots">
                    <?php
                        while(mysqli_stmt_fetch($stmt)):
                    ?>
                        <img src="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/screenshots/{$screenshotName}" ?>" alt="">
                    <?php
                        endwhile;
                    ?>
                </div>
        <?php
            elseif($contExt === "mp3"):
        ?>
                <div class="audioControls">
                    <audio controls>
                        <source src="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/{$contentFilename}"; ?>" type="audio/mp3">
                    </audio>
                    <div class="controls">
                        <button class="mediaBtn" id="play">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="mediaBtn" id="stop">
                            <i class="fas fa-stop"></i>
                        </button>
                        <input type="range" id="progress" class="mediaProgress" min="0" max="100" step="0.1" value="0" />
                        <span class="mediaTimestamp" id="timestamp">00:00</span>
                    </div>
                </div>
        <?php 
            endif;
        ?>
        <div class="description">
            <h5>Description:</h5>
            <p><?php echo $contentDescription; ?></p>
        </div>
        <div class="reviewsContainer">
            <h5>Reviews</h5>
            <div class="reviewFormContainer">
                <form id="reviewForm" name="reviewForm">
                    <div class="form-group">
				        <textarea class="form-control formInputBlue" id="contentReview" rows="7"></textarea>
                    </div>
                    <div class="form-group text-center">
                        <button type="button" class="btnContentManageBlue globalBtn" id="addReviewBtn">Add Review</button>
                    </div>
                </form>
            </div>
            <div class="reviewsWrapper">
                <div class="review">
                    <div class="reviewMain">
                        <div class="reviewerThumb">
                            <img src="" alt="">
                        </div>
                        <div class="reviewerDetails">
                            <h6>Name</h6>
                            <p>comment</p>
                            <div>
                                <span class="reviewDate">date</span>
                                <span class="reviewTime">time</span>
                                <button class="replyBtn">
                                    <i class="fas fa-comment-dots"></i>
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="downloadContainer">
        <a href="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/{$contentFilename}"; ?>" class="btnContentManageBlue globalBtn">
            DOWNLOAD <?php echo $contentFilseSize; ?> mb
        </a>
    </section>
</main>

<?php include('footer.php') ?>