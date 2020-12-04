<?php require('connection/dbConnection.php'); ?>
<?php
    function getContentDetails($conn, $contentName){
        $contentName = filter_var($contentName, FILTER_SANITIZE_SPECIAL_CHARS);
        $stmt = mysqli_stmt_init($conn);
        $getData = "SELECT contentId, folderName FROM contents WHERE contentName = ?";
        mysqli_stmt_prepare($stmt, $getData);
        mysqli_stmt_bind_param($stmt, "s", $contentName);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);
        $result = mysqli_stmt_num_rows($stmt);

        if($result === 0){
            return false;
        }else{
            mysqli_stmt_bind_result($stmt, $contentId, $folderName);
            mysqli_stmt_fetch($stmt);
            return ["contentId" => $contentId, "folderName" => $folderName];
        }
    }

    function insertBannerData($conn, $folderName, $contentId, $contentName, $bannerTagline){
        $bannerTagline = filter_var($bannerTagline, FILTER_SANITIZE_SPECIAL_CHARS);
        $contentName = filter_var($contentName, FILTER_SANITIZE_SPECIAL_CHARS);

        $bannerImgName = $_FILES['bannerImage']['name'];
        $bannerImgTmp = $_FILES['bannerImage']['tmp_name'];
        $bannerImgError = $_FILES['bannerImage']['error'];
        $bannerImgExt = strtolower(pathinfo($bannerImgName, PATHINFO_EXTENSION));

        if($bannerImgError > 0){
            echo json_encode(['error' => "error"]);
        }else{
            $folderPath = "../uploads/banners/";

            date_default_timezone_set("Asia/Brunei");
            $dateTime = date("YmdHis");

            if(!is_dir($folderPath)){
                mkdir($folderPath, 0777, true);
            }

            $fileFinalName = "{$folderName}_{$dateTime}.{$bannerImgExt}";
            $newFilePath = $folderPath.$fileFinalName;

            if(move_uploaded_file($bannerImgTmp, $newFilePath)){
                $stmt = mysqli_stmt_init($conn);
                $insertData = "INSERT INTO featured (contentId, contentName, featureDesc, featureImage) VALUES (?, ?, ?, ?)";

                mysqli_stmt_prepare($stmt, $insertData);
                mysqli_stmt_bind_param($stmt, "isss", $contentId, $contentName, $fileFinalName, $bannerTagline);

                mysqli_stmt_error($stmt);

                if(mysqli_stmt_execute($stmt)){
                    echo json_encode(['success' => "success"]);
                }
            }
        }
    }

    if(isset($_POST['contentName'])){
        $contentDetails = getContentDetails($conn, $_POST['contentName']);

        if(!empty($contentDetails['contentId'])){
            insertBannerData($conn, $contentDetails['folderName'], $contentDetails['contentId'], $_POST['contentName'], $_POST['bannerTagline']);
        }else{
            echo json_encode(['error' => "error"]);
        }
    }
?>