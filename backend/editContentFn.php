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

    if(isset($_POST['selectCat'])){
        // select input main category
        $selectCatId = getIdMainCat($_POST['selectCat'], $conn);
        if($selectCatId["catId"]){
            // fetch sub categorie of the selected main category
            getSubCategories($selectCatId, $conn);
        }
    }else if(isset($_POST['screenshotName'])){
        deleteScreenshot($conn);
    }

    mysqli_close($conn);
?>