# Sprint 2 - *t11* - *Ultra Super Team Delta*

## Goal

### A map and itinerary!
### Sprint Leader: Griffin Gilbert

## Definition of Done

* Version in pom.xml should be `<version>2.0.0</version>` for your final build for deployment.
* Increment release `v2.0` created on GitHub with appropriate version number and name.
* Increment deployed for testing and demonstration on SPRINT2 assignment.
* Sprint Review and Restrospectives completed (team/sprint2.md).
* Tasks not completed put in the Icebox to be done as time allows.


## Policies

#### Mobile First Design!
* Design for mobile, tablet, laptop, desktop (in that order).
* Use ReactStrap for a consistent interface (no HTML, CSS, style, etc.).
* Must adhere to the TripCo Interchange Protocol (TIP) for interoperability and testing.
#### Clean Code
* Code Climate maintainability of A or B.
* Code adheres to Google style guides for Java and JavaScript.
#### Test Driven Development
* Write method headers, unit tests, and code in that order.
* Unit tests are fully automated.
#### Configuration Management
* Always check for new changes in master to resolve merge conflicts locally before committing them.
* All changes are built and tested before they are committed.
* All commits include a task/issue number.
* All commits include tests for the added or modified code.
* All tests pass.
#### Continuous Integration / Delivery 
* Master is never broken.  If broken, it is fixed immediately.
* Continuous integration successfully builds and tests all pull requests for master branch.
* All Java dependencies in pom.xml.  Do not load external libraries in your repo. 
* The team lead can add their sprint overveiw file directly to master as long as that is the ONLY FILE EDITED to facilitate updates to said file


## Plan

This sprint will complete the following Epics.
*#71 The calculator data shouldn't go away when units change
*#75 The calculator needs to display an error if there is bad latitude/longitude
*#84 I may need distances in other units of measure
*#21 Show where the user is on the map
*#81 Show map and Itinerary for trip
*#83 Enter latitudes and longitudes in the calculator using degree-minute-second and other formats.
*#82 The calculator data shouldn't go away when units change.

We have agreed to break down some of the smaller epics #83, #82,#75,#84 into tasks for individual members of the team to complete. Some of the larger epics, #81 in particular, will be team efforts and will be broken down into tasks as they are moved out of the backlog.
We will also try to meet 4 times a week. MWF immediately after class and Saturday for a more lengthy session.
Key planning decisions for this sprint include ...


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | #83, #81, #82, #71, #75, #21, #16, #130* | *#83, #81, #82, #71, #75** |
| Tasks |  #98, #105, #102, #88, #92, #80, #114, #112, #89, #121, #85, #86, #128, #90, #91, #39  | #98, #105, #102, #88, #92, #80, #114, #112, #89, #121, #85, #86, #128, #90  | 
| Story Points |  *29*  | *25* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *date* | *#task, ...* |  | *none* | 
|11FEB19|   |#105, #102, #88, #80  ||
|13FEB19|   |#92, #105, #102, #88, #80  ||
|15FEB19|   |#92, #105, #102, #88, #80 ||
|17FEB19|#92  |#105, #102, #88, #80 ||
|20FEB19|#105, #102, #88,#85 | ||
|22FEB19|   | #114, #112,#85 ||
|25FEB19| #114, #112, #80| #89, #85, #86, #90| |
|27FEB19| #128 , #86, #90| | |

## Review (focus on solution and technology)
For this sprint we focused on getting our server to send and receive itineraries with all the support implied by that both client and server side. We also worked to make our website more intuitive and added explanations and instructions for everything that you can do on our website as well as error handling for the calculator.
 

#### Completed epics in Sprint Backlog 

These Epics were completed.
  #71 The calculator data shouldn't go away when units change
  #75 The calculator needs to display an error if there is bad latitude/longitude
  #81 Show me a map and itinerary for my trip - This was the main goal of this sprint and we did not complete all of it. We created Epic #130. with the one task we didn't get to.
  #82 The calculator data shouldn't go away when units change
  #83 Enter latitudes and longitudes in the calculator using degree-minute-second and other formats
* 
* 

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.
#16  I want to know where I am on the map - Did not have enough time.
#84  I may need distances in other units of measure - Started on this but more important tasks pulled away manpower.
#130 Be able to display different parts of the itinerary according to the users wishes - This was the only part of Epic #84 we did not complete.
* 
*

#### What went well
We work together well as a team and schedules and work were coordinated to ensure we always had people able to handle merge requests or help with problems. Almost always, when one person was working on the project at least one other person was either with them physically or virtually to help. 


#### Problems encountered and resolutions
The process of getting familiar with ReactJSX has made some of the tasks take an inordinately long time, this will get better with time as we get more familiar with the language. There were also some major problems with getting the backend and frontend to talk to each other the way we needed them to. This was eventually fixed by spending a lot of time in the lab and asking the TA a few questions.


## Retrospective (focus on people, process, tools)
We began to work together better as a team. We started to really produce good results for our epics although this took time.
We kept good track of what was going on and we were very careful to make sure everything worked well all the time. We never broke master. We made use of tools as soon as they were made available to improve our code and we have tried to follow clean code principles throughout the sprint.


#### What we changed this sprint
We focused much more on the process this sprint with everything happening in sequence as directed. We didn't do as much work early in the sprint and did much more later. We also spent much more time in the scrum process to enable us to distribute tasks effectively. 


#### What we did well
Group attendance slipped this sprint and although many of the absences were fairly valid we may need to be more strict with group attendance. At the same time we made sure that tasks were fully understood and that the goals were before we started coding. This meant that we spent less time having to redo code because of misunderstandings.


#### What we need to work on

We had some problems with multiple people working on the same project from the same/similar angles. We would then have one person finish and waste the other’s work. Increased communication and more efficient tasking have helped us to fix this. We also didn’t get started as early as we probably should have. This was not an issue the first sprint but we let ourselves slip on this one. We need to roll back our practices to avoid this from hurting us in sprint 3. We also had a few issues with people having to wait to begin work due to dependent parts being in progress. In the future we need to try our best to eliminate this.

#### What we will change next sprint 
We need to combine our work habits from sprint1 and 2. We need to keep our workflow constant to avoid dependency issues holding us back as happened a few times by making sure that tasks are done in sequence and no one is held up by other work not being done. Otherwise we have been pretty good.
