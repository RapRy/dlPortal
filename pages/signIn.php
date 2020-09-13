<?php include('header.php') ?>
    <link rel="stylesheet" href="../stylesheets/styles.css">
</head>
<body>
    <main class="signInContainer mainContainer">
        <section class="signInHeader">
            <img src="../assets/downloadStoreLogo.svg" alt="Download Store" class="logo">
            <img src="../assets/signInBg.svg" alt="" class="bg">
        </section>
        <section class="signInWrapper" id="signInWrapper">
            <section class="signInForm container">
                <h2>SUBSCRIBER LOGIN</h2>
                <form>
                    <div class="form-group mobileInput">
                        <span class="countryCallingCode">673</span>
                        <label for="signInNumber" class="formLabel">Mobile Number:</label>
                        <input type="text" class="form-control formInputGreen" id="signInNumber" aria-describedby="numberHint">
                        <small id="numberHint" class="formHint">Make sure that your mobile number is subscribe to our service.</small>
                    </div>
                    <div class="form-group">
                        <label for="signInPassword" class="formLabel">Password:</label>
                        <input type="password" class="form-control formInputGreen" id="signInPassword">
                    </div>
                    <div class="form-group signInBtn">
                        <button type="submit" class="btnGreenGradient globalBtn" id="signInBtn">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>SIGN IN</span>
                        </button>
                    </div>
                    <p>New here or already registered but does'nt have an account yet? <a class="blueLink" href="signUp.php">SIGN UP</a> now!</p>
                    <p>Have you forgotten your <a class="blueLink" href="" id="forgotPassword">PASSWORD</a>?</p>
                </form>
            </section>
        </section>
        <section class="forgotPasswordWrapper container" id="forgotPasswordWrapper">
            <section class="forgotPasswordForm">
                <h2>FORGOT PASSWORD</h2>
                <form>
                    <div class="form-group mobileInput">
                    <span class="countryCallingCode">673</span>
                        <label for="forgotNumber" class="formLabel">Mobile Number:</label>
                        <input type="text" class="form-control formInputGreen" id="forgotNumber">
                    </div>
                    <div class="form-group forgotBtn">
                        <button type="submit" class="btnGreenGradient globalBtn" id="forgotBtn">
                            <i class="fas fa-sms"></i>
                            <span>SEND SMS</span>
                        </button>
                    </div>
                </form>
            </section>
        </section>
    </main>
<script src="../jsscripts/login.js" defer></script>
<?php include('footer.php') ?>
