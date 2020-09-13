<?php require('../../backend/connection/dbConnection.php'); ?>
<?php 
	session_start(); 

	if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<section class="manageUsersWrapper menuAdminProfileDivs">
    <section class="manageUserSearch">
        <section class="searchboxContainer">
            <form class="form-inline d-flex justify-content-center md-form form-sm mt-0 searchUserForm" id="searchUserForm">
                <i class="fas fa-search searchboxIcon" aria-hidden="true" id="userSearchBtn"></i>
                <input class="form-control form-control-sm w-75 searchboxInput" type="text" placeholder="Search Mobile Number" aria-label="Search" id="userSearchInput">
            </form>
        </section>
    </section>
    <section class="manageUsers">
        <h2>MANAGE USERS</h2>
        <div class="usersList" id="usersList">
<?php
	$stmt = mysqli_stmt_init($conn);
	$fetchUsers = "SELECT userId, accountId, profilePicture, firstName, lastName, mobileNumber, email, userType, subscriptionStatus, latestActivityDate, receiveUpdate FROM users";
	mysqli_stmt_prepare($stmt, $fetchUsers);
	mysqli_stmt_execute($stmt);
	
	mysqli_stmt_store_result($stmt);
	
	$resultData = mysqli_stmt_num_rows($stmt);
	
	if($resultData > 0):
		mysqli_stmt_bind_result($stmt, $userId, $accountId, $profilePicture, $firstName, $lastName, $mobileNumber, $email, $userType, $subscriptionStatus, $lastestActivityDate, $receiveUpdate);
		
		$dataContainer = [];
		
		while(mysqli_stmt_fetch($stmt)){
			$newData = [
                "userId" => $userId,
                "accountId" => $accountId,
				"profilePicture" => $profilePicture,
				"firstName" => $firstName,
				"lastName" => $lastName,
                "mobileNumber" => $mobileNumber,
                "email" => $email,
				"userType" => $userType,
                "subscriptionStatus" => $subscriptionStatus,
                "latestActivityDate" => $lastestActivityDate,
                "receiveUpdate" => $receiveUpdate
			];
			
			array_push($dataContainer, $newData);
		}
		// remove the admin user
		unset($dataContainer[0]);
		
		foreach($dataContainer as $data):
		
?>
            <div class="userContainer container">
				<input type="hidden" value="<?php echo $data['userId']; ?>" class="userId" />
                <div class="user row no-gutters align-items-center">
                    <div class="userProPic col-2">
                        <img src="<?php echo (!empty($data['profilePicture'])) ? "../../uploads/avatars/".$data['mobileNumber']."/".$data['profilePicture'] : "../../assets/userThumb.png"; ?>" />
                    </div>
                    <div class="userNumberName col-8">
                        <span class="userFullname"><?php echo $data['firstName']." ".$data['lastName']; ?></span>
                        <span class="userNumber">(+673) <?php echo $data['mobileNumber']; ?></span>
                    </div>
                    <div class="userSubStatus col-1">
                        <span><?php echo (empty($data['subscriptionStatus']) || $data['subscriptionStatus'] === "unsubscribed" ? '<i class="fas fa-user-times userUnsub"></i>' : '<i class="fas fa-user-check userSub"></i>'); ?></span>
                    </div>
                    <div class="userChevronRight col-1">
                        <i class="fas fa-chevron-right arrowDetails"></i>
                    </div>
                </div>
				<div class="userAccountDetails">
					<div class="userDetailsContainer">
						<div class="userDetails">
							<ul>
								<li>Account ID: <span><?php echo $data['accountId']; ?></span></li>
								<li>Account Name: <span><?php echo "{$data['firstName']} {$data['lastName']}"; ?></span></li>
								<li>Mobile Number: <span><?php echo $data['mobileNumber']; ?></span></li>
								<li>Email Address: <span><?php echo $data['email']; ?></span></li>
								<?php
									if(!empty($data['latestActivityDate'])):
										$date = date_parse($data['latestActivityDate']);
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
									endif;
								?>
								<li class="receiveUpdate"><span>*Receiving updates via <?php echo $data['receiveUpdate']; ?></span></li>
							</ul>
						</div>
						<div class="userCtaBtnsContainer">
							<button type="button" class="btnRedGradient userCtaBtn userDeleteBtn">
								Delete
							</button>
							<?php	if($data['subscriptionStatus'] === "unsubscribed"): ?>
										<button type="button" class="btnRedGradient userCtaBtn userUnsubscribeBtn opacity50" disabled>
											Unsubscribe
										</button>
							<?php	else: ?>
										<button type="button" class="btnRedGradient userCtaBtn userUnsubscribeBtn">
											Unsubscribe
										</button>
							<?php	endif; ?>
							
							<button type="button" class="btnGreenGradient userCtaBtn userActivitiesBtn">
								Activities
							</button>
						</div>
					</div>
				</div>
            </div>
<?php	
		endforeach;
		mysqli_stmt_close($stmt);
	endif;	
	mysqli_close($conn);
?>
        </div>
    </section>
</section>
