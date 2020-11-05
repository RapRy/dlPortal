<?php require('connection/dbConnection.php'); ?>
<?php
    function fetchSubCats($catId, $conn){
        $stmt = mysqli_stmt_init($conn);
        $subCategories = "SELECT subCatId, subCatName FROM subcategories WHERE mainCatId = ?";
        mysqli_stmt_prepare($stmt, $subCategories);
        mysqli_stmt_bind_param($stmt, "i", $catId);
        mysqli_stmt_execute($stmt);

        mysqli_stmt_store_result($stmt);

        $resultData = mysqli_stmt_num_rows($stmt);

        if($resultData > 0){
            mysqli_stmt_bind_result($stmt, $subCatId, $subCatName);

            $dataContainer = [];

            while(mysqli_stmt_fetch($stmt)){
                array_push($dataContainer,
                    [
                        "subCatId" => $subCatId,
                        "subCatName" => $subCatName
                    ]
                );
            }

            return $dataContainer;
        }
    }

    function fetchContents($catId, $conn){
        $stmt = mysqli_stmt_init($conn);
        $contents = "SELECT contentId, subCatId, subCatName, mainCatName, contentName, folderName, contentFileSize FROM contents WHERE mainCatId = ?";
        mysqli_stmt_prepare($stmt, $contents);
        mysqli_stmt_bind_param($stmt, "i", $catId);
        mysqli_stmt_execute($stmt);

        mysqli_stmt_store_result($stmt);

        $resultData = mysqli_stmt_num_rows($stmt);

        if($resultData > 0){
            mysqli_stmt_bind_result($stmt, $contentId, $subCatId, $subCatName, $mainCatName, $contentName, $folderName, $contentFileSize);

            $dataContainer = [];

            while(mysqli_stmt_fetch($stmt)){
                array_push($dataContainer, 
                    [
                        "contentId" => $contentId,
                        "subCatId" => $subCatId,
                        "subCatName" => $subCatName,
                        "mainCatName" => $mainCatName,
                        "contentName" => $contentName,
                        "folderName" => $folderName,
                        "contentFileSize" => $contentFileSize
                    ]
                );
            }

            return $dataContainer;
        }
    }

    if(isset($_POST['catId'])){
        $catId = filter_var($_POST['catId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $subCats = fetchSubCats($catId, $conn);
        $contents = fetchContents($catId, $conn);

        echo json_encode(['subCategories' => $subCats, 'contents' => $contents]);
    }
?>