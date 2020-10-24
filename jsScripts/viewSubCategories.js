$('document').ready(function(){

    
    $.each($('.viewSubCatListWrapper'), function(i, cat){
        if($(cat).children(".subCatContainer").length === 0){
            $(cat).append(`<p>No Sub Categories</p>`);
        }
    })
	
	class Notification{
		static confirmNotification(msg1, msg2){
			$('.viewSubCatContainer').prepend(`
				<section class="notification">
					<div class="notif-container">
						<p class="confirmCaution"><i class="fas fa-exclamation-triangle"></i>${msg1}</p>
						<p>${msg2}</p>
						<div class="twoBtnContainer container">
							<div class="row">
							<button type="button" class="btnRedConfirm twoBtnGlobal col mr-3" id="confirmBtn">
								CONFIRM
							</button>
							<button type="button" class="btnGray5 twoBtnGlobal col" id="closeBtn">
								CLOSE
							</button>
							</div>
						</div>
					</div>
				</section>
			`)
			
			// show notification
			$('.notification').fadeIn(400, "swing", () => {
				$('.notification').css("display", "flex");
				$('.notif-container').css("transform", "scale(1)");
			})
			// close btn hide notification
			$('#closeBtn').on('click', function(){
				$('.notification').fadeOut(400, "swing", () => {
					$('.notification').css("display", "none");
					$('.viewSubCatContainer').children('.viewSubCatContainer > :first-child').remove();
				})
				$('.notif-container').css("transform", "scale(0)");
			})
			// scroll back to top
			$('html').animate({scrollTop: 0}, 200, "swing");
		}
		
		static notifContainer(msg){
			// show notification
			$('.notif-container').html(`
				<p>${msg}</p>
				<div class="deactivateDeleteLoader">
					<div class="deactivateDeleteSpinner"></div>
				</div>
			`)
		}
		
		static removeNotif(){
			// remove the loader then show the deactivate message
			$('.deactivateDeleteLoader').remove();
			$('.notif-container').append(`<i class="fas fa-check deactivateDeleteSuccess"></i>`);
			$('.deactivateDeleteSuccess').css({display:"none"}).fadeIn(400, "swing");
			$('.notif-container p').text("Category succesfully deleted.");
			
			// remove the notification after timeout
			setTimeout(function(){
				$('.notification').fadeOut(400, "swing", function(){
					$('.viewSubCatContainer').children(".notification").remove();
				})
				$('.notif-container').css("transform", "scale(0)");
				
			}, 2000)
		}
	}
	
	class DeleteSubCat{
		deleteCat(subCatId, currentCat){
			// show confirmation box
			Notification.confirmNotification("This will delete all the contents that are in this sub category.", "Tap or click on the Confirm Button to delete the sub category.");
			
			$('#confirmBtn').on('click', function(){
				const dataForm = new FormData();
				$.ajax({
					type:'POST',
					url: "../../../backend/deleteSubCategory.php",
					contentType: false,
					processData: false,
					data: dataForm,
					beforeSend: function(){
						// append needed input field values
						dataForm.append('subCatId', subCatId);
						// change notification text
						Notification.notifContainer("Deleting Category..");
					},
					success: function(data, textStatus, xhr){
						if(xhr.status == 200){
							if(data != ""){
								// show deleteion success notif
								Notification.removeNotif();
								$(currentCat).remove();
							}
						}
					}
				})
			})
		}
		
		events(){
			$('.deleteSubCategoryBtn').on('click', (e) => {
				const subCatId = $(e.currentTarget).parent().siblings("input.subCategoryId").val();
				const currentCat = $(e.currentTarget).parent().parent();
				this.deleteCat(subCatId, currentCat);
			})
		}
	}
	
	const deleteSubCat = new DeleteSubCat;
	
	deleteSubCat.events();
})