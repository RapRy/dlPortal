<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();
    if(isset($_POST['editUserId'])){
		// array of supported file type
        $validExtensions = array('jpeg', 'jpg', 'png');
		// save path for the profile image
        $path = "../uploads/avatars/".$_SESSION['mobileNumber']."/";
		
		if(!is_dir($path)){
			mkdir($path, 0777, true);
		}

        $userId = filter_var($_POST['editUserId'], FILTER_SANITIZE_SPECIAL_CHARS);
		// get the name and file extension
        $img = $_FILES['picInput']['name'];
		// get the temporary name including the file path
        $tmp = $_FILES['picInput']['tmp_name'];
		// get error is there is error
        $errorImg = $_FILES['picInput']['error'];
		// get the file extension
        $ext = strtolower(pathinfo($img, PATHINFO_EXTENSION));
		// image file name: random numbers
        $imageFileName = rand(1000, 1000000);
		// reassign new value of th $img: random number name and the name of the current user and file extension
        $img = $imageFileName."-".str_replace(" ", "_", $_POST['editFirstName']).".".$ext;

		// check is file extension is there is a match in the array of supported file type
        if(in_array($ext, $validExtensions)){
			// concatenate the folder path where we gonna save the profile pic and the new name of the profile pic, convert profile pic name to lowercase
            $newFilePath = $path.strtolower($img);
            if($errorImg > 0){
				// promp the error notif 
                echo json_encode(['error' => "Something went wrong. Try a different picture"]);
				// echo json_encode(['error' => $_FILES['picInput']['error']]);
            }else{ 
				// no errors update the user profile pic
				// save the image to the avatar folder
                move_uploaded_file($tmp, $newFilePath);

                date_default_timezone_set("Asia/Brunei");
                $dateTime = date("Y-m-d H-i-s-a");

                $stmt = mysqli_stmt_init($conn);
                $updateUser = "UPDATE users SET profilePicture=?, latestActivityDate=? WHERE userId=?";
                mysqli_stmt_prepare($stmt, $updateUser);
                mysqli_stmt_bind_param($stmt, "ssi", $img, $dateTime, $userId);
                mysqli_stmt_execute($stmt);
				
				// record the change profile activity in the userslog table
                $insertActivity = "INSERT INTO userslog (userId, activityType, userActivity, userActivityDesc, activityDate) VALUES (?, ?, ?, ?, ?)";
                $activityType = "updateProfile";
                $userActivity = "profilePicture";
				$userActivityDesc = "proPicUpdate";

                mysqli_stmt_prepare($stmt, $insertActivity);
                mysqli_stmt_bind_param($stmt, "issss", $userId, $activityType, $userActivity, $userActivityDesc, $dateTime);
                mysqli_stmt_execute($stmt);

                mysqli_stmt_close($stmt);

                $date = date_parse($dateTime);
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
                        $newDate = $date['month']."/".$date['day']."/".$date['year'];
                        break;
                }
				
                $_SESSION['profilePic'] = $img;
                // original date format, it would be formatted inside the html
                $_SESSION['activityDate'] = $dateTime;
				// return the image filename and activityDate
                echo json_encode(['image' => $img, 'activityDate' => $newDate]);

            }
        }

        mysqli_close($conn);
    }
?>