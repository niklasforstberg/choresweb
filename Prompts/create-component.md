Please add a component that lets the new user add family members to his family. This new component should be shown right after the user clicks on "Create Family" in the CreateFamily component. 

The component should have a form that lets the user input the email of each family member. There should be a '+' button next to the input field that lets the user add another family member. When the user clicks on the '+' button, the invitee email should be added to the list of family members and the input field should be cleared and a new input field should be added. At the same time, the add button should be disabled. When the user starts typing in the new input field, the add button should be enabled. 

The form should have a submit button that lets the user submit the form. When the user clicks on the submit button, the form should be submitted. The api endpoint for that is "/api/invitations/create"

Here is the api documentation for the "/api/invitations/create" endpoint:
[InvitationDto{
id	integer($int32)
familyId	integer($int32)
inviterId	integer($int32)
inviteeEmail	string
nullable: true
status	string
nullable: true
createdAt	string($date-time)
expiresAt	string($date-time)
nullable: true
familyName	string
nullable: true
inviterName	string
nullable: true
}]

Once the user has submitted the form, the component should navigate to the next page. The next page should be a list of all the invited family member, with the status of each invite. The endpoint to get the list of invited family members is "/api/invitations/family/{familyId}".
The list should have a delete button next to each family member. When the user clicks on the delete button, the invitation should be deleted. The api endpoint for that is "/api/invitation/delete/{id}". If the delete is successfull, the family member should be removed from the list and the input field should be cleared. At the same time, the add button should be enabled. If the delete is not successfull, a notice about the error should be shown to the user, and the name should not be removed from the list.


The component should be a React functional component that is using the Material UI library for styling. It should have a state variable that holds the list of family members. It should have a method that adds a family member to the list. It should have a method that handles the form submission. It should have a method that navigates to the next page.