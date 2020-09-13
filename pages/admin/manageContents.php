<?php require('../../backend/connection/dbConnection.php'); ?>
<?php 
    session_start();

    if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<section class="manageContentsWrapper menuAdminProfileDivs container">
    <section class="addContentsWrapper manageContentBG">
        <section class="contentHeader manageContentHead">
            <h6>Contents</h6>
        </section>
        <section class="contentBody manageContentBody">
            <a href="#" class="manageContentBlueBtn" id="addContent">
                Add Content
            </a>
            <a href="#" class="manageContentGreenBtn" id="viewContents">
                View Contents
            </a>
        </section>
    </section>
    <section class="addSubCategoryWrapper manageContentBG">
        <section class="contentHeader manageContentHead">
            <h6>Sub Category</h6>
        </section>
        <section class="contentBody manageContentBody">
            <a href="manageContent/addSubCategory.php" class="manageContentBlueBtn" id="addContent">
                Add Sub Category
            </a>
            <a href="manageContent/viewSubCategories.php" class="manageContentGreenBtn" id="viewContents">
                View Sub Categories
            </a>
        </section>
    </section>
    <section class="addMainCategoryWrapper manageContentBG">
        <section class="contentHeader manageContentHead">
            <h6>Main Category</h6>
        </section>
        <section class="contentBody manageContentBody">
            <a href="manageContent/addMainCategory.php" class="manageContentBlueBtn" id="addContent">
                Add Main Category
            </a>
            <a href="manageContent/viewMainCategories.php" class="manageContentGreenBtn" id="viewContents">
                View Main Categories
            </a>
        </section>
    </section>
</section>