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
* Each team member must complete Interop with another team and file an issue in the **class** repo with the results.
  * title is your team number and your name, 
  * labels should include Interop and the Team that you tested with, 
  * description should include a list of tests performed, noting any failures that occurred.

## Plan

### TFFI
* Add another optimization level for 3opt in TIPItinrary requests
* TIPConfig needs to have a country filter
* Update version #'s
* No other changes of note

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
|Epics|	4 epics #21 #343 #344 #336 | 4	|
|Tasks|	38	|31|
|Story| 31|27	|
## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
|april 21st |    | #339, #340, #341|       |
|april 25th |    |#339, #340, #341 |       |
|april 29th |    |#339, #340, #341 #368 #372|   |
|May 3rd | #368 #372 |#339, #340, #341 #373 #367 |  |
|May 4th | #373 #367 |#339, #340, #341|      |
|May 6th |#284 #376 #378| |  |
|May 8th |#371 #381 #340 #384 #363 #39 #389 #396 #394| #339 #341| |




## Review (focus on solution and technology)
This sprint, we worked as a team to implement tasks resulting from feedback we received on our website. We focused on an intuitive and easy to use experience in keeping with our mobile first design policy. We made an effort to really stick to that philosophy this time around. To that end we implemented symbolic buttons and slimmed down our UI to the minimum. The theory is that a user can look at those symbols in place of text and intuitively understand what they do within the context of our website. This should allow for a much more streamlined and enjoyable user experience in keeping with the sprints main objective, “A Great User Experience!”
 

#### Completed epics in Sprint Backlog 

* #336 User: Make the application easier to use.
* #343 Implement recived UI changes for our homepage
* #344 Implement recived UI changes for our SQL page
* #21 User: I want to know where I am on the map


#### Incomplete epics in Sprint Backlog 
NONE!!!


#### What went well
We really began to work as a team, roles were well established and what each member of the team was able to accomplish tasks in a fairly timely manner with the others supporting as needed. We made sure that the plan was made before we started work and that we knew what we were going to do when we began to make changes.


#### Problems encountered and resolutions
There were two main issues encountered this sprint. The first was availability of labor. We all had other classes with final projects and papers due. On top of that two of us had a major school sponsored event in the middle of the sprint which demanded a very large portion of those team members attention for a solid week. The other problem was disagreements about UI changes. When you really begin to dive into UI, things begin to be subjective as to what changes constitute a better user experience. We solved these disagreements by looking at all proposed UI's and voting on what we thought was the best with majority vote being the one we went with.  


## Retrospective (focus on people, process, tools)
We had a pretty good sprint overall. We did have some problems with getting started and our burndown reflects that. In past sprints we had been pretty good about not doing a "big bang" at the end and we slipped a little bit this time. We also began to experience the problems that technical debt can impose for the first time. We found out one of our libraries was not working as intended and was stripping negative signs off of coordinates when it changed their formats from DMS to decimal. Other tasks that would have been minor if implemented at the start of the project became much harder as they had to be plugged into existing frameworks that were not designed to support them. Other than those two things I think we had a very successful sprint.

#### What we changed this sprint
We really placed an emphasis on testing our changes before we implemented them. We made sure that there was nothing unexpected that resulted from a change to our code. We also tried to be more proactive about adding tasks to our ZenHub so that people knew what was being worked on by all members of the team. 

#### What we did well
We made sure that everyone knew what was being done by the other members of the team during each part of the sprint. We also put our best foot forward in terms of settling disagreements within the team (UI stuff mostly). I feel as though we have worked through many of the problems that we had in past sprints and we are now functioning smoothly as a team.


#### What we need to work on
We need to actually implement test driven development. We need to write the tests first and then the functions that use those tests. I also think that our pre sprint planning could be better from a "this is what we want the end product to look like exactly" standpoint to avoid those arguments about UI. It's great that we settled those arguments, now let's focus on not having them in the first place!


#### What we will change next sprint 
We will implement Test driven development and put together a much more cohesive plan before we begin work. We will also strive to make sure that work schedules can be done around school and activities and coordinate so we don't end up doing a "big bang" at the end of the sprint.

