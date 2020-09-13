<?php 
    session_start(); 
    if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<section class="accountSecurityWrapper menuProfileDivs">
    <section class="accountSecurity container">
        <h2>ACCOUNT SECURITY</h2>
        <div class="accountSecurityForm">
            <form id="accountSecurityForm" name="accountSecurityForm">
                <div class="form-group">
                    <label for="newPassword" class="formLabel">New Password</label>
                    <input type="password" class="form-control formInputGreen securityInputs" id="newPassword" name="newPassword" value="" />
                </div>
                <div class="form-group">
                    <label for="confirmPassword" class="formLabel">Confirm Password</label>
                    <input type="password" class="form-control formInputGreen securityInputs" id="confirmPassword" name="confirmPassword" value="" />
                </div>
                <div class="form-group saveChanges">
                    <input type="hidden" value="<?php echo $_SESSION['userId'] ?>" name="accSecUserId" id="accSecUserId"/>
                    <button type="submit" class="btnGreenGradient globalBtn" id="saveBtn">
                        <i class="fas fa-save"></i>
                        <span>SAVE CHANGES</span>
                    </button>
                </div>
            </form>
        </div>
    </section>
</section>