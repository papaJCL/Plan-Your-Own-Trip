# Sprint 4 - *t11* 

## Goal

### Worldwide!
### Sprint Leader: *Jeremy Lesser*

## Definition of Done

* Version in pom.xml should be `<version>4.0.0</version>` for your final build for deployment.
* Increment release `v4.0` created on GitHub with appropriate version number and name.
* Increment `server-3.5.jar` deployed for testing and demonstration on CHECK4 assignment.
* Increment `server-4.0.jar` deployed for testing and demonstration on SPRINT4 assignment.
* Sprint Review, Restrospective, and Metrics completed (team/sprint4.md).


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

## TFFI SPEC
 * TIP version has switched to 4 across all protocals. 
 * TIPConfig: placeAttributes now contains region country and continents, optimizations has option shorter if implemented. Also new element "filters" to aid TIPFind.
 * TIPDistance: no changes to note in new spec
 * TIPItinerary: No changes to note outside new place attributes and possible new optimization of specified in TIPConfig
 * TIPFind: new element narrow from TIPconfig filters to apply to the search on server side as well as now changing non alphanumeric characters to wildcard.
 * Deficiences: in TIPFind in the case where a limit was specified and the number of elements found was less than the limit an array was returned of size limit with some null values - a fix has been planned but not yet implemented. Also schemas were not fully in working order but will be soon

*Diagrams:*
- Class Diagram/Heirarchy
![server](/diagram/xd.jpg)

This sprint will complete the following Epics.
* #245:User: I would like to highlight certain places on the map:
A map full of markers isn't useful, don't display them by default.
Let me select one or more places in the itinerary to highlight on the map with markers.
Let me clear the markers.
Provide useful information on the marker labels.

* #254
User: Let Me Plan Trips World-Wide:
TripCo has acquired a worldwide database for trip planning. New tables world, regions, countries, and continents are available. These tables are related.
Let the user select from destinations worldwide using region, country, and continent information.
Let the user filter in addition to the matching.
Allow non alphanumeric characters in the match string, converting all non-alphanumeric characters to a single character wildcard to prevent SQL injections with special characters.

* #261
User: I want to view my trip in other tools:
I'd like to view my trip in other tools
Write the itinerary in CSV file format so the user can open it in a spreadsheet or other tool.
Write the map in KML or SVG file format so the user can view it in google earth or any tools that renders graphics.

* #262
User: Can trips be shorter?
Add the "shorter" option for the user to select.
Apply the 2-opt improvement algorithm to the nearest neighbor construction algorithm to find the shortest optimized trip.
The person that implemented nearest neighbor may not implement 2-opt. Similarly for 3-opt on the next sprint.




## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | #245 #254 #261 #262| #245 #254 #261 #262|
| Tasks | #256 #247 #248 #249  #251 #254  #255 #256  #257  #258 #268  #260 #259 #252 #250 #276 #246 #277 #307 #303 #292 #311 #321 #278 #258 #296 #281 #284| #256 #247 #248 #249  #251 #254  #255 #256  #257  #258 #268  #259 #252 #250 #276 #246 #277 #307 #303 #292 #311 #321 #278 #258 #296 #281
| Story Points | 28 | 29 | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *April 3* | *#252, #259* | *#257 #250* | *none* | 
| *April 5* | *#257, #250* | *#251, #249, #255* | *none* | 
| *April 8* | *#251, #249, #255* | *#276 , #246, #277*| *Refactoring SQL is alot more work than previously thought* | 
| *April 10* | *#276 , #246, #277* | *#248, #293* | *none* | 
| *April 12* | *#248, #293* | *#268, #245, #247, #307, #256* | *Needed more tasks* | 
| *April 17* | *#268, #245, #247, #307, #256* | *#303, #262, #292, #311, #321, #278, #261, #258 , #296, #281* | *Needed more tasks* | 
| *April 18* | *#303, #262, #292, #311, #321, #278, #261, #258 , #296, #281* | *none* | *none* | 




## Review (focus on solution and technology)

In this sprint, we didn't learn about many technologies compared to other sprints. This sprint was more about refining our skills and added small new components. The only thing that was completley new was saving the itinerary as a KML or CSV file. The rest was just further adding smaller components in REACT. On the server side 2-opt was about the same difficulty as nearest neighbor and didn't add anything new. 

#### Completed epics in Sprint Backlog 

These Epics were completed.

*  #245:User: I would like to highlight certain places on the map:*
*  #254:User: Let Me Plan Trips World-Wide:*
*  #261:User: I want to view my trip in other tools:*
*  #262:User: Can trips be shorter?*

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* None*
*

#### What went well

This sprint went alot better than last time. Although we started from a poor plan in the beginning(we started with a good plan with sprint 3 however), we were able to fix it task by task and ended up with finishing all the epics. Additionally we didn't start with enough tasks so as the sprint went on we realized we needed to add alot more, which in turn made us more productive aswell. Overall this was the best sprint so far even though we had a rocky start.  


#### Problems encountered and resolutions

Many of the problems that were encountered from this sprint were quite small. The only major issue was not having enough tasks and we fixed that halfway through the sprint. The small problems that we encountered were finding new bugs on master after each pull request , and some people not testing their changes enough. 


## Retrospective (focus on people, process, tools)

In this sprint, we focused on refining our skills and expanding our knowledge. We also focused on fixing many small client-side bugs that were introduced from the last sprint and making the code more cleaner overall. Additionally we made the process alot better by working in the lab as a group the majority of the time so we could all be there helpful.
Jeremy focused on cleaning the majority of the client side stuff and adding the extra SQL features. Darien worked on implementing the marker epic and the new tools epic. Edward worked on the SQL side of server and eventually 2-opt. Griffin worked on schemas. 

#### What we changed this sprint

For this sprint we changed how we conquered the problems. Instead of working solo at home, 90% of the work was done in the labs as a group. We also had a much higher focus for clean code and test coverage aswell. 

#### What we did well

Alot of things went this sprint. Working as a group meant that we alot less bugs because before each pull request we would test as a gruop to see if anything was broken. 

#### What we need to work on

We could improve on doing even more testing. Although we wrote alot of tests we didn't test on the actual website to see if these changes broke anything else, and they did alot more than we thought they would. So after each pull request we need to really test all the features not just some to make sure we dont introduce new bugs. 

#### What we will change next sprint 

We will change by adding more tasks in the beginning and doing more thorough testing for both client side and server side when new features are added. 
