# Set 1
* editing password

# Set 2
* complementdata should make a copy of the raw data and append there, e.g. scop.accounts2 = angular.tojson(angular.fromjson(scope.accounts)) and now start appending to accounts2
* upon save, request from user summary message describing changes (similar to git commit -a -m "...")

# Set 3
* Do I need [ng-grid](https://github.com/angular-ui/ui-grid) ?

# Set 7: local vs remote
* the "modified" flag at the bottom near the Local Data version is correct when the data is edited, but then it disappears after a Save then a page refresh
* this is because the document.ready makes a takeSnapshot(true) at load, without downloading the data from the server
* solving this will require splitting between complemented data and non-complemented data

# Set 8
* price fetch for a particular date to also check earlier dates (go back 1 week?)
 * I think I''ve already implemented this before

# Set 9
* export to excel

# Set 10
* `getEads.php` endpoints are currently split by `type=...`. Need to merge all into one endpoint that returns all the data in one shot
* also clean up the Leb vs Dub split
