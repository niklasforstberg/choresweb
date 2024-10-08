I have written some code in my api that sends out email invitations. The url that the user can click on takes them to this app and looks like this: 
https://chores.forstberg.com/api/invitation/{invitation.Token}/accept
This url takes not to this app, but straight to the api. This is wrong I think, instead we should write a Acceptinvitation component that the user can navigate to. This component should pass on the token to the api. In return, the api runs this code:

// Return response with family information and user existence status
                    var responseData = new
                    {
                        Message = "Invitation accepted successfully.",
                        UserExists = userExists,
                        Family = new
                        {
                            FamilyId = invitation.FamilyId,
                            FamilyName = invitation.Family.Name
                        },
                        InviteeEmail = invitation.InviteeEmail
                    };

                    return Results.Ok(responseData);

note that the JWT is included in the axiosconfig.js file.
