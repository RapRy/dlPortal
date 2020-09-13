<?php require('connection/dbConnection.php'); ?>
<?php
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
	
	function deleteUser($conn){
		$userId = filter_var($_POST['userId'], FILTER_SANITIZE_SPECIAL_CHARS);
		
		$regId = getRegistrationId($conn, $userId);
		
		$stmt = mysqli_stmt_init($conn);
		// delete activities
		$deleteInUserslog = "DELETE FROM userslog WHERE userId=?";
		mysqli_stmt_prepare($stmt, $deleteInUserslog);
		mysqli_stmt_bind_param($stmt, "i", $userId);
        mysqli_stmt_execute($stmt);
		// delete user
		$deleteInUsers = "DELETE FROM users WHERE userId=?";
		mysqli_stmt_prepare($stmt, $deleteInUsers);
		mysqli_stmt_bind_param($stmt, "i", $userId);
        
		if(mysqli_stmt_execute($stmt)){
			// delete mobile number
			$deleteInRegistration = "DELETE FROM registeredmobile WHERE registrationId=?";
			mysqli_stmt_prepare($stmt, $deleteInRegistration);
			mysqli_stmt_bind_param($stmt, "i", $regId);
			
			if(mysqli_stmt_execute($stmt)){
				echo "deleted";
				mysqli_stmt_close($stmt);
				mysqli_close($conn);
			}
		}
	}
	
	deleteUser($conn);
?>