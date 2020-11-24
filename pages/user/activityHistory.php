<section class="activityHistoryWrapper menuProfileDivs">
    <section class="activityHistory container">
        <h2>ACTIVITY HISTORY</h2>
        <section class="activitiesContainer container">
<?php require('../../backend/connection/dbConnection.php'); ?>
<?php 
	session_start();
	if(empty($_SESSION['userId'])){
        header('Location: ../signIn.php');
    }
?>
<?php
	function fetchData($conn, $activityType, $activityDate){
		$stmtRev = mysqli_stmt_init($conn);
		$queryRev = "SELECT contentId FROM reviews WHERE reviewType = ? AND reviewDate = ?";
		mysqli_stmt_prepare($stmtRev, $queryRev);
		mysqli_stmt_bind_param($stmtRev, "ss", $activityType, $activityDate);
		mysqli_stmt_execute($stmtRev);
		mysqli_stmt_store_result($stmtRev);
		mysqli_stmt_bind_result($stmtRev, $contentId);
		mysqli_stmt_fetch($stmtRev);

		$stmtContent = mysqli_stmt_init($conn);
		$queryContent = "SELECT contentName, subCatName, folderName FROM contents WHERE contentId = ?";
		mysqli_stmt_prepare($stmtContent, $queryContent);
		mysqli_stmt_bind_param($stmtContent, "i", $contentId);
		mysqli_stmt_execute($stmtContent);
		mysqli_stmt_store_result($stmtContent);
		mysqli_stmt_bind_result($stmtContent, $contentName, $subCatName, $folderName);
		mysqli_stmt_fetch($stmtContent);

		return ['contentId' => $contentId, 'contentName' => $contentName, 'subCatName' => $subCatName, 'folderName' => $folderName];

	}


	$stmt = mysqli_stmt_init($conn);
	$fetchActivities = "SELECT activityId, userId, activityType, userActivity, userActivityDesc, activityDate FROM userslog WHERE userId=? ORDER BY activityDate DESC";
	mysqli_stmt_prepare($stmt, $fetchActivities);
	mysqli_stmt_bind_param($stmt, "i", $_SESSION['userId']);
	mysqli_stmt_execute($stmt);
	
	mysqli_stmt_store_result($stmt);
	
	$resultData = mysqli_stmt_num_rows($stmt);
	
	if($resultData > 0):
		mysqli_stmt_bind_result($stmt, $activityId, $userId, $activityType, $userActivity, $userActivityDesc, $activityDate);
		
		$dataContainer = [];
		
		while(mysqli_stmt_fetch($stmt)){
			$date = date_parse($activityDate);
			$dateMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			// get all the activities of the current user
			$newData = [
				"activityId" => $activityId,
				"userId" => $userId,
				"activityType" => $activityType,
				"userActivity" => $userActivity,
				"userActivityDesc" => $userActivityDesc,
				"activityDate" => [
					"month" => $dateMonth[$date['month'] -  1],
					"day" => $date['day'],
					"year" => $date['year'],
					"hour" => date("g", strtotime($activityDate)),
					"minutes" => ($date['minute'] < 10) ? "0".$date['minute'] : $date['minute'],
					"ampm" => date("a", strtotime($activityDate)),
					"fullDate" => $activityDate
				],
				// reference of date and time
				"refDate" => $dateMonth[$date['month'] -  1]."-".$date['day']."-".$date['year'],
				"refTime" => date("g", strtotime($activityDate))."-".$date['minute']."-".date("a", strtotime($activityDate))
			];
			
			array_push($dataContainer, $newData);
		}
		
		$refDateContainer = [];
		
		foreach($dataContainer as $data){
			// get all reference date and push it to new array
			array_push($refDateContainer, $data['refDate']);
		}
		// remove duplicate dates and return 1 date value per duplicates
		$refDateContainer = array_unique($refDateContainer);
		// reassign indexes
		$refDateContainer = array_values($refDateContainer);
		
		$newDataContainer = [];
		
		for($x = 0; $x < count($refDateContainer); $x++){
			// loop through the reference date array
			// container for the datas that has the same date 
			$dataTempContainer = [];
			for($i = 0;$i < count($dataContainer); $i++){
				// loop through all the data then push all the data to the data container that matches the reference date until the inner iteration is done
				if($dataContainer[$i]['refDate'] == $refDateContainer[$x]){
					array_push($dataTempContainer, $dataContainer[$i]);
				}
			}
			// create new array then assign the reference date and the datas that matches the reference date 
			$dataNewTempContainer = ["dateRef" => $refDateContainer[$x], "data" => $dataTempContainer];
			// push the newly created array as a new array to the container array
			// until outer iteration is finished
			array_push($newDataContainer, $dataNewTempContainer);
		}
		
		// echo $newDataContainer[1]["data"][0]['refDate']; data structure
		
		// loop through the new array and create html elements
		// outer forEach
		foreach($newDataContainer as $data):
		
			// get index of datas that has activity type of subscriptionStatus
			$keyActivitytype = array_keys(array_column($data['data'], 'activityType'), 'subscriptionStatus');

			// remove datas based from the indexes that we store in the $keyActivityType
			foreach($keyActivitytype as $key){
				unset($data['data'][$key]);
			}
			
			if(count($data['data']) === 0):
				echo "";
			else:
			
			// split the date base to the hyphen
			$date = explode("-", $data['dateRef']);
