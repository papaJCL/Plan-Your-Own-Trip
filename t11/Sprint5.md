# Sprint 5 - *t11* Ultra Super Team Delta

## Goal

### A Beautiful User Experience!
### Sprint Leader: *Griffin Gilbert*

## Definition of Done

* Version in pom.xml should be <version>5.0.0</version> for your final build for deployment.
* Increment release v5.0 created on GitHub with appropriate version number and name.
* Increment server-5.0.jar deployed for testing and demonstration on SPRINT5 assignment.
* Sprint Review, Restrospective, and Metrics completed (team/sprint5.md).



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
* Code Coverage above 50%
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

This sprint, we plan to work almost exclusively on the client side. We need to get feedback from other people both in our class and outside of it, preferably non-CS people. We already have some ideas about what needs to be done and if those prove easy to implement we will attempt to get to some of the issues in our backlog/icebox. 

Diagrams for server - hasn't changed
 Class Diagram/Heirarchy
![server](/diagram/xd.jpg)

This sprint will complete the following Epics.

#336 (subepics #343, #344) User: Make the application easier to use. Get feedback from other teams and people outside the class on your user experience.
Make improvements in your user experience so someone not familiar with it can use it with no help from team members.

Changes to make to the homepage(red boxes)
![client](/diagram/SQL.jpg)

- We need to rename the SQL page so that clients know what it does.
- We need to condense the ADD interface so that the user can fill out all potential fields and it does not take up so much space.
- The actual buttons on the displayed itinerary need to be condensed into a single grid square. (use symbols rather than words)
- when you click on a marker it should display all information for a location.

Changes to make to SQL
![client](/diagram/homepage.jpg)

- Need to make it so that filters for our database are easy to use and make sense.
- Add more descriptive fields to the results (country,continent, ect..).
- Make it so that buttons are condensed into one grid.
- Make it such that when you click to add to the current itinerary you do not need to click another button.
- (lower priority) make it so the map only shows when someone wants to view a location.

Other potential epics---
 - add a map to calculator
 - finish the custom units
 
 
 - reformat buttons so they follow the CSU style sheet and don't look like HTML
 
 #21 Find out where we are on the map
 - We need to tell the user where they are when they open our webpage.
 
 There will almost certainly be additional epics added as we get feedback from testers.


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
|Epics|	4 epics |	|
|Tasks|	6 Tasks 10 points	|value|
|Story| 6	|value	|
## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
|april 21st |    | #339, #340, #341   |       |


## Review (focus on solution and technology)


#### Completed epics in Sprint Backlog 


#### Incomplete epics in Sprint Backlog 


#### What went well


#### Problems encountered and resolutions


## Retrospective (focus on people, process, tools)


#### What we changed this sprint


#### What we did well


#### What we need to work on


#### What we will change next sprint 

