<?php require('connection/dbConnection.php'); ?>
<?php
    function fetchData($catId, $conn){
        $stmtSub = mysqli_stmt_init($conn);
        $subCategories = "SELECT subCatId, subCatName FROM subcategories WHERE mainCatId = ?";
        mysqli_stmt_prepare($stmtSub, $subCategories);
        mysqli_stmt_bind_param($stmtSub, "i", $catId);
        mysqli_stmt_execute($stmtSub);

        mysqli_stmt_store_result($stmtSub);

        $resultSub = mysqli_stmt_num_rows($stmtSub);

        if($resultSub > 0){
            mysqli_stmt_bind_result($stmtSub, $subCatId, $subCatName);

            $dataContainer = [];

            while(mysqli_stmt_fetch($stmtSub)){

                $subCat = ["subCatId" => $subCatId, "subCatName" => $subCatName];
                $contentList = [];

                $stmtCont = mysqli_stmt_init($conn);
                $contents = "SELECT contentId, mainCatName, contentName, folderName, contentFileSize, contentThumb FROM contents WHERE subCatId = ?";
                mysqli_stmt_prepare($stmtCont, $contents);
                mysqli_stmt_bind_param($stmtCont, "i", $subCatId);
                mysqli_stmt_execute($stmtCont);

                mysqli_stmt_store_result($stmtCont);

                $resultCont = mysqli_stmt_num_rows($stmtCont);

                if($resultCont > 0){
                    mysqli_stmt_bind_result($stmtCont, $contentId, $mainCatName, $contentName, $folderName, $contentFileSize, $contentThumb);

                    while(mysqli_stmt_fetch($stmtCont)){

                        array_push($contentList, 
                            [
                                "contentId" => $contentId,
                                "contMainCatName" => $mainCatName,
                                "contentName" => $contentName,
                                "folderName" => $folderName,
                                "contentFileSize" => $contentFileSize,
                                "contentThumb" => $contentThumb
                            ]
                        );
                    }
                }

                array_push($dataContainer, ["subCategory" => $subCat, "contents" => $contentList]);

            }

            return $dataContainer;
        }
    }

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
                        "contSubCatId" => $subCatId,
                        "contSubCatName" => $subCatName,
                        "contMainCatName" => $mainCatName,
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
        // $subCats = fetchSubCats($catId, $conn);
        // $contents = fetchContents($catId, $conn);

        // echo json_encode(['subCategories' => $subCats, 'contents' => $contents]);

        $data = fetchData($catId, $conn);

        echo json_encode($data);
    }
?>