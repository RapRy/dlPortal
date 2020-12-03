<?php require('connection/dbConnection.php'); ?>
<?php
    if(isset($_POST['userId'])){
        $stmt = mysqli_stmt_init($conn);
        $fetchActivities = "SELECT activityId, userId, activityType, userActivity, userActivityDesc, activityDate FROM userslog WHERE userId=? ORDER BY activityDate DESC";
        mysqli_stmt_prepare($stmt, $fetchActivities);
        mysqli_stmt_bind_param($stmt, "i", $_POST['userId']);
        mysqli_stmt_execute($stmt);

        mysqli_stmt_store_result($stmt);

        $resultData = mysqli_stmt_num_rows($stmt);

        if($resultData > 0){
            mysqli_stmt_bind_result($stmt, $activityId, $userId, $activityType, $userActivity, $userActivityDesc, $activityDate);

            $dataContainer = [];

            while(mysqli_stmt_fetch($stmt)){
                $date = date_parse($activityDate);
                $dateMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                
                $newData = [
                    "downloadData" => [],
                    "contentData" => [],
                    "activityId" => $activityId,
                    "userId" => $userId,
                    "activityType" => $activityType,
                    "userActivity" => $userActivity,
                    "userActivityDesc" => $userActivityDesc,
                    "activityDate" => [
                        "month" => $dateMonth[$date['month'] -  1],
                        "day" => $date['day'],
                        "year" => $date['year'],
                        "hour" => date("g", strtotime($activityDate)),
                        "minutes" => ($date['minute'] < 10) ? "0".$date['minute'] : $date['minute'],
                        "ampm" => date("a", strtotime($activityDate)),
                        "fullDate" => $activityDate
                    ],
                    // reference of date and time
                    "refDate" => $dateMonth[$date['month'] -  1]."-".$date['day']."-".$date['year'],
                    "refTime" => date("g", strtotime($activityDate))."-".$date['minute']."-".date("a", strtotime($activityDate))
                ];

                if($activityType == "review"){
                    $stmtRev = mysqli_stmt_init($conn);
                    $queryRev = "SELECT contentId FROM reviews WHERE reviewType = ? AND reviewDate = ?";

                    mysqli_stmt_prepare($stmtRev, $queryRev);
                    mysqli_stmt_bind_param($stmtRev, "ss", $userActivity, $activityDate);
                    mysqli_stmt_execute($stmtRev);
                    mysqli_stmt_store_result($stmtRev);
                    mysqli_stmt_bind_result($stmtRev, $contentId);
                    mysqli_stmt_fetch($stmtRev);

                    $stmtContent = mysqli_stmt_init($conn);
                    $queryContent = "SELECT contentName, subCatName, folderName FROM contents WHERE contentId = ?";
                    mysqli_stmt_prepare($stmtContent, $queryContent);
                    mysqli_stmt_bind_param($stmtContent, "i", $contentId);
                    mysqli_stmt_execute($stmtContent);
                    mysqli_stmt_store_result($stmtContent);
                    mysqli_stmt_bind_result($stmtContent, $contentName, $subCatName, $folderName);
                    mysqli_stmt_fetch($stmtContent);

                    $contenData = ['contentId' => $contentId, 'contentName' => $contentName, 'subCatName' => $subCatName, 'folderName' => $folderName];

                    $newData['contentData'] = $contenData;

                }else if($activityType == "contentDownload"){
                    $stmtContentDL = mysqli_stmt_init($conn);
                    $queryContentDL = "SELECT contentId, subCatName, folderName FROM contents WHERE contentName = ?";
                    mysqli_stmt_prepare($stmtContentDL, $queryContentDL);
                    mysqli_stmt_bind_param($stmtContentDL, "s", $userActivity);
                    mysqli_stmt_execute($stmtContentDL);
                    mysqli_stmt_store_result($stmtContentDL);
                    mysqli_stmt_bind_result($stmtContentDL, $contentId, $subCatName, $folderName);
                    mysqli_stmt_fetch($stmtContentDL);

                    $contenDataDL = ['contentIdDL' => $contentId, 'contentNameDL' => $userActivity, 'subCatNameDL' => $subCatName, 'folderNameDL' => $folderName];

                    $newData['downloadData'] = $contenDataDL;
                }
                
                array_push($dataContainer, $newData);
            }

            $refDateContainer = [];

            foreach($dataContainer as $data){
                // get all reference date and push it to new array
                array_push($refDateContainer, $data['refDate']);
            }

            // remove duplicate dates and return 1 date value per duplicates
            $refDateContainer = array_unique($refDateContainer);
            // reassign indexes
            $refDateContainer = array_values($refDateContainer);
            
            $newDataContainer = [];

            for($x = 0; $x < count($refDateContainer); $x++){
                // loop through the reference date array
                // container for the datas that has the same date 
                $dataTempContainer = [];
                for($i = 0;$i < count($dataContainer); $i++){
                    // loop through all the data then push all the data to the data container that matches the reference date until the inner iteration is done
                    if($dataContainer[$i]['refDate'] == $refDateContainer[$x]){
                        array_push($dataTempContainer, $dataContainer[$i]);
                    }
                }
                // create new array then assign the reference date and the datas that matches the reference date 
                $dataNewTempContainer = ["dateRef" => $refDateContainer[$x], "data" => $dataTempContainer];
                // push the newly created array as a new array to the container array
                // until outer iteration is finished
                array_push($newDataContainer, $dataNewTempContainer);
            }

            echo json_encode($newDataContainer);
            mysqli_stmt_close($stmt);
        }else{
            echo json_encode(['result' => 'No Activity']);
        }

        mysqli_close($conn);
    }
?>