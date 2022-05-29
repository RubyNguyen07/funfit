# NUS Orbital Project 2022 - Funfit

## Team members 
**Chu Thi Thanh** 

**Nguyen Hong Ngoc** 

## Proposed level of achievement 
Apollo 11

## What is Funfit? 
Funfit is a mobile application that helps users stick with their workout routines, thus promoting a healhty lifestyle. 

## Problem motivation 
As both of us are interested in exercising, it was not diffcult for us to come up with the idea of Funfit for Orbital 2022. As we have used fitness apps before, we are excited to enhance the efficiency of the app more. Not only through the friendly and refreshing design, but we also plan to implement algorithms to improve user experience. One algorithm is the suggestion algorithm, which recommends workout routines to user based on their indicated interests. The other is similar to friend suggestion algorithm, which we are also thrilled to discover more about (partly because we got the opportunity to know in detailed how Facebook recommends our friends). 

With the fascinating journey of building the app, we expect to help students like us to maintain a healthy lifestyle that entails exercising and together build a supportive and inspiring community. 

## Core user stories 
- As a user, 
  + I can upload my profile picture and add my details (Home page). 
  + I can find suitable workout routines from fitness experts (Routine feature). 
  + I can save all my favourite workout routines in one place (Routine feature). 
  + I can plan routines ahead and keep track of my progress (Calendar feature). 
  + I can be reminded of my workout schedules (Notification feauture). 
  + I can gain points after completing each routine (Scoring system). 
  + I can chat with other like-minded users and view stories of other inspiring users (Stories and Chat features). 

## Target user profile 
- Age: 18-25  
- Occupation: Student 
- Location: English-speaking countries
- Story:
+ She/He is busy with all the schoolwork and co-curricular activities. 
+ She/He has interests in working out. 
+ She/He finds it hard to keep the motivational spirits high for a long time. 
- Motivation: 
+ Work out more regularly. 
+ Find workout friends. 

## Design and plans 
### Design of fe + be 

### Tech stack
- Frontend: React Native 
- Backend: Express.js 
- Deployment: Heroku 
- Database: MongoDB 
- Quality Assurance: Postman 

### Detailed functionalities 
1. Profile page:
- View user’s information: avatar, name, age, ultimate lifestyle target, workout interests.
- View rank of user + points (which is calculated based on workout routine completion, or in other words, how much the user sticks to the routine).

2. Calendar page:
- View all dates (Date on which user worked out will be marked).
- View each date, there shows exercises done in that particular date.

3. Routine page:
- View all routines, including recommended ones and self-created ones.
- View each routine.
- Create a routine by setting the goal for the routine, filling in exercises' name and according timing. Every day the user does the routine, points will be added to the user’s rank. Once the final goal is reached, extra points will be added to the user’s profile. 
- Schedule the routine and set reminders.
- Save recommended routine to user's library.
- Play a routine: there will be a voice reading the name of each exercise out loud followed by the timer that has been assigned to the exercise (the timer will announce when half of the time has passed, count down when there is 3 seconds left)
+ The exercise name being read out loud will be tentatively implemented by a Text-to-Speech api such as ResponsiveVoice Text To Speech API)
+ The timing will be implemented as a countdown timer and audio will be played when certain amount of time has been reached (using libraries that could play audio such as audio-play)
- Delete routines.
- Edit routines (if created by yourself).


4. Notifications feature 
- View all notifications 
- Click on notifications, which leads user to the page that notified (notifications clicked will be erased later)
- Create notifications 


5. Rank feature 
There will be 27 levels in total. Lower levels will require less points to reach while higher levels will require much more points
Points will be added when the user completes a daily routine 
Each level corresponds to a badge   

6. Story feature
- When a routine is successfully completed, the user could share the result on the app’s feed or through social media 

Allows users to post photos of their achievements that automatically disappear within 24 hours
Unlimited stories 
Functionalities: 
+ View all stories 
+ View each story 
+ Like and reply stories 
+ Create a story 
+ Delete a story 
COMMENT: Should we archive the stories? 

7. Chat feature
Allows users to send messages to each other (A user who are interested in a person’s story on the app can click on their profile and send a direct message)
Chat suggestions are filtered based on location and shared interests.
Functionalities: 
+ View all messages 
+ View a conversation 
+ Send messages
+ Delete conversation 

### Plans for milestones 
| Milestones | Tasks | 
| ---------- | ---------- | 
| Milestone 1 | <ul> <li> Create demo on Figma </li> <li> Frontend Web Routing for Profile page, Calendar, Routine page, Story page, Chat page, Notifications </li> <li>  Backend API Endpoints & Database </li> <li> Token Authentication </li> </ul> | 
| Milestone 2 | <ul> <li> Complete core features of Routine page: view routines, create new routines, view a separate routine </li> <li> Complete core features of Notifications: view notifications, click on each notification </li> <li> Complete core features of Story: view stories, create stories, delete stories </li> <li> Complete core features of Chat: view chats, sends message, delete message </li> </ul> | 
| Milestone 3 | <ul> <li> Complete Scoring system </li> <li> Complete Calendar features </li> <li> Testing </li> </ul> | 


### Work log 

## Instructions for pull requests 
1. Ensure the branch you are working on is named semantically based on the task at hand. Eg. fe-add-faq-page (for frontend), be-add-message-routes (for backend)
2. Submit the Pull Request with master as the target branch.
3. If any, link the GitHub issue to the Pull Request.
4. Ensure all CI checks are passing.
5. Assign a reviewer to review the Pull Request (optional).
6. Once the reviewer has approved the Pull Request, merge it and delete the source branch.
More information: https://docs.github.com/en/get-started/quickstart/github-flow 
