Please create a component for adding a chore log. This page will let the family owner add a log entry of a chore being completed. Here is the curl command from swagger of the api that adds a chore log:
https://localhost:7165/api/chore/add
Here is the swagger documentation of the chore controller:
https://localhost:7165/index.html 
The endpoint expects these parameters: 
{
  "id": 0,
  "isCompleted": true,
  "dueDate": "2024-10-13T16:01:43.062Z",
  "choreId": 0,
  "userId": 0,
  "choreName": "string",
  "userName": "string"
}
But we should not send in the Id, as the database will create it.


The component should have two carousels. The first carousel should have the list of family members. The second carousel should have the list of chores. When the user selects a name or chore, that card should be highlighted. The carousels should be swipable right or left.





