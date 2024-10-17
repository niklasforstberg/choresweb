Add-chore-log.md
Please create a component for adding a chore log. This page will let the family owner add a log entry of a chore being completed. Here is the curl command from swagger of the api that adds a chore log:
https://localhost:7165/api/chore/add
Here is the swagger documentation of the chore controller:
https://localhost:7165/index.html 
The "/api/chore/add"endpoint expects these parameters: 
{
  "id": 0,
  "isCompleted": true,
  "dueDate": "2024-10-13T16:01:43.062Z",
  "choreId": 0,
  "userId": 0,
  "choreName": "string",
  "userName": "string",
  "reportedByUserId": int
}
But we should not send in the Id, as the database will create it.

The user should be able to select the family member that completed the chore, and the user should also be able to select the chore that was completed.

Each family member name should be a card. If the user selectes a card, that card should be highlighted. The cards should be swipable right or left.  
Similalary, each chore should be a card. If the user selectes a card, that card should be highlighted. The cards should be swipable right or left. 
I think we should use the react-slick library to enable swiping: https://react-slick.neostack.com/docs/get-started


Here is the endpoint to get all members of the family:
https://localhost:7165/api/family/getall

Here is the endpoint for the chores:
https://localhost:7165/api/chore/getall/{familyId}


The "dueDate" should be a date picker, which is by default set to "now"

The "reportedByUserId" should be the ID of the family member who is reporting the chore.

The "choreId" should be the ID of the chore that is being completed.

The "userId" should be the ID of the family member who is completing the chore.

The "choreName" should be the name of the chore that is being completed.

The "userName" should be the name of the family member who is completing the chore.

When the response returns, the form should be reset, but the chore and name of the user should be displayed above the form, to let the user know that it was successfull

