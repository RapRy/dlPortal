<?php require('connection/dbConnection.php'); ?>
<?php
    if($_POST['featureId']){
        
        $featureId = filter_var($_POST['featureId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $imageName = filter_var($_POST['image'], FILTER_SANITIZE_SPECIAL_CHARS);

        $stmt = mysqli_stmt_init($conn);
        $deleteQuery = "DELETE FROM featured WHERE featureId = ?";
        mysqli_stmt_prepare($stmt, $deleteQuery);
        mysqli_stmt_bind_param($stmt, "i", $featureId);

        if(mysqli_stmt_execute($stmt)){
            $bannerpath = "../uploads/banners/{$imageName}";
            $files = glob($bannerpath);

            foreach($files as $file){
                if(is_file($file)){
                    unlink($file);
                }
            }

            echo "delete success";
        }
    }
?>