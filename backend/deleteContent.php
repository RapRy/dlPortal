<?php require('connection/dbConnection.php'); ?>
<?php
    function deleteScreenshots($stmt, $contentId){
        $screens = "DELETE FROM screenshots WHERE contentId = ?";
        mysqli_stmt_prepare($stmt, $screens);
        mysqli_stmt_bind_param($stmt, "i", $contentId);

        return mysqli_stmt_execute($stmt);
    }

    function getContent($stmt, $contentId){
        $getExt = "SELECT contentFilename, folderName, mainCatName, subCatName FROM contents WHERE contentId = ?";
        mysqli_stmt_prepare($stmt, $getExt);
        mysqli_stmt_bind_param($stmt, "i", $contentId);

        if(mysqli_stmt_execute($stmt)){
            mysqli_stmt_store_result($stmt);

            $resultContent = mysqli_stmt_num_rows($stmt);

            if($resultContent > 0){
                mysqli_stmt_bind_result($stmt, $contentFilename, $folderName, $mainCatName, $subCatName);

                while(mysqli_stmt_fetch($stmt)){
                    return [
                        'ext' => pathinfo($contentFilename, PATHINFO_EXTENSION),
                        'folderName' => $folderName,
                        'mainCatName' => $mainCatName,
                        'subCatName' => $subCatName
                    ];
                }
            }
        }
    }

    function delScreenshotsFolder($contentFolderPath, $folderName, $mainCatName, $subCatName){
        $screenshotsPath = "{$contentFolderPath}/{$mainCatName}/{$subCatName}/{$folderName}/screenshots";
        $images = glob("{$screenshotsPath}/*");

        foreach($images as $image){
            if(is_file($image)){
                unlink($image);
            }
        }

        rmdir($screenshotsPath);

        return true;
    }

    function delFolderContent($contentFolderPath, $folderName, $mainCatName, $subCatName){
        $folderPath = "{$contentFolderPath}/{$mainCatName}/{$subCatName}/{$folderName}";
        $files = glob("{$folderPath}/*");

        foreach($files as $file){
            if(is_file($file)){
                unlink($file);
            }
        }

        rmdir($folderPath);

        return true;
    }

    if(isset($_POST['contentId'])){
        $contentId = filter_var($_POST['contentId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $stmt = mysqli_stmt_init($conn);

        $content = getContent($stmt, $contentId);

        $ext = $content['ext'];
        $folderName = $content['folderName'];
        $mainCatName = str_replace(" ", "", $content['mainCatName']);
        $subCatName = str_replace(" ", "", $content['subCatName']);

        $contentFolderPath = "../uploads/contents";

        if($ext === 'apk' || $ext === 'xapk'){
            $delScreensFolder = delScreenshotsFolder($contentFolderPath, $folderName, $mainCatName, $subCatName);

            if($delScreensFolder){

                $delFolderContent = delFolderContent($contentFolderPath, $folderName, $mainCatName, $subCatName);

                if($delFolderContent){

                    $delScreenDatabase = deleteScreenshots($stmt, $contentId);

                    if($delScreenDatabase){
                        $deleteContent = "DELETE FROM contents WHERE contentId = ?";
                        mysqli_stmt_prepare($stmt, $deleteContent);
                        mysqli_stmt_bind_param($stmt, "i", $contentId);
                        mysqli_stmt_execute($stmt);

                        echo 'success del apk';
                    }
                }
            }
        }else{

            $delFolderContent = delFolderContent($contentFolderPath, $folderName, $mainCatName, $subCatName);

            if($delFolderContent){
                $deleteContent = "DELETE FROM contents WHERE contentId = ?";
                mysqli_stmt_prepare($stmt, $deleteContent);
                mysqli_stmt_bind_param($stmt, "i", $contentId);
                mysqli_stmt_execute($stmt);

                echo "success del not apk";
            }
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }
?>