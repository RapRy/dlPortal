<?php 
    session_start();
    if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<section class="accountSettingsWrapper menuProfileDivs">
    <section class="accountSettings container">
        <h2>ACCOUNT SETTINGS</h2>
        <div class="accountSettingsForm">
            <form id="accountSettingsForm" name="accountSettingsForm">
                <div class="form-check form-group">
                    <?php
                        if($_SESSION['receiveUpdate'] === "SMS"):
                    ?>
                        <input type="checkbox" class="form-check-input checkboxSettings" value="SMS" checked />
                    <?php else: ?>
                        <input type="checkbox" class="form-check-input checkboxSettings" value="SMS" />
                    <?php endif; ?>
                    <span class="dummyCheckbox"></span>
                    <input type="hidden" class="hiddenInputSMS" value="<?php echo $_SESSION['userId'] ?>" />
                    <label for="checkSMS" class="form-check-label">Receive new updates about our services and new contents via sms.</label>
                </div>
                <div class="form-check form-group">
                    <?php
                        if($_SESSION['receiveUpdate'] === "EMAIL"):
                    ?>
                        <input type="checkbox" class="form-check-input checkboxSettings" value="EMAIL" checked />
                    <?php else: ?>
                        <input type="checkbox" class="form-check-input checkboxSettings" value="EMAIL" />
                    <?php endif; ?>
                    <span class="dummyCheckbox"></span>
                    <input type="hidden" class="hiddenInputEMAIL" value="<?php echo $_SESSION['userId'] ?>" />
                    <label for="checkEMAIl" class="form-check-label">Receive new updates about our services and new contents via email.</label>
                </div>
            </form>
        </div>
        <div class="deactivateContainer">
            <div class="deactivateBtnContainer">
                <input type="hidden" class="deactivateInput" value="<?php echo $_SESSION['userId'] ?>" />
                <button type="button" class="btnRedGradient globalBtn deactivateBtn" id="deactivateBtn">
                    Deactivate Account
                </button>
            </div>
            <p>Deactivating your account will unsubscribe you to our services. You will no longer be able to use this app and download any contents from our services.</p>
        </div>
    </section>
</section>