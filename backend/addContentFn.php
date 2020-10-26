<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();
    
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

    // fetch sub cat id
    function getSubCatId($conn){
        $subCatName = filter_var($_POST['subCategory'], FILTER_SANITIZE_SPECIAL_CHARS);
        $stmt = mysqli_stmt_init($conn);
        $getId = "SELECT subCatId FROM subcategories WHERE subCatName = ?";
        mysqli_stmt_prepare($stmt, $getId);
        mysqli_stmt_bind_param($stmt, "s", $subCatName);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $result = mysqli_stmt_num_rows($stmt);

        if($result == 0){
            return false;
        }else{
            mysqli_stmt_bind_result($stmt, $subCatId);

            while(mysqli_stmt_fetch($stmt)){
                return $subCatId;
            }
        }
        mysqli_stmt_close($stmt);
    }
    // insert data then return the id of the newly inserted data
    function insertContentData($conn, $subId, $catId){
        $contentName = filter_var($_POST['contentName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $mainCategory = filter_var($_POST['mainCategory'], FILTER_SANITIZE_SPECIAL_CHARS);
        $subCategory = filter_var($_POST['subCategory'], FILTER_SANITIZE_SPECIAL_CHARS);
        $contentDescription = filter_var($_POST['contentDescription'], FILTER_SANITIZE_SPECIAL_CHARS);

        $iconName = $_FILES['contentIcon']['name'];
        $iconTmp = $_FILES['contentIcon']['tmp_name'];
        $iconError = $_FILES['contentIcon']['error'];
        $iconExt = strtolower(pathinfo($iconName, PATHINFO_EXTENSION));

        $fileName = $_FILES['contentFile']['name'];
        $fileSize = $_FILES['contentFile']['size'];
        $fileTmp = $_FILES['contentFile']['tmp_name'];
        $fileError = $_FILES['contentFile']['error'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if($iconError > 0 || $fileError > 0){
            // return error icon or file
            return ['error' => 'iconOrFile'];
        }else{
            // create folder name
            $folderName = rand(111111111,999999999);
            // set content folder
            $folderPath = "../uploads/contents/".str_replace(' ', '', $mainCategory)."/".str_replace(' ', '', $subCategory)."/".$folderName."/";

            if(!is_dir($folderPath)){
                // create directory is it doesnt exist
                mkdir($folderPath, 0777, true);
            }

            date_default_timezone_set("Asia/Brunei");
            $dateTime = date("YmdHis");
            
            // generate filename
            $fileFinalName = $folderName."_".$dateTime.".".$fileExt;
            $newFilePath = $folderPath.$fileFinalName;
            // save file in the folder path
            if(move_uploaded_file($fileTmp, $newFilePath)){
                // generate icon name
                $iconFinalName = $folderName."_".$dateTime.".".$iconExt;
                $newIconPath = $folderPath.$iconFinalName;
                // save icon in the folder path
                move_uploaded_file($iconTmp, $newIconPath);

                $stmt = mysqli_stmt_init($conn);
                $insertData = "INSERT INTO contents (subCatId, mainCatId, subCatName, mainCatName, contentName, folderName, contentDescription, contentThumb, contentFilename, contentFileSize) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                mysqli_stmt_prepare($stmt, $insertData);
                mysqli_stmt_bind_param($stmt, "iisssssssi", $subId, $catId, $subCategory, $mainCategory, $contentName, $folderName, $contentDescription, $iconFinalName, $fileFinalName, $fileSize);

                mysqli_stmt_error($stmt);

                if(mysqli_stmt_execute($stmt)){
                    $contentId = mysqli_stmt_insert_id($stmt);

                    return ["contentId" => $contentId, "folderName" => $folderName, "date" => $dateTime, "contentName" => $contentName];
                }
            }

        }
    }

    function insertScreenshots($conn, $contentId, $folderName, $date){
        $stmt = mysqli_stmt_init($conn);

        $mainCategory = filter_var($_POST['mainCategory'], FILTER_SANITIZE_SPECIAL_CHARS);
        $subCategory = filter_var($_POST['subCategory'], FILTER_SANITIZE_SPECIAL_CHARS);
        // set screenshots folder
        $folderPath = "../uploads/contents/".str_replace(' ', '', $mainCategory)."/".str_replace(' ', '', $subCategory)."/".$folderName."/screenshots"."/";

        if(!is_dir($folderPath)){
            // create directory is it doesnt exist
            mkdir($folderPath, 0777, true);
        }

        // save each screenshots in the folder and in the database
        for($i = 0; count($_FILES['screenshots']['tmp_name']) > $i; $i++){
            $imageExt = strtolower(pathinfo($_FILES['screenshots']['name'][$i], PATHINFO_EXTENSION));
            $screenName = rand(111111111,999999999);
            $newImageName = $folderName."_".$screenName."_".$date.".".$imageExt;
            $newImageFilePath = $folderPath.$newImageName;
            move_uploaded_file($_FILES['screenshots']['tmp_name'][$i], $newImageFilePath);

            $insertImage = "INSERT INTO screenshots (contentId, screenshotName) VALUES (?, ?)";
            mysqli_stmt_prepare($stmt, $insertImage);
            mysqli_stmt_bind_param($stmt, "is", $contentId, $newImageName);
            mysqli_stmt_execute($stmt);
        }
    }

    if(isset($_POST['selectCat'])){
        // select input main category
        $selectCatId = getIdMainCat($_POST['selectCat'], $conn);
        if($selectCatId["catId"]){
            // fetch sub categorie of the selected main category
            getSubCategories($selectCatId, $conn);
        }
    }

    if(isset($_POST['contentName'])){
        $subId = getSubCatId($conn);
        $catId = getIdMainCat($_POST['mainCategory'], $conn);

        if(!$subId && !$catId){
            // dsiplay error
            echo json_encode(['error' => "catIorSubId"]);
        }else{
            // insert content details first
            $data = insertContentData($conn, $subId, $catId['catId']);

            if(!$data['contentId']){
                echo json_encode(['error' => "contentIdError"]);
            }else{
                if(isset($_FILES['screenshots'])){
                    // then insert screenshots
                    insertScreenshots($conn, $data['contentId'], $data['folderName'], $data['date']);
                    echo json_encode(['success' => 'successWithScreens', "contentName" => $data['contentName']]);
                }else{
                    echo json_encode(['success' => 'successNoScreens', "contentName" => $data['contentName']]);
                }
            }
        }
    }

    mysqli_close($conn);
?>