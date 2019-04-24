# Sprint 3 - *T11* - *Ultra Super Team Delta*

## Goal

### Shorter trips to more places!
### Sprint Leader: *Darien Cupit*

## Definition of Done

* Version in pom.xml should be `<version>3.0.0</version>` for your final build for deployment.
* Increment release `v3.0` created on GitHub with appropriate version number and name.
* Increment `server-3.0.jar` deployed for testing and demonstration on SPRINT3 assignment.
* Sprint Review, Restrospective, and Metrics completed (team/sprint3.md).


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
* Code Coverage above 40%
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


## Plan

This sprint will complete the following Epics.

* *#148 User: Data shouldn't go away when I change tabs.*
* *#139 User: let me change my itinerary.*
* *#156 TripCo: validate all requests sent to the server and responses received by the client.*
* *#138 User: Make my trip shorter.*

Last sprint, our team realized that we messed up the priority of assigned epics and tasks while also taking a divide and conquer approach. This did not go very well for us. This sprint, we are making sure to carefully plan out each epic and task so that higher priority epics get the most attention by far. For example, we are dividing up #148 into multiple tasks and focusing on that epic first as a team before moving on to the next one. As far as reviewing the Tip spec goes, we had one deficiency that we immediatly fixed after the sprint 2 deploy; TIPitinerary didn't handle non-existant distances in the request. We also didn't preserve the state on our website due to test incompatability, but this epic was transfered over to this sprint. Finally, we still have to make sure that the itinerary can accept degrees-minutes-seconds format, but this can be done easily with the Magellan-Coords Library. As for the changes:
- request version is now 3 across all protocols
- config added an optimization element (itinerary will also have an optimization element)
- introduced find protocol with unique elements: match, limit, found, and places.

We also discussed general improvements that need to be done to our website/code, and came to the conclusion that home.js needs some reworking in order to make the itinerary more readable and to improve our code climate scores. We will also be monitoring code climate much more carefully this sprint, and have a plan to make every reviewer look at it before approving a pull request. Finally, as per our discussion with Dave, we will make sure to emphasize incremental testing with zest and npm.

*Diagrams:*

- Client Componenet/Screen Layout
![client](/diagram/client.jpg)
- Class Diagram/Heirarchy
![server](/diagram/server.jpg)
- State Diagram/Heirarchy
![server](/diagram/state.jpg)

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | #148, #139, #156, and #138.| #148 |
| Tasks |  #140, #155, #143, #149, #146, 147, #130, #140, #141, #142, #160, #162, #163, #144, #145, #158, #159, #80, #170, #173, #175, #179, #183, #185, #191, #196, #202, #204, #206, #157, #181, #130, #159, #130, #145, #181, #207* and #161  | #80, #140, #147, #155, #142, #143, #146, #149, #173, #175, #179, #183, #185 #144, #141, #158, #160, #191, #196, #202, #204, #206, #130, #159, #130, #145, #181, #207* and #161  and #170 | 
| Story Points |  31  | *29* | 

