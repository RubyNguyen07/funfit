# NUS Orbital Project 2022 - Funfit

## Team members 
**Chu Thi Thanh** 

**Nguyen Hong Ngoc** 

## Level of achievement 
Artemis 

## What is Funfit? 
Funfit is a mobile application that helps users stick with their workout routines, thus promoting a healthy lifestyle. 
For more information, please refer to the README file: https://docs.google.com/document/d/1WQjS8imb594OwwgxLR8O5RfU5ZfX6ZVX1GNW9qsdOgk/edit 

## This repository 
This repository contains the code for the backend of Funfit. This is built using Express.js as the backend framework, MongoDB as the database, mongoose as the ODM and socket.IO for real-time chat.  

## Set up instructions 
1. Clone git repository 
2. Create an .env file in the app's route containing fields as in the env_fields.txt
3. Install dependencies
 ```bash
 npm install 
 ```
4. Run the server on localhost:3000
  ```bash
 npm run devstart 
  ```
  


## Design and plans 
### Tech stack
- Frontend: React Native 
- Backend: Express.js 
- Deployment: Heroku 
- Database: MongoDB 
- Quality Assurance: Mocha + Jest 

### API Endpoints 
| Endpoint | Description | Method | Note |
| ------ | ----------- | ---- |  ----------- |
| /user/signup | Create a new account | POST | Sign up with the following required fields: <ul> <li> Email: String </li> <li> Password: minimum length = 5 </li> <li> Name: String </li> <li> Country: String </li> <li> Sex: “Female”, “Male” or “Others” </li> </ul>|
| /user/signup | Log into account | POST |  Log in with the following required fields: <ul> <li> Email </li> <li> Password </li> </ul> |
| /user/refreshToken | Generate refresh token | POST |  Required field: refreshToken |
| /user/resetPassword | Reset password | POST |  Required fields: <ul> <li> UserId </li> <li> Code </li> <li> New password </li> </ul> |
| /user/forgotPassword | Send email to reset password | POST |  Required field: Email |
| /user/me | Get user's profile | GET |  Required field: authorization token |
| /user/level | Get user's level and points | GET |  Required field: authorization token |
| /user/getCalendarList | Get user's calendar list | GET |  Required field: authorization token |
| /user/getUserProfile | Get a user's profile | GET |  Required field: <ul> <li> authorization token </li> <li> otherId </li> </ul> |
| /user/getPicInfo | Get user's profile picture info | GET |  Required field: authorization token |
| /user/downloadPic | Download user's profile picture | GET |  Required field: authorization token |
| /user/updateProfile | Update user's profile | PUT |  Required field: <ul> <li> authorization token </li> <li> Fields to update </li> </ul> |
| /user/upload | Upload user's profile picture | POST |  Required field: authorization token |
| /story/recommendedFriends | Get user's friend suggestions | GET |  Required field: authorization token |
| /story/getStoriesInfo | Retrieve list of stories  | GET |  Required field: <ul> <li> authorization token </li> <li> userId </li> </ul> |
| /story/getStory | Get a story info | GET |  Required field: <ul> <li> authorization token </li> <li> name </li>  <li> contentType </li> </ul> |
| /story/uploadStory | Upload a story | POST |  Required field: <ul> <li> authorization token </li> <li> file </li> </ul>  |
| /story/deleteStory | Delete a story | DELETE |  Required field: <ul> <li> authorization token </li> <li> storyId </li> </ul> |
| /routine/getMyRoutines | Get all my routines | GET |  Required field: authorization token |
| /routine/getRecRoutines | Get all recommended routines  | GET |  Required field: authorization token |
| /routine/getRoutinesByGenre | Get recommended routines by genre | GET |  Required field: <ul> <li> authorization token </li> <li> genre </li> </ul> |
| /routine/myRoutine | Retrieve information about a routine from my library  | GET |  Required field: <ul> <li> authorization token </li> <li> id </li> </ul> |
| /routine/recRoutine | Retrieve information about a routine from recommended lists | GET |  Required field: <ul> <li> authorization token </li> <li> id </li> </ul> |
| /routine/newRoutine |  Create a new routine | POST |  Required field: <ul> <li> authorization token </li> <li> name </li> <li> duration </li> <li> steps </li> <li> timings </li> <li> genre </li> </ul> |
| /routine/addToLibrary | Add a recommended routine to user's library | POST |  Required field: <ul> <li> authorization token </li> <li> id </li> </ul> |
| /routine/deleteRoutine | Delete a routine or unsave a recommended routine  | DELETE |  Required field: <ul> <li> authorization token </li> <li> id </li> </ul> |
| /routine/editRoutine | Edit a routine  | PUT |  Required field: <ul> <li> authorization token </li> <li> id </li> <li> Fields to edit </li> </ul> |
| /routine/addDaysFollow | Add days and points to routine | POST |  Required field: <ul> <li> authorization token </li> <li> id </li> </ul> |
| /routine/addReminder | Add reminder to a routine | POST |  Required field: <ul> <li> authorization token </li> <li> reminderMessage </li> </ul> |
| /chat/initiateConvo | Initiate chat  | POST |  Required field: <ul> <li> authorization token </li> <li> anotherUserId </li> </ul>  |
| /chat/getAllConvos | Get all conversations  | GET |  Required field: authorization token |
| /chat/getAConvo | Get a conversation by id | GET |  Required field: <ul> <li> authorization token </li> <li> convoId </li> </ul> |
| /chat/deleteConvo | Delete a conversation | DELETE |  Required field: <ul> <li> authorization token </li> <li> convoId </li>  <li> anotherUserId </li> </ul>  |

## Instructions for pull requests 
1. Ensure the branch you are working on is named semantically based on the task at hand. Eg. add-message-routes 
2. Submit the Pull Request with main as the target branch.
3. If any, link the GitHub issue to the Pull Request.
4. Ensure all CI checks are passing.
5. Assign a reviewer to review the Pull Request.
6. Once the reviewer has approved the Pull Request, merge it and delete the source branch.

