# writywrite

#users-route
|    Route     |  HTTP  | Header(s)| Body   | Description                           |              
---------------|--------|----------|--------|----------------------------------------
/users     | GET    | none | none | Checking user who currently login
/users/login     | POST   | none | email: String(**Required**), password: String(**Required**) | Login
/users/register | POST | none | fullname: String(**Required**), email: String(**Required**), password: String(**Required**) | Register
/users/authentication/google    | POST   | none | none |Login with Google Acc

____________________________________________________________________________________

#lists-tasks-routes
|    Route     |  HTTP  | Header(s)| Body   | Description                           |   
---------------|--------|----------|--------|----------------------------------------
/articles    | GET   | token | none |Get all articles
/articles     | POST   | token | title:String(**Required**), title:String(**Required**), content:String(**Required**), featured_image:String  | Create an article
/articles/:articleId | PUT | token | Anything you want to change from the list |Edit list
/articles/:articleId | DELETE    | token | none |Delete a list
/articles/:tagName   | GET   | token | Tag Name | Find article with tag