?>
				<div class="activityWrap row">
					<div class="activityDate col-3 h-25">
						<span class="activityDateDate"><?php echo $date[1]; ?></span>
						<span class="activityDateMonth"><?php echo $date[0]; ?></span>
						<span class="activityDateYear"><?php echo $date[2]; ?></span>
					</div>
					<div class="activityDescWrap col-9">
<?php
					foreach($data['data'] as $data):
					// outer loop activities data
?>
					
						<div class="activityDesc">
							<span class="activityTime"><?php echo $data['activityDate']['hour'].":".$data['activityDate']['minutes']." ".$data['activityDate']['ampm']; ?></span>
							<?php
								if($data['activityType'] == "updateProfile"):
									// if activity is updateProfile
									$message = "";
									switch($data['userActivity']){
										case "lastName":
											$message = 'You change your Last Name to <span class="activityHighlight">'.$data['userActivityDesc'].'</span>.';
											break;
										case "firstName":
											$message = 'You change your First Name to <span class="activityHighlight">'.$data['userActivityDesc'].'</span>.';
											break;
										case "profilePicture":
											$message = 'You updated your Profile Picture.';
											break;
										default:
											$message = 'Updated Profile';
											break;
									}
									
							?>
									<p><?php echo $message; ?></p>
							<?php
								elseif($data['activityType'] == "changePassword"):
									// user changed password
							?>
									<p>You changed your password.</p>
							<?php 
								elseif($data['activityType'] == "receiveUpdate"):
									// user changed receiving update
							?>
									<p>You changed receiving updates. You will now be receiving updates via <span class="activityHighlight"><?php echo $data['userActivity']; ?></span>.</p>
							<?php
								elseif($data['activityType'] == "review"):
									$reviewMes = "";
			
									if($data['userActivity'] === "mainReview"){
										$data = fetchData($conn,$data['userActivity'], $data['activityDate']['fullDate']);

										$reviewMes = "You wrote a review about <a class='activityHighlight' href='../preview.php?content={$data['folderName']}_{$data['contentId']}'>{$data['contentName']}</a> in <span class='activityHighlight2'>{$data['subCatName']} Category</span>";
									}else if($data['userActivity'] === "subReview"){
										$data = fetchData($conn,$data['userActivity'], $data['activityDate']['fullDate']);
										$reviewMes = "You wrote a comment on a review about <a class='activityHighlight' href='../preview.php?content={$data['folderName']}_{$data['contentId']}'>{$data['contentName']}</a> in <span class='activityHighlight2'>{$data['subCatName']} Category</span>";
									}
							?>
								<p><?php echo $reviewMes; ?></p>
							<?php
								endif;
							?>
							
						</div>
					
<?php 				endforeach; ?>
					</div>
				</div>
<?php
			endif;
		endforeach;
	else:
	// if there is no history yet: for new users
?>
	<div class="noRecords">
		<p class="noRecordsText">No History</p>
	</div>
<?php
	endif;
	mysqli_stmt_close($stmt);
    mysqli_close($conn);
?>
        </section>
    </section>
</section>