<?php require('connection/dbConnection.php'); ?>
<?php
    // validate is number exists in the database
    function validateNumber($mobileNumber, $stmt){
        $selectNumber = "SELECT mobileNumber, numberActivate FROM registeredmobile WHERE mobileNumber = ?";
        mysqli_stmt_prepare($stmt, $selectNumber);
        mysqli_stmt_bind_param($stmt, "i", $mobileNumber);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $resultNumber = mysqli_stmt_num_rows($stmt);

        if($resultNumber == 0){
            // stop execute if no match
            return;

        }else if($resultNumber > 1){
            // for duplicate numbers return exists if true
            mysqli_stmt_bind_result($stmt, $mobNumber, $numberActivate);
            while(mysqli_stmt_fetch($stmt)){
                return "exists";
            }
        }else if($resultNumber > 0){
            // if there is a match
            mysqli_stmt_bind_result($stmt, $mobNumber, $numberActivate);
            while(mysqli_stmt_fetch($stmt)){
                if($mobNumber == $mobileNumber){
                    // check if the mobile is unsubscribe
                    // this is for mobile numbers that are unsubscribed to the service
                    if($numberActivate == 0){
                        // update the numberActivate column
                        $updateNumber = "UPDATE registeredmobile SET numberActivate = 1 WHERE mobileNumber = ?";
                        mysqli_stmt_prepare($stmt, $updateNumber);
                        mysqli_stmt_bind_param($stmt, "i", $mobileNumber);
                        $executeStmt = mysqli_stmt_execute($stmt);

                        $updateSubStatus = "UPDATE users SET subscriptionStatus='subscribed' WHERE mobileNumber=?";
                        mysqli_stmt_prepare($stmt, $updateSubStatus);
                        mysqli_stmt_bind_param($stmt, "i", $mobileNumber);
                        $executeStmt = mysqli_stmt_execute($stmt);
                        
                        // return the welcome back message
                        if($executeStmt){
                            return "unsub";
                        }

                    }else if($numberActivate == 1){
                        // if mobile number already subscribed to the service
                        // return message already subscribe
                        return "sub";
                    }
                }else{
                    // something went wrong return
                    return;
                }
            }
        }

    }
    // registration process
    function insertNumber($mobileNumber, $stmt){
        date_default_timezone_set("Asia/Brunei");
        $dateTime = date("Y-m-d H-i-s a");
        $activate = 1;
        $insertData = "INSERT INTO registeredmobile (mobileNumber, registrationDate, numberActivate) VALUES (?, ?, ?)";

        
        mysqli_stmt_prepare($stmt, $insertData);
        $stmtBind = mysqli_stmt_bind_param($stmt, "isi", $mobileNumber, $dateTime, $activate);

        if($stmtBind){
            // insert mobile number to the database then send a message to sign up account
            mysqli_stmt_execute($stmt);
        }
    }

    if(isset($_POST['number'])){
        // santize data
        $mobileNumber = filter_var($_POST['number'], FILTER_SANITIZE_SPECIAL_CHARS);
        $stmt = mysqli_stmt_init($conn);
        // validate the mobile number then return a value based fromm the validation
        $validateNotif = validateNumber($mobileNumber, $stmt);
        if(!empty($validateNotif)){
            // if return value is not empty
            if($validateNotif == "exists"){
                // print already subscribe message
				// duplicate numbers
                echo "sub";
            }else if($validateNotif == "sub"){
                // print already subscribe message
				// already registered
                echo "sub";   
            }else if($validateNotif == "unsub"){
                // print welcome back message
				// returning customer
                echo "unsub";
            }
        }else if(empty($validateNotif)){
            // if no match for the mobile number
			// register number
            insertNumber($mobileNumber, $stmt);
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }
?>