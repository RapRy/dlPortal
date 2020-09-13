<?php include('../header.php'); ?>
    <link rel="stylesheet" href="../../stylesheets/styles.css">
</head>
<body>
<?php 
    require('../../backend/connection/dbConnection.php');
    // get all session variables that we store in global
    session_start();
    // $test = $_SESSION['firstName'];

    if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<main class="profileContainer mainContainer">
    <section class="profileHeader">
        <div class="backBtnContainer">
            <a href="../../index.php" id="profileBackBtn"><i class="fas fa-level-up-alt"></i></a>
        </div>
        <div class="profilePic">
			<img src="<?php echo (!empty($_SESSION['profilePic']) || $_SESSION['profilePic'] != null) ? "../../uploads/avatars/".$_SESSION['mobileNumber']."/".$_SESSION['profilePic'] : "../../assets/userThumb.png" ?>" alt="">
        </div>
        <img src="../../assets/homeBg.svg" alt="" class="bg">
    </section>
    <section class="profileWrapper">
        <section class="accountOverviewWrapper">
            <section class="accountOverview container">
                <h2>ACCOUNT OVERVIEW</h2>
                <div class="accountDetails">
                    <ul>
                        <li>Account ID: <span><?php echo $_SESSION['accountId']; ?></span></li>
                        <li>Account Name: <span><?php echo $_SESSION['firstName']; ?> <?php echo $_SESSION['lastName']; ?></span></li>
                        <li>Mobile Number: <span>(673) <?php echo $_SESSION['mobileNumber']; ?></span></li>
                        <li>Email Address: <span><?php echo $_SESSION['email']; ?></span></li>
                        <?php 
							if(!empty($_SESSION['latestActivityDate'])):
								$date = date_parse($_SESSION['latestActivityDate']);
								$newDate = "";

								switch($date['month']){
									case 1:
										$newDate = "January ".$date['day'].", ".$date['year'];
										break;
									case 2:
										$newDate = "February ".$date['day'].", ".$date['year'];
										break;
									case 3:
										$newDate = "March ".$date['day'].", ".$date['year'];
										break;
									case 4:
										$newDate = "April ".$date['day'].", ".$date['year'];
										break;
									case 5:
										$newDate = "May ".$date['day'].", ".$date['year'];
										break;
									case 6:
										$newDate = "June ".$date['day'].", ".$date['year'];
										break;
									case 7:
										$newDate = "July ".$date['day'].", ".$date['year'];
										break;
									case 8:
										$newDate = "August ".$date['day'].", ".$date['year'];
										break;
									case 9:
										$newDate = "September ".$date['day'].", ".$date['year'];
										break;
									case 10:
										$newDate = "October ".$date['day'].", ".$date['year'];
										break;
									case 11:
										$newDate = "November ".$date['day'].", ".$date['year'];
										break;
									case 12:
										$newDate = "December ".$date['day'].", ".$date['year'];
										break;
									default:
										$newDate = "No Recent Activity";
									break;
								}
						?>
						<li>Recent Activity: <span><?php echo $newDate; ?></span></li>
							
						<?php
							else:	
						?>
						<li>Recent Activity: <span>No Activity</span></li>
						<?php
							endif;
						?>
                        <li class="receiveUpdate">
                            <?php
								// check for receiving update if SMS or Email
                                if($_SESSION['receiveUpdate'] === "SMS"):
                            ?>
                                    <span>*Receiving updates via SMS</span>
                            <?php
                                elseif($_SESSION['receiveUpdate'] === "EMAIL"):
                            ?>
                                    <span>*Receiving updates via Email</span>
									
							<?php
								elseif(empty($_SESSION['receiveUpdate'])):
							?>
									<span>*Not receiving updates</span>
                            <?php
                                endif;
                            ?>
                        </li>
                    </ul>
                </div>
            </section>
            <section class="accountMenu container">
                <div class="acctBtn btnProfileManage">
                    <i class="fas fa-user-edit"></i>
                    <span>Edit Profile</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
                <div class="acctBtn btnProfileManage">
                    <i class="fas fa-user-clock"></i>
                    <span>Activity History</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
                <div class="acctBtn btnProfileManage">
                    <i class="fas fa-user-shield"></i>
                    <span>Account Security</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
                <div class="acctBtn btnProfileManage">
                    <i class="fas fa-user-cog"></i>
                    <span>Account Settings</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
            </section>
            <section class="accountLogOut container">
                <button type="submit" class="btnGreenGradient globalBtn" id="logoutBtn">
                    <input type="hidden" value="<?php echo $_SESSION['userId']; ?>" />
                    <i class="fas fa-sign-out-alt"></i>
                    <span>SIGN OUT</span>
                </button>
            </section>
        </section>
    </section>
    <script src="../../jsscripts/profile.js" defer></script>
</main>
<?php include('../footer.php') ?>