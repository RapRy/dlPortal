<?php 
    session_start();
    if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<section class="editProfileWrapper menuProfileDivs">
    <section class="editProfile container">
        <h2>EDIT PROFILE</h2>
        <div class="editProfileForm">
            <form id="editProfileForm" name="editProfileForm">
                <div class="form-group changeProfPic">
                    <label for="picInput" class="btnGreenGradient">Change Profile Picture</label>
                    <input type="file" accept="image/jpg, image/png, image/jpeg" name="picInput" id="picInput" class="picInput editInputs" />
                    <p>Accepted formats jpg and png only.</p>
                </div>
                <div class="form-group">
                    <label for="editFirstName" class="formLabel">First Name:</label>
                    <input type="text" class="form-control formInputGreen editInputs" id="editFirstName" name="editFirstName" value="<?php echo $_SESSION['firstName']; ?>">
                </div>
                <div class="form-group">
                    <label for="editLastName" class="formLabel">Last Name:</label>
                    <input type="text" class="form-control formInputGreen editInputs" id="editLastName" name="editLastName" value="<?php echo $_SESSION['lastName']; ?>">
                </div>
                <div class="form-group saveChanges">
                    <input type="hidden" value="<?php echo $_SESSION['userId'] ?>" id="editUserId"/>
					<input type="hidden" value="<?php echo $_SESSION['mobileNumber'] ?>" id="editUserMobileNumber"/>
                    <button type="submit" class="btnGreenGradient globalBtn" id="saveBtn">
                        <i class="fas fa-save"></i>
                        <span>SAVE CHANGES</span>
                    </button>
                </div>
            </form>
        </div>
    </section>
</section>