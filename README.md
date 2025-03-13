# UniManager

UniManager is an app created as a university project for a database course. I went with SQL Server as a database choice which, after the experience of working with it, wasn't the best decision because of the sheer size of this moloch. I wish I'd used Postgres. 
The Application is a university management system, with the following roles available: Student, Administrator, Professor. Student has access to viewing all classes and other students classes and professor and only his grades. Professor can view everything and add grades. Adding any entity is handled by the Administrator role in the Admin dashboard. Administrator also has the ability of viewing Audit Logs and filtering them. Sessions are handled by tokens - jsonwebtoken. It's separated into 2 tokens, first is the main token which is valid for 15 minutes and the second which is valid for several hours. If the first token is about to run out (last 5 mins), it uses the long-term token to refresh the short one, if no action is made, tokens are no longer valid and the user is unable make any actions and is brought to login screen.

*the code is a mess but I have no intention of fixing it as it's too much hustle. With the knowledge I got making this, I'd to it completely different*

## Stack
Front-End:
* React with Vite bundler
* TypeScript
* Material UI

Back-End:
* Express.js with sequelize.js ORM
* JavaScript
* jsonwebtoken  

## Login Page
![image](https://github.com/user-attachments/assets/cb09bc7a-fd0e-44ff-b491-b2c53a74ded5)

## Student Search module for Admins
![image](https://github.com/user-attachments/assets/6101fb2c-10f2-425a-8613-c0dded1e4046)
![image](https://github.com/user-attachments/assets/4a5fd4f5-8532-40a5-8535-607dbec3724f)

## Student Add Form (visible for Admins only)

![image](https://github.com/user-attachments/assets/09e9975a-ff5d-4b09-8921-61d4f341f00c)

## Student Grade display
