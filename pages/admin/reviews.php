<?php require('../../backend/connection/dbConnection.php'); ?>
<?php 
	session_start(); 

	if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<section class="reviewsWrapper menuAdminProfileDivs">
    <section class="reviews container">
        <h2>REVIEWS</h2>
        <section class="reviewsContainer container">
            <?php
                $stmt = mysqli_stmt_init($conn);
                $fetchReviews = "SELECT userId, contentId, reviewRef, reviewType, reviewDescription, reviewDate FROM reviews ORDER BY reviewDate DESC";
                mysqli_stmt_prepare($stmt, $fetchReviews);
                mysqli_stmt_execute($stmt);

                mysqli_stmt_store_result($stmt);

                $result = mysqli_stmt_num_rows($stmt);

                if($result > 0):
                    mysqli_stmt_bind_result($stmt, $userId, $contentId, $reviewRef, $reviewType, $reviewDescription, $reviewDate);

                    $dataContainer = [];

                    while(mysqli_stmt_fetch($stmt)){
                        $date = date_parse($reviewDate);
                        $dateMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        $newData = [
                            "userId" => $userId,
                            "contentId" => $contentId,
                            "reviewRef" => $reviewRef,
                            "reviewType" => $reviewType,
                            "reviewDescription" => $reviewDescription,
                            "reviewDate" => [
                                "month" => $dateMonth[$date['month'] - 1],
                                "day" => $date['day'],
                                "year" => $date['year'],
                                "hour" => date("g", strtotime($reviewDate)),
                                "minutes" => ($date['minute'] < 10) ? "0".$date['minute'] : $date['minute'],
                                "ampm" => date("a", strtotime($reviewDate)),
                                "fullDate" => $reviewDate
                            ],
                            "refDate" => $dateMonth[$date['month'] - 1]."-".$date['day']."-".$date['year'],
                            "refTime" => date("g", strtotime($reviewDate))."-".$date['minute']."-".date("a", strtotime($reviewDate))
                        ];

                        array_push($dataContainer, $newData);
                    }

                    $refDateContainer = [];

                    foreach($dataContainer as $data){
                        array_push($refDateContainer, $data['refDate']);
                    }
                    // remove duplicate dates and return 1 date value per duplicates
                    $refDateContainer = array_unique($refDateContainer);
                    // reassign indexes
                    $refDateContainer = array_values($refDateContainer);

                    $newDataContainer = [];

                    for($x = 0; $x < count($refDateContainer); $x++){
                        $dataTempContainer = [];
                        for($i = 0;$i < count($dataContainer); $i++){
                            if($dataContainer[$i]['refDate'] == $refDateContainer[$x]){
                                array_push($dataTempContainer, $dataContainer[$i]);
                            }
                        }

                        $dataNewTempContainer = ["dateRef" => $refDateContainer[$x], "data" => $dataTempContainer];

                        array_push($newDataContainer, $dataNewTempContainer);
                    }

                    foreach($newDataContainer as $data):
                        $date = explode("-", $data['dateRef']);
            ?>
                        <div class="reviewWrap row">
                            <div class="reviewDate col-3 h-25">
                                <span class="reviewDateDate"><?php echo $date[1]; ?></span>
                                <span class="reviewDateMonth"><?php echo $date[0]; ?></span>
                                <span class="reviewDateYear"><?php echo $date[2]; ?></span>
                            </div>
                            <div class="reviewDescWrap col-9">
                                <?php
                                    foreach($data['data'] as $data):
                                        $stmtUser = mysqli_stmt_init($conn);
                                        $getUserName = "SELECT firstName, LastName FROM users WHERE userId = ?";
                                        mysqli_stmt_prepare($stmtUser, $getUserName);
                                        mysqli_stmt_bind_param($stmtUser, "i", $data['userId']);
                                        mysqli_stmt_execute($stmtUser);
                                        mysqli_stmt_store_result($stmtUser);
                                        mysqli_stmt_bind_result($stmtUser, $firstName, $LastName);
                                        mysqli_stmt_fetch($stmtUser);

                                        $stmtContent = mysqli_stmt_init($conn);
                                        $queryContent = "SELECT contentName, subCatName, folderName FROM contents WHERE contentId = ?";
                                        mysqli_stmt_prepare($stmtContent, $queryContent);
                                        mysqli_stmt_bind_param($stmtContent, "i", $data['contentId']);
                                        mysqli_stmt_execute($stmtContent);
                                        mysqli_stmt_store_result($stmtContent);
                                        mysqli_stmt_bind_result($stmtContent, $contentName, $subCatName, $folderName);
                                        mysqli_stmt_fetch($stmtContent);
                                ?>
                                        <div class="reviewDesc">
                                            <span class="reviewTime"><?php echo $data['reviewDate']['hour'].":".$data['reviewDate']['minutes']." ".$data['reviewDate']['ampm']; ?></span>
                                            <?php
                                                $message = "";
                                                if($data['reviewType'] === "mainReview"){
                                                    $message = "<span class='activityHighlight2'>{$firstName} {$LastName}</span> wrote a review about <a href='../preview.php?content={$folderName}_{$data['contentId']}' class='activityHighlight'>{$contentName}</a>";
                                                }else{
                                                    $message = "<span class='activityHighlight2'>{$firstName} {$LastName}</span> wrote a comment on a review about <a href='../preview.php?content={$folderName}_{$data['contentId']}' class='activityHighlight'>{$contentName}</a>";
                                                }
                                            ?>
                                            <p><?php echo $message.":"; ?></p>
                                            <p>" <?php echo $data['reviewDescription']; ?> "</p>
                                        </div>
                                <?php
                                    endforeach;
                                ?>
                            </div>
                        </div>
            <?php
                    endforeach;
                else:
            ?>
                    <div class="noRecords">
                        <p class="noRecordsText">No Reviews</p>
                    </div>
            <?php
                endif;
            ?>
        </section>
    </section>
</section>
