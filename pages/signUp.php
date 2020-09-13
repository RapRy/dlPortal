<?php include('header.php') ?>
    <link rel="stylesheet" href="../stylesheets/styles.css">
</head>
<body>
    <main class="registerContainer mainContainer">
        <section class="registerHeader">
            <div class="backBtnContainer">
                <a href="signIn.php"><i class="fas fa-level-up-alt"></i></a>
            </div>
            <img src="../assets/downloadStoreLogo.svg" alt="Download Store" class="logo">
            <img src="../assets/signInBg.svg" alt="" class="bg">
        </section>
        <section class="signUpWrapper" id="signUpWrapper">
            <section class="registerForm container">
                <h2>REGISTER TO OUR SERVICE</h2>
                <p>You need to register to our service before you sign up. If you’re already registered just fill up the sign up form below. </p>
                <form>
                    <div class="form-group mobileInput">
                    <span class="countryCallingCode">673</span>
                        <label for="registerNumber" class="formLabel">Mobile Number:</label>
                        <input type="text" class="form-control formInputGreen" id="registerNumber">
                    </div>
                    <div class="form-group registerBtn">
                        <button type="submit" class="btnGreenGradient globalBtn" id="registrationBtn">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>REGISTER</span>
                        </button>
                    </div>
                </form>
            </section>
            <section class="signUpForm container">
                <h2>CREATE ACCOUNT</h2>
                <form>
                    <div class="form-group">
                        <label for="signUpFirstName" class="formLabel">First Name:</label>
                        <input type="text" class="form-control formInputGreen" id="signUpFirstName">
                    </div>
                    <div class="form-group">
                        <label for="signUpLastName" class="formLabel">Last Name:</label>
                        <input type="text" class="form-control formInputGreen" id="signUpLastName">
                    </div>
                    <div class="form-group mobileInput">
                        <span class="countryCallingCode">673</span>
                        <label for="signUpNumber" class="formLabel">Mobile Number:</label>
                        <input type="text" class="form-control formInputGreen" id="signUpNumber">
                        <small id="numberHint" class="formHint">Make sure that your mobile number is subscribe to our service.</small>
                    </div>
                    <div class="form-group">
                        <label for="signUpEmail" class="formLabel">Email Address:</label>
                        <input type="email" class="form-control formInputGreen" id="signUpEmail">
                    </div>
                    <div class="form-group">
                        <label for="signUpPassword" class="formLabel">Password:</label>
                        <input type="password" class="form-control formInputGreen" id="signUpPassword">
                    </div>
                    <div class="form-group">
                        <label for="signUpPasswordAgain" class="formLabel">Confirm Password:</label>
                        <input type="password" class="form-control formInputGreen" id="signUpPasswordAgain">
                    </div>
                    <div class="form-group signUpBtn">
                        <button type="submit" class="btnGreenGradient globalBtn" id="signUpBtn">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>SIGN UP</span>
                        </button>
                    </div>
                </form>
            </section>
        </section>
    </main>
<script src="../jsscripts/login.js" defer></script>
<?php include('footer.php') ?>
