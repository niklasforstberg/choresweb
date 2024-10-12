Please create a component for creating chores. This new page will let the family owner manage the chores to track. Here is the curl command from swagger of the api that adds a new chore:
curl -X 'POST' \
  'https://localhost:7165/api/chore/add' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": 0,
  "name": "string",
  "description": "string",
  "familyId": 0
}'

We should not send in the id when calling the api, as the database will create the id. 

The component should have a form with the following fields:
- Name
- Description

It should have a button to submit the form. When the form is submitted, it should call the api to create the chore. 

It should also display any errors that occur when submitting the form.

It should be a react functional component that is exported from the file.

When the chore is created, the chore should be added to the list of chores. The list of chores should be displayed above the insert fields. There should be a delete icon next to the name of the chore. 

When the delete icon is clicked, the chore should be removed from the list and the database, i.e. a call to the api should be made to delete the chore. The endpoint for deleting a chore is:
  'https://localhost:7165/api/chore/delete/{id}'


When the Add button is clicked, it should call the api to create the chore. The button should be disabled while the chore is being created and the text should change to Creating....
The button should then be enabled again and the text should change to Add once the chore is created.

The api endpoint for fetching the existing chores is:
'https://localhost:7165/api/chore/getall/{familyId}'

