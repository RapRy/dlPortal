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
<main class="previewContainer mainContainer container">
    <img src="../assets/homeBg.svg" alt="" class="bg">
    <section class="contentContainer">
        <a href="../index.php" id="contentBackBtn" class="contentBackBtn">
            <i class="fas fa-level-up-alt"></i>
        </a>
    <?php
        $idIndex = strpos($_GET['content'], "_") + 1;
        $contentId = substr($_GET['content'], $idIndex);

        $stmt = mysqli_stmt_init($conn);
        $contentDetails = "SELECT mainCatId, subCatName, mainCatName, contentName, folderName, contentDescription, contentThumb, contentFilename, contentFileSize FROM contents WHERE contentId = ?";
        mysqli_stmt_prepare($stmt, $contentDetails);
        mysqli_stmt_bind_param($stmt, "i", $contentId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $mainCatId, $subCatName, $mainCatName, $contentName, $folderName, $contentDescription, $contentThumb, $contentFilename, $contentFileSize);
        mysqli_stmt_fetch($stmt);

        $mainCatName = str_replace(" ", "", $mainCatName);
        $subCatName = str_replace(" ", "", $subCatName);

        $contExt = pathinfo($contentFilename, PATHINFO_EXTENSION);
        $units = array('B', 'KB', 'MB', 'GB', 'TB'); 

        $bytes = max($contentFileSize, 0); 
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
        $pow = min($pow, count($units) - 1); 

        // Uncomment one of the following alternatives
        $bytes /= pow(1024, $pow);
        // $bytes /= (1 << (10 * $pow)); 

        $newFileSize = round($bytes, 2) . ' ' . $units[$pow]; 
    ?>
    <input type="hidden" id="contentId" value="<?php echo $contentId; ?>" />
    <input type="hidden" id="mainCatName" value="<?php echo $mainCatName; ?>" />
    <input type="hidden" id="subCatName" value="<?php echo $subCatName; ?>" />
    <input type="hidden" id="folderName" value="<?php echo $folderName; ?>" />
    <input type="hidden" id="contentFilename" value="<?php echo $contentFilename; ?>" />
    <input type="hidden" id="contentName" value="<?php echo $contentName; ?>" />
        <?php
            if($contExt === "mp4"):
        ?>
            <div class="videoContainer">
                <video id="video">
                    <source src="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/{$contentFilename}"; ?>" type="video/mp4">
                </video>
                <div class="controls row">
                    <button class="mediaBtn col-1 align-self-center" id="play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="mediaBtn col-1 align-self-center" id="stop">
                        <i class="fas fa-stop"></i>
                    </button>
                    <input type="range" id="progress" class="mediaProgress align-self-center col-8" min="0" max="100" step="0.1" value="0" />
                    <span class="mediaTimestamp col-1" id="timestamp">00:00</span>
                </div>
                <div class="videoName">
                    <p><?php echo $contentName; ?></p>
                    <span><?php echo $subCatName; ?></span>
                </div>
            </div>
        <?php
            else:
        ?>
            <div class="thumbAndName row">
                <div class="thumb col-4">
                    <img src="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/{$contentThumb}" ?>" alt="thumbnail">
                </div>
                <div class="name col-8 align-self-center">
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
                        <img src="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/screenshots/{$screenshotName}" ?>" alt="" draggable="false">
                    <?php
                        endwhile;
                    ?>
                </div>
        <?php
            elseif($contExt === "mp3"):
        ?>
                <div class="audioControls">
                    <audio id="audio">
                        <source src="../uploads/contents/<?php echo "{$mainCatName}/{$subCatName}/{$folderName}/{$contentFilename}"; ?>" type="audio/mp3">
                    </audio>
                    <div class="controls row">
                        <button class="mediaBtn col-1 align-self-center" id="play">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="mediaBtn col-1 align-self-center" id="stop">
                            <i class="fas fa-stop"></i>
                        </button>
                        <input type="range" id="progress" class="mediaProgress align-self-center col-8" min="0" max="100" step="0.1" value="0" />
                        <span class="mediaTimestamp col-1" id="timestamp">00:00</span>
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
				        <textarea class="form-control formInputGreen" name="contentReview" id="contentReview" rows="4"></textarea>
                    </div>
                    <div class="form-group text-center">
                        <button type="button" class="btnGreenGradient reviewBtn globalBtn" id="submitReviewBtn">Post Review</button>
                    </div>
                </form>
            </div>
            <div class="reviewsWrapper">
                <?php
                    $fetchReviews = "SELECT reviewId, userId, reviewType, reviewDescription, reviewDate FROM reviews WHERE contentId = ? AND reviewRef = 0";
                    mysqli_stmt_prepare($stmt, $fetchReviews);
                    mysqli_stmt_bind_param($stmt, "i", $contentId);
                    mysqli_stmt_execute($stmt);
                    mysqli_stmt_store_result($stmt);
                    $resultRevs = mysqli_stmt_num_rows($stmt);
                    if($resultRevs > 0):
                        mysqli_stmt_bind_result($stmt, $mainReviewId, $mainUserId, $mainReviewType, $mainReviewDescription, $mainReviewDate);

                        while(mysqli_stmt_fetch($stmt)):
                            $dateMainReview = date_parse($mainReviewDate);
                            $dateMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                            $mainHour = date('g', strtotime($mainReviewDate));
                            $mainMin = ($dateMainReview['minute'] < 10) ? "0".$dateMainReview['minute'] : $dateMainReview['minute'];
                            $mainAmPm =date("a", strtotime($mainReviewDate));

                            $mainTime = "{$mainHour}:{$mainMin} {$mainAmPm}";
                            $mainDate = "{$dateMonth[$dateMainReview['month'] - 1]} {$dateMainReview['day']}, {$dateMainReview['year']}";
                ?>
                                <!-- review class start -->
                                <div class="review">
                <?php
                            if($mainReviewType === "mainReview"):
                                $getUser = "SELECT profilePicture, firstName, lastName, mobileNumber FROM users WHERE userId = ?";
                                $stmtUser = mysqli_stmt_init($conn);
                                mysqli_stmt_prepare($stmtUser, $getUser);
                                mysqli_stmt_bind_param($stmtUser, "i", $mainUserId);
                                mysqli_stmt_execute($stmtUser);
                                mysqli_stmt_store_result($stmtUser);
                                mysqli_stmt_bind_result($stmtUser, $profilePicture, $firstName, $lastName, $mobileNumber);
                                mysqli_stmt_fetch($stmtUser);
                ?>
                                    <div class="reviewMain row">
                                        <input type="hidden" value="<?php echo $mainReviewId; ?>" />
                                        <div class="reviewerThumb col-3">
                                            <img src="../uploads/avatars/<?php echo "{$mobileNumber}/{$profilePicture}"; ?>" alt="">
                                        </div>
                                        <div class="reviewerDetails col-9">
                                            <h6><?php echo "{$firstName} {$lastName}"; ?></h6>
                                            <p><?php echo $mainReviewDescription; ?></p>
                                            <div>
                                                <span class="reviewDate"><?php echo $mainDate; ?></span>
                                                <span class="reviewTime"><?php echo $mainTime; ?></span>
                                                <button class="commentBtn">
                                                    <i class="fas fa-comment-dots"></i>
                                                    Comment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                <?php
                            endif;
                                    $stmtSubRev = mysqli_stmt_init($conn);
                                    $fetchSubRev = "SELECT reviewId, userId, reviewType, reviewDescription, reviewDate FROM reviews WHERE reviewRef = ?";
                                    mysqli_stmt_prepare($stmtSubRev, $fetchSubRev);
                                    mysqli_stmt_bind_param($stmtSubRev, "i", $mainReviewId);
                                    mysqli_stmt_execute($stmtSubRev);
                                    mysqli_stmt_store_result($stmtSubRev);
                                    $resultSubRevs = mysqli_stmt_num_rows($stmtSubRev);
                                    if($resultSubRevs > 0):
                ?>
                                        <div class="reviewSub row justify-content-end">
                <?php
                                        mysqli_stmt_bind_result($stmtSubRev, $subReviewId, $subUserId, $subReviewType, $subReviewDescription, $subReviewDate);

                                        while(mysqli_stmt_fetch($stmtSubRev)):
                                            $dateSubReview = date_parse($subReviewDate);

                                            $subHour = date('g', strtotime($subReviewDate));
                                            $subMin = ($dateSubReview['minute'] < 10) ? "0".$dateSubReview['minute'] : $dateSubReview['minute'];
                                            $subAmPm =date("a", strtotime($subReviewDate));

                                            $subTime = "{$subHour}:{$subMin} {$subAmPm}";
                                            $subDate = "{$dateMonth[$dateSubReview['month'] - 1]} {$dateSubReview['day']}, {$dateSubReview['year']}";

                                            if($subReviewType === "subReview"):
                                                $getSubUser = "SELECT profilePicture, firstName, lastName, mobileNumber FROM users WHERE userId = ?";
                                                $stmtSubUser = mysqli_stmt_init($conn);
                                                mysqli_stmt_prepare($stmtSubUser, $getSubUser);
                                                mysqli_stmt_bind_param($stmtSubUser, "i", $subUserId);
                                                mysqli_stmt_execute($stmtSubUser);
                                                mysqli_stmt_store_result($stmtSubUser);
                                                mysqli_stmt_bind_result($stmtSubUser, $subProfilePicture, $subFirstName, $subLastName, $subMobileNumber);
                                                mysqli_stmt_fetch($stmtSubUser);
                ?>
                                                    
                                                        <div class="commentContainer col-9">
                                                            <h6><?php echo "{$subFirstName} {$subLastName}"; ?></h6>
                                                            <p><?php echo $subReviewDescription; ?></p>
                                                            <div>
                                                                <span class="reviewDate"><?php echo $subDate; ?></span>
                                                                <span class="reviewTime"><?php echo $subTime; ?></span>
                                                            </div>
                                                        </div>       
                <?php
                                            endif;
                                        endwhile;
                ?>
                                        </div>
                <?php
                                    endif;
                ?>
                                <!-- review class end -->
                                </div>
                <?php
                        endwhile;
                    endif;
                ?>
            </div>
        </div>
    </section>
    <section class="downloadContainer">
        <a id="dlButton" href="#" class="btnGreenGradient contDlBtn globalBtn">
            DOWNLOAD (<?php echo $newFileSize; ?>)
        </a>
    </section>
</main>
<?php 
    mysqli_stmt_close($stmt); 
    mysqli_close($conn);
?>

<script src="../jsscripts/preview.js" defer></script>

<?php include('footer.php') ?>