We were more careful this time in selecting the epics that we knew we could complete. We expect to finish these epics, but may not get to the last one (#156) in the case of some unforseen problem like we had last time. As for the tasks, we may complete a task or two without closing an epic towards the end if we dont finish everything in time, but we plan on getting all of them complete except for maybe the tasks accociated with epic #138. 

## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| Mar 6 | *#80, #147* | *#142, #144, #146, #155* | *none* |
| Mar 8 | *#155* | *#142, #144, #146* | *none* |
| Mar 13 | *#170, #146, #173, #175, #144, #142, and #179* | *#140, #158, #141 and #183* | *Difficulty with changing JSON* | 
| Mar 25 | *#206, #140, #204, #185, #202, #183, #149, #143, #196, #191, #160, #158* |*#157, #181, #130*| *Spring Break* |
| Mar 27 | *#206, #140, #204, #185, #202, #183, #149, #143, #196, #191, #160, #158, #157, #181, #130, #159, #130, #145, #181, #207* |*#240, #162, #214*| *Last Week Jitters*|


## Review (focus on solution and technology)

In this sprint, we learned many things new things about technologies having to do with SQL, schemas, dynamic tables, and user input. We implemented various solutions in coding and in group managment/dynamics. For coding, we made sure to organize our tasks well and take into account what everyone was best at. For our group, we made sure to dedicate time torwards programming together and helping each other face to face in order to solve problems quickly. Overall, this sprint went well as we keep increasing our group work ethic and knowledge of the source material. 

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *#148 User: Data shouldn't go away when I change tabs.*
* *#139 User: let me change my itinerary.*
* *#138 User: Make my trip shorter.*

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *#156 TripCo: validate all requests sent to the server and responses received by the client.*
1/2 tasks were completed with this epic. The last task should be easy to complete now that we know how Schemas work.

#### What went well

Despite some problems on front end, our group managed to complete many tasks, including refactoring a large part of our code to better suit our code climate. We also wrote many tests, for a total of 39% test coverage. When it came to getting actual tasks done, our group made steady progress with few major set backs. If there was a problem with a bug that couldn't be fixed by an indidual quickly, we made sure to come together as a group in order to make swift progress. Overall, our steady progress made for a good looking burndown report and a good end to Sprint 3, even if we didn't complete absolutely everything. 


#### Problems encountered and resolutions

Many of the problems we ran into involved code compatability with new features, and adapting our current infrastructure to fit new additions. Because there are many functions involved with the rendering and re-rending of state, adding functionality often involved makinig changes to many different functions that already existed in both the back end and front end. We solved these problems by using the depth first approach to coding and error solving, making sure to trace the callback tree for problem functions. For bigger bugs that took awhile, we used this method with multiple people, which solved the problem even faster. There were no major bugs that broke everything, and almost all of the problems we faced were fixed easily with a couple of lines of code. Overall, our problem solving when it came to code this sprint went very well.


## Retrospective (focus on people, process, tools)

We focused on getting our process down. We lost points last time because we rushed things that would have been easy to do planning/process side. We wanted to ensure that our ZenHub tasks were broken down into manageable chunks and that we were creating new tasks and epics as necessary. We also tried to write more test code to make the most of our jest tests and travis. Jeremy and Darien focused on getting things done client side while Edward worked almost entirely on the Server. Griffin worked a little on both. This was for the most part effective although we need to do a better job of getting everyone familiar with both front and backend.

#### What we changed this sprint

Our group didn't change a whole lot this sprint, but we have been slowly spending more time together coding in the lab. We also made sure to look at our plan more carefully and assign tasks with more consideration when compared to past sprints. Finally, we changed the way we handled bugs by dedicating our time to bugs that an individual couldn't solve in less than an hour or two. 

#### What we did well

We are starting to work very well as a group. Our communication is just about as good as we could hope for, as we make sure to let each other know problems right off the bat. We know that festering resentment doesn't bold well for a group, so everyone makes sure to bring up something with constructive criticism if they have a problem. This has served us very well so far, as we know where to tackle problems right away. This communication also goes well when it comes to the actual code too, as there aren't many possibilites to be completely lost in someone elses code. Overall, I think our group did very well with eachother this sprint and I look forward to our continued cooperation in the future. 

#### What we need to work on

Somethings that we could work on include better work division, as there is some lop-sidedness to the amount of work being done on an individual basis. There could be some better communication when it comes pushing new features on to master, but this is mostly a minor problem. Overall, there are few obvious improvements that our group needs to make. 

#### What we will change next sprint 

We will change how we plan in order to get better planning scores. We will also make sure to get more work done before the Sprint check so that we can get a better check grade. When it comes to our group dynamic, even though our communication is already good, there is always room for improvement. We will make sure to make more use out of our group chat and send messages letting people know what features are being added to master. 
