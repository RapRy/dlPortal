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

    function getSubId($subCategory, $conn){
        $stmt = mysqli_stmt_init($conn);
        $getId = "SELECT subCatId FROM subcategories WHERE subCatName = ?";
        mysqli_stmt_prepare($stmt, $getId);
        mysqli_stmt_bind_param($stmt, "s", $subCategory);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $subId);

        mysqli_stmt_fetch($stmt);

        return $subId;
    }

    function recurseCopy($oldPath, $newpath){
        $dir = opendir($oldPath);

        if(!is_dir($newpath)){
            mkdir($newpath);
        }

        while(false !== ($file = readdir($dir))){
            if(($file != '.') && ($file != '..')){
                if(is_dir("{$oldPath}/{$file}")){
                    recurseCopy("{$oldPath}/{$file}", "{$newpath}/{$file}");
                }else{
                    copy("{$oldPath}/{$file}", "{$newpath}/{$file}");
                }
            }
        }

        closedir($dir);

        return true;
    }

    function deleteFile($path, $oldFile){

        $file = glob("{$path}/{$oldFile}");

        if(is_file($file[0])){
            unlink($file[0]);
        }
    }

    function updateFile($contentId, $conn, $newFile, $oldFile, $newpath, $folderName, $key){
        $name = $newFile['name'];
        $size = $newFile['size'];
        $tmp = $newFile['tmp_name'];
        $error = $newFile['error'];
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));

        if($error > 0){
            return;
        }else{
            date_default_timezone_set("Asia/Brunei");
            $dateTime = date("YmdHis");

            // generate name
            $finalName = "{$folderName}_{$dateTime}.{$ext}";
            $newFilePath = "{$newpath}/{$finalName}";

            move_uploaded_file($tmp, $newFilePath);

            if($key === "contentFilename"){
                // update file size
                updateDatabase($contentId, $conn, 'contentFileSize', $size);
            }

            updateDatabase($contentId, $conn, $key, $finalName);

            deleteFile($newpath, $oldFile);
        }
    }

    function insertScreens($contentId, $conn, $newpath, $folderName){
        $stmt = mysqli_stmt_init($conn);
        date_default_timezone_set("Asia/Brunei");
        $dateTime = date("YmdHis");

        $folderPath = "{$newpath}/screenshots/";

        if(is_dir($newpath)){
            for($i = 0; count($_FILES['screenshots']['tmp_name']) > $i; $i++){
                $imageExt = strtolower(pathinfo($_FILES['screenshots']['name'][$i], PATHINFO_EXTENSION));
                $screenName = rand(111111111,999999999);
                $newImageName = "{$folderName}_{$screenName}_{$dateTime}.{$imageExt}";
                $newImageFilePath = $folderPath.$newImageName;
                move_uploaded_file($_FILES['screenshots']['tmp_name'][$i], $newImageFilePath);

                $insertImage = "INSERT INTO screenshots (contentId, screenshotName) VALUES (?, ?)";
                mysqli_stmt_prepare($stmt, $insertImage);
                mysqli_stmt_bind_param($stmt, "is", $contentId, $newImageName);
                mysqli_stmt_execute($stmt);
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
    }else if(isset($_POST['contentId'])){
        $contentId = filter_var($_POST['contentId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $folderName = filter_var($_POST['folderName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $mainCatInitial = filter_var(str_replace(" ", "", $_POST['mainCatInitial']), FILTER_SANITIZE_SPECIAL_CHARS);
        $subCatInitial = filter_var(str_replace(" ", "", $_POST['subCatInitial']), FILTER_SANITIZE_SPECIAL_CHARS);

        if(isset($_POST['contentName'])){
            $contentName = filter_var($_POST['contentName'], FILTER_SANITIZE_SPECIAL_CHARS);
            updateDatabase($contentId, $conn, "contentName", $contentName);
        }

        if(isset($_POST['contentDescription'])){
            $contentDescription = filter_var($_POST['contentDescription'], FILTER_SANITIZE_SPECIAL_CHARS);
            updateDatabase($contentId, $conn, "contentDescription", $contentDescription);
        }

        if(isset($_POST['subCategory'])){
            $subCategory = filter_var($_POST['subCategory'], FILTER_SANITIZE_SPECIAL_CHARS);
            $noWhiteSpaces = str_replace(" ", "", $subCategory);
            $oldPath = "../uploads/contents/{$mainCatInitial}/{$subCatInitial}/{$folderName}";
            $newpath = "../uploads/contents/{$mainCatInitial}/{$noWhiteSpaces}/{$folderName}";
            
            if(is_dir($oldPath)){
                if(!is_dir("../uploads/contents/{$mainCatInitial}/{$noWhiteSpaces}")){
                    mkdir("../uploads/contents/{$mainCatInitial}/{$noWhiteSpaces}");
                }
                // copy files and directory
                if(recurseCopy($oldPath, $newpath)){
                    $subId = getSubId($subCategory, $conn);

                    updateDatabase($contentId, $conn, "subCatId", $subId);
                    updateDatabase($contentId, $conn, "subCatName", $subCategory);

                    if(isset($_FILES['contentFile'])){
                        updateFile($contentId, $conn, $_FILES['contentFile'], $_POST['contentFileInitial'], $newpath, $folderName, "contentFilename");
                    }

                    if(isset($_FILES['contentIcon'])){
                        updateFile($contentId, $conn, $_FILES['contentIcon'], $_POST['contentIconInitial'], $newpath, $folderName, "contentThumb");
                    }

                    if(isset($_FILES['screenshots'])){
                        insertScreens($contentId, $conn, $newpath, $folderName);
                    }
                }

                echo json_encode(['result' => "success"]);

            }
        }else{
            $oldPath = "../uploads/contents/{$mainCatInitial}/{$subCatInitial}/{$folderName}";

            if(is_dir($oldPath)){
                if(isset($_FILES['contentFile'])){
                    updateFile($contentId, $conn, $_FILES['contentFile'], $_POST['contentFileInitial'], $oldPath, $folderName, "contentFilename");
                }

                if(isset($_FILES['contentIcon'])){
                    updateFile($contentId, $conn, $_FILES['contentIcon'], $_POST['contentIconInitial'], $oldPath, $folderName, "contentThumb");
                }

                if(isset($_FILES['screenshots'])){
                    insertScreens($contentId, $conn, $oldPath, $folderName);
                }

                echo json_encode(['result' => "success"]);
            }
        }
    }

    mysqli_close($conn);
?>