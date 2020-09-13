<?php require('connection/dbConnection.php'); ?>
<?php
    // validate the mobile number
    function validateRegistration($stmt, $mobileNumber){
        $selectRegister = "SELECT numberActivate FROM registeredmobile WHERE mobileNumber = ?";
        mysqli_stmt_prepare($stmt, $selectRegister);
        mysqli_stmt_bind_param($stmt, "i", $mobileNumber);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $resultRegister = mysqli_stmt_num_rows($stmt);

        if($resultRegister == 0 ){
            // if the number is not registered in the database
            return "Please subscribe to our service.";
        }else if($resultRegister > 0){
            mysqli_stmt_bind_result($stmt, $numberActivate);
            while(mysqli_stmt_fetch($stmt)){
                if($numberActivate == 0){
                    // if the number registered is not yet activated
                    return "Please activate your number";
                }
            }
        }else{
            // something went wrong
            return;
        }
    }
    // validate registration function end

    // validate sign up
    function validateSignUp($stmt, $mobileNumber){
        $selectSignUp = "SELECT mobileNumber FROM users WHERE mobileNumber = ?";
        mysqli_stmt_prepare($stmt, $selectSignUp);
        mysqli_stmt_bind_param($stmt, "i", $mobileNumber);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $resultSignUp = mysqli_stmt_num_rows($stmt);

        // if mobile number is already in use
        if($resultSignUp > 0){
            mysqli_stmt_bind_result($stmt, $mobNumber);
            while(mysqli_stmt_fetch($stmt)){
                if($mobNumber == $mobileNumber){
                    return "Mobile Number already exists.";
                }
            }
        }else{
            return;
        }
    }
    // validate sign up end

    // submit the form
    function insertData($stmt, $firstName, $lastName, $mobileNumber, $email, $passwordEncrypted){
        $selectUser = "SELECT registrationId, numberActivate FROM registeredmobile WHERE mobileNumber = ?";
        mysqli_stmt_prepare($stmt, $selectUser);
        mysqli_stmt_bind_param($stmt, "i", $mobileNumber);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $resultUser = mysqli_stmt_num_rows($stmt);

        $regId = "";
        $subStatus = "";

        if($resultUser > 0){
            mysqli_stmt_bind_result($stmt, $registrationId, $numberActivate);
            while(mysqli_stmt_fetch($stmt)){
                // get the registration id then set it to the variable regId
                $regId = $registrationId;
                // check if the mobile number is activated
                if($numberActivate == 1){
                    // set the subscribe status
                    $subStatus = "subscribed";
                }
            }
        }

        // check is the regId variable is not empty
        // generate a account number for the user ans set the userType to user
        // insert all the data from the form to the database
        if(!empty($regId)){
            $insertSignUp = "INSERT INTO users (registrationId, accountId, firstName, lastName, mobileNumber, email, userPassword, userType, subscriptionStatus, signUpDate, receiveUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            date_default_timezone_set("Asia/Brunei");
            $dateTime = date("Y-m-d H-i-s a");
            $accountId = mt_rand(1000000000, mt_getrandmax());
            $userType = "user";
			$receiveUpdate = "SMS";

            mysqli_stmt_prepare($stmt, $insertSignUp);
            $stmtBind = mysqli_stmt_bind_param($stmt, "iississssss", $regId, $accountId, $firstName, $lastName, $mobileNumber, $email, $passwordEncrypted, $userType, $subStatus, $dateTime, $receiveUpdate);

            if($stmtBind){
                mysqli_stmt_execute($stmt);
            }
        }
        
    }

    // check the content type if json
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : "";
    if(stripos($contentType, 'application/json') === false){
        throw new Exception('Content-Type must be application/json');
    }
    // get all data from input
    $body = file_get_contents("php://input");
    // convert data to associative array
    $bodyData = json_decode($body, true);
    // check if array
    if(!is_array($bodyData)){
        throw new Exception('Failed to decode JSON object');
    }
	
    if(isset($bodyData['mobileNumber'])){
        // sanitize inputs
        $firstName = filter_var($bodyData['firstName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $lastName = filter_var($bodyData['lastName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $mobileNumber = filter_var($bodyData['mobileNumber'], FILTER_SANITIZE_SPECIAL_CHARS);
        $email = filter_var($bodyData['email'], FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_var($bodyData['password'], FILTER_SANITIZE_SPECIAL_CHARS);

        // encrypt password
        $passwordEncrypted = password_hash($password, PASSWORD_BCRYPT);

        // initialize stmt
        $stmt = mysqli_stmt_init($conn);

        // get errors from validateRegistration
        $errorRegistration = validateRegistration($stmt, $mobileNumber);
        // get errors from validateSignUp
        $errorSignUp = validateSignUp($stmt, $mobileNumber);

        // if there is an error return by the validateRegistration
        if(!empty($errorRegistration)){
            // display the error message
            echo $errorRegistration;
        // if there is no error return
        }else if(empty($errorRegistration)){
            // if there is an error return by the validateSignUp
            if(!empty($errorSignUp)){
                // display error message
                echo $errorSignUp;
            }else{
                // if no error process the form
                insertData($stmt, $firstName, $lastName, $mobileNumber, $email, $passwordEncrypted);
            }
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }
?>