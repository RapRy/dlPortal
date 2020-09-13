<?php require('connection/dbConnection.php'); ?>
<?php
	if(isset($_POST['mobileNumber'])){
		$mobileNum = filter_var($_POST['mobileNumber'], FILTER_SANITIZE_SPECIAL_CHARS);
		$stmt = mysqli_stmt_init($conn);
		$fetchUser = "SELECT userId, accountId, profilePicture, firstName, lastName, mobileNumber, email, userType, subscriptionStatus, latestActivityDate, receiveUpdate FROM users WHERE mobileNumber=?";
		mysqli_stmt_prepare($stmt, $fetchUser);
		mysqli_stmt_bind_param($stmt, "i", $mobileNum);
		mysqli_stmt_execute($stmt);
		
		mysqli_stmt_store_result($stmt);
		
		$resultData = mysqli_stmt_num_rows($stmt);
		
		if($resultData > 0){
			mysqli_stmt_bind_result($stmt, $userId, $accountId, $profilePicture, $firstName, $lastName, $mobileNumber, $email, $userType, $subscriptionStatus, $lastestActivityDate, $receiveUpdate);
			
			$data = [];
			
			while(mysqli_stmt_fetch($stmt)){
				
				$date = date_parse($lastestActivityDate);
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
					"latestActivityDate" => $newDate,
					"receiveUpdate" => $receiveUpdate
				];
				
				array_push($data, $newData);
			}
			
			echo json_encode($data);
			
		}else{
			echo json_encode(["result" => "No Result"]);
		}
		
		mysqli_stmt_close($stmt);
		mysqli_close($conn);
	}
?>