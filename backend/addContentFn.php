<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();

    function getIdMainCat($cat, $conn){
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

    if(isset($_POST['selectCat'])){
        $selectCatId = getIdMainCat($_POST['selectCat'], $conn);
        if($selectCatId["catId"]){
            getSubCategories($selectCatId, $conn);
        }
    }

    if(isset($_POST['contentName'])){
        foreach($_FILES['screenshots']['name'] as $v){
            echo $v."<br />";
        }
        
        echo $_POST['contentName']."<br />";
        echo $_POST['mainCategory']."<br />";
        echo $_POST['subCategory']."<br />";
        echo $_FILES['contentFile']['name']."<br />";
        echo $_FILES['contentIcon']['name']."<br />";
        echo $_POST['contentDescription']."<br />";
    }

    mysqli_close($conn);
?>