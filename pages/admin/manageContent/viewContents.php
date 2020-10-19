<?php include('../../header.php'); ?>
    <link rel="stylesheet" href="../../../stylesheets/styles.css">
</head>
<?php
    require('../../../backend/connection/dbConnection.php');
    session_start();

    if(empty($_SESSION['userId'])){
        header('Location: ../../signIn.php');
    }

?>
<main class="viewContentsContainer mainContainer">
    <section class="viewContentsHeader">
        <div class="backBtnContainer">
            <a href="../../../pages/admin/adminProfile.php?mobilenumber=<?php echo $_SESSION['mobileNumber']; ?>" id="viewContentsBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <img src="../../../assets/downloadStoreLogo.svg" alt="Download Store" class="viewContentsPageLogo">
        <img src="../../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="viewContentsWrapper">
		<section class="viewContentsSearch">
            <section class="searchboxContainer">
                <form class="form-inline d-flex justify-content-center md-form form-sm mt-0 searchContentForm" id="searchContentForm">
                    <i class="fas fa-search searchboxIcon" aria-hidden="true" id="userSearchBtn"></i>
                    <input class="form-control form-control-sm w-75 searchboxInput" type="text" placeholder="Search Content Name" aria-label="Search" id="contentSearchInput">
                </form>
            </section>
        </section>
        <section class="contentsWrapper">
            <?php
                $stmtCat = mysqli_stmt_init($conn);
                $getCategories = "SELECT mainCatId, mainCatName FROM maincategories";
                mysqli_stmt_prepare($stmtCat, $getCategories);
                mysqli_stmt_execute($stmtCat);

                mysqli_stmt_store_result($stmtCat);

                $resultCat = mysqli_stmt_num_rows($stmtCat);

                if($resultCat > 0):
                    mysqli_stmt_bind_result($stmtCat, $mainCatId, $mainCatName);
				
                    while(mysqli_stmt_fetch($stmtCat)):
                        $idSubCatArray = [];
            ?>
                        <div class="viewContents">
                            <div class="viewContentsCat">
                                <h6><?php echo $mainCatName; ?></h6>
                            </div>
                            <div class="viewContentsSubCat">
                                <?php
                                    $stmtSubCat = mysqli_stmt_init($conn);
                                    $getSubCategories = "SELECT subCatId, subCatName FROM subcategories WHERE mainCatId = ?";
                                    mysqli_stmt_prepare($stmtSubCat, $getSubCategories);
                                    mysqli_stmt_bind_param($stmtSubCat, "i", $mainCatId);
                                    mysqli_stmt_execute($stmtSubCat);

                                    mysqli_stmt_store_result($stmtSubCat);

                                    $resultSubCat = mysqli_stmt_num_rows($stmtSubCat);

                                    if($resultSubCat > 0):
                                        mysqli_stmt_bind_result($stmtSubCat, $subCatId, $subCatName);
                                        
                                        while(mysqli_stmt_fetch($stmtSubCat)):
                                            array_push($idSubCatArray, $subCatId)
                                ?>
                                            <button class="subCatBtn">
                                                <input type="hidden" value="<?php echo $subCatId; ?>">
                                                <p><?php echo $subCatName; ?></p>
                                            </button>
                                <?php
                                        endwhile;
                                    else:
                                ?>
                                        <p>No Sub Categories</p>
                                <?php
                                    endif;
                                ?>
                            </div>
                            <div class="viewContentsContent container">
                                <?php
                                    if(count($idSubCatArray) > 0):
                                        $stmtContent = mysqli_stmt_init($conn);
                                        $getContents = "SELECT contentId, contentName, folderName, contentThumb, contentFilename, contentFileSize FROM contents WHERE subCatId = ?";
                                        mysqli_stmt_prepare($stmtContent, $getContents);
                                        mysqli_stmt_bind_param($stmtContent, "i", $idSubCatArray[0]);
                                        mysqli_stmt_execute($stmtContent);

                                        mysqli_stmt_store_result($stmtContent);

                                        $resultContent = mysqli_stmt_num_rows($stmtContent);

                                        if($resultContent > 0):
                                            mysqli_stmt_bind_result($stmtContent, $contentId, $contentName, $folderName, $contentThumb, $contentFilename, $contentFileSize);

                                            while(mysqli_stmt_fetch($stmtContent)):
                                                $newFileSize = substr($contentFileSize, 0, 4);
                                ?>
                                                <div class="contentContainer row align-items-center">
                                                    <input type="hidden" value="<?php echo $contentId; ?>" />
                                                    <div class="contentNameCont col-7">
                                                        <p class="contentName"><?php echo $contentName; ?></p>
                                                        <p class="contentFilesize">File Size: <?php echo $newFileSize; ?> mb</p>
                                                    </div>
                                                    <div class="contentCta col-5">
                                                        <a href="" class="btnBlueSolid btnLink contentPreviewBtn">
                                                            <i class="fas fa-eye"></i>
                                                        </a>
                                                        <a href="" class="btnBlueSolid btnLink editContentBtn">
                                                            <i class="fas fa-edit"></i>
                                                        </a>
                                                        <button type="button" class="btnRedSolid deleteContentBtn">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                <?php
                                            endwhile;
                                        endif;
                                ?>
                                <?php
                                    else:
                                ?>
                                        <p>No Contents</p>
                                <?php
                                    endif;
                                ?>
                            </div>
                        </div>
            <?php
                    endwhile;
                endif;
            ?>
        </section>
	</section>
	<script src="../../../jsscripts/viewSubCategories.js" defer></script>
</main>
<?php include('../../footer.php'); ?>