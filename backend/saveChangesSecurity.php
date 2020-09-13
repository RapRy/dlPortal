<?php require('connection/dbConnection.php'); ?>
<?php
	session_start();
	function updateData($conn){
		$userId = filter_var($_POST['userId'], FILTER_SANITIZE_SPECIAL_CHARS);
		$password = filter_var($_POST['password'], FILTER_SANITIZE_SPECIAL_CHARS);

		$passwordEncrypted = password_hash($password, PASSWORD_BCRYPT);

		date_default_timezone_set("Asia/Brunei");
		$dateTime = date("Y-m-d H-i-s-a");

		$stmt = mysqli_stmt_init($conn);

		$updateQuery = "UPDATE users SET userPassword=?, latestActivityDate=? WHERE userId=?";
		mysqli_stmt_prepare($stmt, $updateQuery);
		mysqli_stmt_bind_param($stmt, "ssi", $passwordEncrypted, $dateTime, $userId);
		mysqli_stmt_execute($stmt);

		$insertActivity = "INSERT INTO userslog (userId, activityType, userActivity, userActivityDesc, activityDate) VALUES (?, ?, ?, ?, ?)";
		$activityType = "changePassword";
		$userActivity = "userPassword";
		$userActivityDesc = "updatedPassword";

		mysqli_stmt_prepare($stmt, $insertActivity);
		mysqli_stmt_bind_param($stmt, "issss", $userId, $activityType, $userActivity, $userActivityDesc, $dateTime);

		if(mysqli_stmt_execute($stmt)){
			echo 'success';
		}

		mysqli_stmt_close($stmt);
		mysqli_close($conn);
	}

	updateData($conn);
?>