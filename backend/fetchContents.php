<?php require('connection/dbConnection.php'); ?>
<?php
    if(isset($_POST['catId'])){
        $catId = filter_var($_POST['catId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $subCatId = filter_var($_POST['subCatId'], FILTER_SANITIZE_SPECIAL_CHARS);

        $stmt = mysqli_stmt_init($conn);
        $fetchContents = "SELECT contentId, contentName, folderName, contentThumb, contentFilename, contentFileSize FROM contents WHERE subCatId = ? AND mainCatId = ?";
        mysqli_stmt_prepare($stmt, $fetchContents);
        mysqli_stmt_bind_param($stmt, "ii", $subCatId, $catId);
        mysqli_stmt_execute($stmt);

        mysqli_stmt_store_result($stmt);

        $resultData = mysqli_stmt_num_rows($stmt);

        if($resultData > 0){
            mysqli_stmt_bind_result($stmt, $contentId, $contentName, $folderName, $contentThumb, $contentFilename, $contentFileSize);

            $units = array('B', 'KB', 'MB', 'GB', 'TB'); 

            $bytes = max($contentFileSize, 0); 
            $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
            $pow = min($pow, count($units) - 1); 

            // Uncomment one of the following alternatives
            $bytes /= pow(1024, $pow);
            // $bytes /= (1 << (10 * $pow)); 

            $newFileSize = round($bytes, 2) . ' ' . $units[$pow]; 

            $dataContainer = [];

            while(mysqli_stmt_fetch($stmt)){
                array_push($dataContainer, 
                    [
                        "contentId" => $contentId,
                        "contentName" => $contentName,
                        "folderName" => $folderName,
                        "contentThumb" => $contentThumb,
                        "contentFilename" => $contentFilename,
                        "contentFileSize" => $newFileSize
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