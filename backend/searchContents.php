<?php require('connection/dbConnection.php'); ?>
<?php
    if(isset($_POST['searchValue'])){
        $searchValue = filter_var($_POST['searchValue'], FILTER_SANITIZE_SPECIAL_CHARS);

        $value = "%{$searchValue}%";

        $stmt = mysqli_stmt_init($conn);
        $fetchContents = "SELECT contentId, contentName, folderName, contentThumb, contentFilename, contentFileSize FROM contents WHERE contentName LIKE ?";

        mysqli_stmt_prepare($stmt, $fetchContents);
        mysqli_stmt_bind_param($stmt, "s", $value);
        mysqli_stmt_execute($stmt);

        mysqli_stmt_store_result($stmt);

        $resultData = mysqli_stmt_num_rows($stmt);

        if($resultData > 0){
            mysqli_stmt_bind_result($stmt, $contentId, $contentName, $folderName, $contentThumb, $contentFilename, $contentFileSize);

            $dataContainer = [];

            while(mysqli_stmt_fetch($stmt)){
                array_push($dataContainer, 
                    [
                        "contentId" => $contentId,
                        "contentName" => $contentName,
                        "folderName" => $folderName,
                        "contentThumb" => $contentThumb,
                        "contentFilename" => $contentFilename,
                        "contentFileSize" => $contentFileSize
                    ]
                );
            }

            echo json_encode($dataContainer);
        }else{
            echo json_encode([]);
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }
?>