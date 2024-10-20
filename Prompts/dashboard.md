Title: Let's rewrite the dashboard.

Description: Rewrite the dashboard component to be more user-friendly and informative.

I would like to have a dashboard that displays the following information:
- The name of the family and the name of the logged in user
    Found in localStorage
- The family members in the family, clicking this links to the profile page of the family member
    Endpoint: /api/family/{id}/getfamilymembers
- The invitations in the family, clicking this links to the invitations page
    Endpoint: /api/family/{familyId}/invitations
- The last 4 or 5 chore log entries, clicking this links to the chore log page
    Aéndpooint: /api/chorelog/recent/{count}

The dashboard should be styled with the material ui theme. 

The dashboard should be in the Dashboard.jsx file.

The dashboard should be in the src/components folder.

The dashboard should be exported from the Dashboard.jsx file.


