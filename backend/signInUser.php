<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();
    // validate mobile number if there is match return false for error then return the id if true 
    function validateSignIn($stmt, $mobileNumber, $password){
        $selectUser = "SELECT userId, userPassword, subscriptionStatus FROM users WHERE mobileNumber = ?";
        mysqli_stmt_prepare($stmt, $selectUser);
        mysqli_stmt_bind_param($stmt, "i", $mobileNumber);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);
		
		// echo $mobileNumber;

        $resultUser = mysqli_stmt_num_rows($stmt);

        if($resultUser == 0){
			// if no such user exist
            return false;
        }else{
			// if user exist
            mysqli_stmt_bind_result($stmt, $userId, $userPassword, $subscriptionStatus);
            while(mysqli_stmt_fetch($stmt)){
                if(!password_verify($password, $userPassword)){
                    // password did'nt match
                    return false;
                }else if($subscriptionStatus === "unsubscribed"){
                    return false;
                }else{
					// password matches get the id of the current user
                    return $userId;
					// echo $_SESSION['userId'];
                }
            }
        }
    }
    // update the lastSignIn column, return true if success
    function updateSignInDate($stmt, $userId){
            date_default_timezone_set("Asia/Brunei");
            $dateTime = date("Y-m-d H-i-s a");
            $insertDateSignIn = "UPDATE users SET lastSignIn = '$dateTime' WHERE userId = ?";
            mysqli_stmt_prepare($stmt, $insertDateSignIn);
            mysqli_stmt_bind_param($stmt, "i", $userId);
            $executeStmt = mysqli_stmt_execute($stmt);
            if($executeStmt){
                return true;
            }
    }
    // assign all data from users to the global session variable
    function fetchUser($stmt, $signInReturnValue){
        // $fetchData = "SELECT users.userId, users.registrationId, users.accountId, users.profilePicture, users.firstName, users.lastName, users.mobileNumber, users.email, users.userPassword, users.userType, users.subscriptionStatus, users.signUpDate, users.lastSignIn, users.receiveUpdate, userslog.activityId, userslog.activityType, userslog.userActivity, userslog.activityDate FROM users INNER JOIN userslog ON users.userId = userslog.userId WHERE users.userId = ? ORDER BY userslog.activityDate";
		$fetchData = "SELECT userId, registrationId, accountId, profilePicture, firstName, lastName, mobileNumber, email, userPassword, userType, subscriptionStatus, signUpDate, lastSignIn, latestActivityDate, receiveUpdate FROM users WHERE userId = ?";
        mysqli_stmt_prepare($stmt, $fetchData);
        mysqli_stmt_bind_param($stmt, "i", $signInReturnValue);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $resultData = mysqli_stmt_num_rows($stmt);
		// echo $resultData;

        if($resultData > 0){
            // mysqli_stmt_bind_result($stmt, $userId, $registrationId, $accountId, $profilePic, $firstName, $lastName, $mobileNumber, $email, $userPassword, $userType, $subscriptionStatus, $signUpDate, $lastSignIn, $receiveUpdate, $activityId, $activityType, $userActivity, $activityDate);
			
			mysqli_stmt_bind_result($stmt, $userId, $registrationId, $accountId, $profilePic, $firstName, $lastName, $mobileNumber, $email, $userPassword, $userType, $subscriptionStatus, $signUpDate, $lastSignIn, $latestActivityDate, $receiveUpdate);
			
            while(mysqli_stmt_fetch($stmt)){
				// assign all data of the current user to the global session variable
                $_SESSION['userId'] = $userId;
                $_SESSION['registrationId'] = $registrationId;
                $_SESSION['accountId'] = $accountId;
                $_SESSION['profilePic'] = $profilePic;
                $_SESSION['firstName'] = $firstName;
                $_SESSION['lastName'] = $lastName;
                $_SESSION['mobileNumber'] = $mobileNumber;
                $_SESSION['email'] = $email;
                $_SESSION['userPassword'] = $userPassword;
                $_SESSION['userType'] = $userType;
                $_SESSION['subscriptionStatus'] = $subscriptionStatus;
                $_SESSION['signUpDate'] = $signUpDate;
                $_SESSION['lastSignIn'] = $lastSignIn;
                $_SESSION['latestActivityDate'] = $latestActivityDate;
                $_SESSION['receiveUpdate'] = $receiveUpdate;
            }
        }
    }
    // check content type json
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : "";
    if(stripos($contentType, 'application/json') === false){
        throw new Exception('Content-Type must be application/json');
    }
    // fetch the json data type
    $body = file_get_contents("php://input");
    // convsert to associative array
    $bodyData = json_decode($body, true);
    // check if array
    if(!is_array($bodyData)){
        throw new Exception('Failed to decode JSON object');
    }

    if(isset($bodyData['mobileNumber'])){
        // sanitize data
        $mobileNumber = filter_var($bodyData['mobileNumber'], FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_var($bodyData['password'], FILTER_SANITIZE_SPECIAL_CHARS);

        $stmt = mysqli_stmt_init($conn);
        // validate mobile number then return id of the user 
        $signInReturnValue = validateSignIn($stmt, $mobileNumber, $password);

        // if return value false
        if(!$signInReturnValue){
			// promp error
            echo "Invalid Mobile Number and Password";
        }else{
			// echo $signInReturnValue;
            // if return value true
            // update lastSignIn
            $updateReturn = updateSignInDate($stmt, $signInReturnValue);
            // if update lastSignIn success
            if($updateReturn){
				// echo $updateReturn;
                // gell all data from database
                fetchUser($stmt, $signInReturnValue);
            }
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);

    }
?>