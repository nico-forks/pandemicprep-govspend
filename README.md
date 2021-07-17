** For this project the main branch will be gov.

# Pandemic Prep
Pandemic Prep is an e-commerce web application with the purpose of supplying products needed for emergency and/or 
"apocalyptic" situations

# Deployment: 
Our fully deployed app on heroku: https://panprep2.herokuapp.com 

# Motivation
This project is the conclusion of months of learning from an intensive bootcamp at FullStack Academy. This project reflects everything we have learned and more(PostgreSQL, Node.js, Express, React, JavaScript, axios, etc...).

# Tech/Framework used
- Database: PostgreSQL
- Backend: Node.js, JavaScript, Bluebird, bcrypt
- Middleware: Express, Json Web Token, JavaScript
- API: Axios, JavaScript
- Front End: React.js

# Features 
We provide an e-commerce web application that has three distinct stories. One for guest, one for users, and one for admins.
In addition to shopping, all of our visitors have the ability to browse disaster related news, in order to encourage them to be prepared.
Whether you are a guest, user, or admin; You have the ability to browse the products in our site and add them to your cart.

For the guest: 
    - the items in your cart are saved in local storage(items will not be saved if returning to the app on a different machine)
    - additional information is required if the guest would like to proceed to checkout

For the users:
    - email and password are the minimum requirements to become a user(password is hashed with bcrypt)
    - user info is saved in our database
    - a one week token is provided upon registration or login(must log back in after token expiration)
    - all of the users orders, as well as the individual items in a specific cart are saved in our database and available for the user to access upon request
    - the user has the ability to edit or add to their information

For the admins: 
    - initial admin: email: johnny@cash.com password: Password1
    - admins have access to an extra tab in the header that takes you to the admin page
    - the admin page has four distinct management tabs including, products, users, processing orders, and sales report
    - the admin can add/edit existing users or products as well as remove them(make them inactive, rather than deleting from database)
    - the processing orders tab shows all orders pending delivery, and allows the admin to finalize them upon completion
    - the sales report tab shows a list of all orders(both complete and processing) and combines them to show the total for that month
