<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();

    function getRegistrationId($conn, $userId){
        $stmt = mysqli_stmt_init($conn);

        $getRegId = "SELECT registrationId FROM users WHERE userId = ?";
        mysqli_stmt_prepare($stmt, $getRegId);
        mysqli_stmt_bind_param($stmt, "i", $userId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $resultUser = mysqli_stmt_num_rows($stmt);

        if($resultUser > 0){
            mysqli_stmt_bind_result($stmt, $registrationId);

            while(mysqli_stmt_fetch($stmt)){
                return $registrationId;
            }
        }
    }

    function deactivateAccount($conn){
        $userId = filter_var($_POST['userId'], FILTER_SANITIZE_SPECIAL_CHARS);
		$sender = filter_var($_POST['sender'], FILTER_SANITIZE_SPECIAL_CHARS);

        $stmt = mysqli_stmt_init($conn);

        $regId = getRegistrationId($conn, $userId);

        date_default_timezone_set("Asia/Brunei");
        $dateTime = date("Y-m-d H-i-s-a");

        $updateRegistrationId = "UPDATE registeredmobile SET numberActivate = 0 WHERE registrationId=?";
        mysqli_stmt_prepare($stmt, $updateRegistrationId);
        mysqli_stmt_bind_param($stmt, "i", $regId);
        mysqli_stmt_execute($stmt);
		
		$updateSubscription = "UPDATE users SET subscriptionStatus='unsubscribed' WHERE userId=?";
		mysqli_stmt_prepare($stmt, $updateSubscription);
		mysqli_stmt_bind_param($stmt, "i", $userId);
		mysqli_stmt_execute($stmt);
		
		// if($sender == "user"){
			// $updateSubscription = "UPDATE users SET subscriptionStatus='unsubscribed', latestActivityDate=? WHERE userId=?";
			// mysqli_stmt_prepare($stmt, $updateSubscription);
			// mysqli_stmt_bind_param($stmt, "si", $dateTime, $userId);
			// mysqli_stmt_execute($stmt);
		// }else{
			// $updateSubscription = "UPDATE users SET subscriptionStatus='unsubscribed' WHERE userId=?";
			// mysqli_stmt_prepare($stmt, $updateSubscription);
			// mysqli_stmt_bind_param($stmt, "i", $userId);
			// mysqli_stmt_execute($stmt);
		// }

        $insertActivity = "INSERT INTO userslog (userId, activityType, userActivity, userActivityDesc, activityDate) VALUES (?, ?, ?, ?, ?)";
        $activityType = "subscriptionStatus";
        $userActivity = "unsubscribed";
		$userActivityDesc = "";
		if($sender == "user"){
			$userActivityDesc = "userUnsubscribed";
		}else{
			$userActivityDesc = "adminUnsubscribed";
		}
        

        mysqli_stmt_prepare($stmt, $insertActivity);
        mysqli_stmt_bind_param($stmt, "issss", $userId, $activityType, $userActivity, $userActivityDesc, $dateTime);

        if(mysqli_stmt_execute($stmt)){
            // unset and destroy global session variables
			if($sender == "user"){
				session_unset();
				if(session_destroy()){
					echo $userActivity;
				}
			}else{
				echo $userActivity;
			}

            mysqli_stmt_close($stmt);
		    mysqli_close($conn);
        }
    }

    deactivateAccount($conn);
?>