<?php require('connection/dbConnection.php'); ?>
<?php
    // fetch main cat id and ext
    function getIdMainCat($catname, $conn){
        $cat = filter_var($catname, FILTER_SANITIZE_SPECIAL_CHARS);
        $stmt = mysqli_stmt_init($conn);
        $selectCategory = "SELECT mainCatId, mainCatExt FROM maincategories WHERE mainCatName = ?";
        mysqli_stmt_prepare($stmt, $selectCategory);
        mysqli_stmt_bind_param($stmt, "s", $cat);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $result = mysqli_stmt_num_rows($stmt);

        if($result == 0){
            return false;
        }else{
            mysqli_stmt_bind_result($stmt, $mainCatId, $mainCatExt);
            while(mysqli_stmt_fetch($stmt)){
                return ["catId" => $mainCatId, "catExt" => $mainCatExt];
            }
        }

        mysqli_stmt_close($stmt);
    }

    // fetch sub cat id, sub cat name, main cat ext 
    function getSubCategories($selectCatId, $conn){
        $stmt = mysqli_stmt_init($conn);
        $getSubCats = "SELECT subCatId, subCatName FROM subcategories WHERE mainCatId = ?";
        mysqli_stmt_prepare($stmt, $getSubCats);
        mysqli_stmt_bind_param($stmt, "i", $selectCatId["catId"]);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        mysqli_stmt_num_rows($stmt);
        mysqli_stmt_bind_result($stmt, $subCatId, $subCatName);

        $dataContainer = [];

        while(mysqli_stmt_fetch($stmt)){
            array_push($dataContainer, ['subCatid' => $subCatId, 'subCatName' => $subCatName, "mainCatExt" => $selectCatId["catExt"]]);
        }

        echo json_encode($dataContainer);

    }

    function deleteScreenshot($conn){
        $screenshot = filter_var($_POST['screenshotName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $folderName = filter_var($_POST['folderName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $catName = filter_var(str_replace(" ", "", $_POST['catName']), FILTER_SANITIZE_SPECIAL_CHARS);
        $subCatName = filter_var(str_replace(" ", "", $_POST['subCatName']), FILTER_SANITIZE_SPECIAL_CHARS);

        $pathDir = "../uploads/contents/{$catName}/{$subCatName}/{$folderName}/screenshots";
        
        if(is_dir($pathDir)){
            $images = glob("{$pathDir}/{$screenshot}");

            foreach($images as $image){
                if(is_file($image)){
                    unlink($image);

                    $stmt = mysqli_stmt_init($conn);
                    $deleteQuery = "DELETE FROM screenshots WHERE screenshotName = ?";
                    mysqli_stmt_prepare($stmt, $deleteQuery);
                    mysqli_stmt_bind_param($stmt, "s", $screenshot);
                    if(mysqli_stmt_execute($stmt)){
                        echo json_encode(['result' => "success"]);
                        mysqli_stmt_close($stmt);
                    }
                }
            }
        }

    }

    function updateDatabase($contentId, $conn, $key, $inputVal){
        $stmt = mysqli_stmt_init($conn);
        $insertData = "UPDATE contents SET $key = ? WHERE contentId = ?";
        mysqli_stmt_prepare($stmt, $insertData);
        mysqli_stmt_bind_param($stmt, "si", $inputVal, $contentId);
        mysqli_stmt_execute($stmt);
    }

    function getSubIdAndCatId(){

    }

    if(isset($_POST['selectCat'])){
        // select input main category
        $selectCatId = getIdMainCat($_POST['selectCat'], $conn);
        if($selectCatId["catId"]){
            // fetch sub categorie of the selected main category
            getSubCategories($selectCatId, $conn);
        }
    }else if(isset($_POST['screenshotName'])){
        deleteScreenshot($conn);
    }else if(isset($_POST['contentId'])){
        $contentId = filter_var($_POST['contentId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $folderName = filter_var($_POST['folderName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $mainCatInitial = filter_var(str_replace(" ", "", $_POST['mainCatInitial']), FILTER_SANITIZE_SPECIAL_CHARS);
        $subCatInitial = filter_var(str_replace(" ", "", $_POST['subCatInitial']), FILTER_SANITIZE_SPECIAL_CHARS);

        // if(isset($_POST['contentName'])){
        //     $contentName = filter_var($_POST['contentName'], FILTER_SANITIZE_SPECIAL_CHARS);
        //     updateDatabase($contentId, $conn, "contentName", $contentName);
        // }

        // if(isset($_POST['contentDescription'])){
        //     updateDatabase($contentId, $conn, "contentName", $contentName);
        // }

        if(isset($_POST['subCategory'])){
            $subCategory = filter_var($_POST['subCategory'], FILTER_SANITIZE_SPECIAL_CHARS);
            $noWhiteSpaces = str_replace(" ", "", $subCategory);
            $oldPath = "../uploads/contents/{$mainCatInitial}/{$subCatInitial}";
            $newpath = "../uploads/contents/{$mainCatInitial}/{$noWhiteSpaces}";
            
            if(is_dir($newpath)){
                $dir = opendir($oldPath);
                while(false !== ($file = readdir($dir))){
                    if(($file != '.') && ($file != '..')){
                        if($file === $folderName){
                            echo $folderName;
                        }
                    }
                }
            }
        }else{
            echo 'no sub';
        }
    }

    mysqli_close($conn);
?>