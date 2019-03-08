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
| Epics | #148, #139, #156, and #138.| *value* |
| Tasks |  #140, #143, #149, #146, #130, #141, #162, #163, #145, #157, #158, #159, and #161  | *value* | 
| Story Points |  19  | *value* | 

We were more careful this time in selecting the epics that we knew we could complete. We expect to finish these epics, but may not get to the last one (#156) in the case of some unforseen problem like we had last time. As for the tasks, we may complete a task or two without closing an epic towards the end if we dont finish everything in time, but we plan on getting all of them complete except for maybe the tasks accociated with epic #138. 

## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *date* | *#task, ...* | *#task, ...* | *none* | 


## Review (focus on solution and technology)

In this sprint, ...

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *## epic title: comments*
* 

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *## epic title: explanation*
*

#### What went well

The ...


#### Problems encountered and resolutions

The ...


## Retrospective (focus on people, process, tools)

In this sprint, ...

#### What we changed this sprint

Our changes for this sprint included ...

#### What we did well

We ...

#### What we need to work on

We could improve ...

#### What we will change next sprint 

We will change ...
