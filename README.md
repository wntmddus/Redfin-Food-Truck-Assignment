# Redfin-Food-Truck-Assignment
### Install
Install latest node version https://nodejs.org/en/download/
In the same directory as package.json run `npm install` or `yarn`

Check if nodejs version is correctly installed by typing `node -v` and `npm -v`.
When installed, they will both show up currently installed versions of node and npm.

### Application guideline
Run `npm start`

```
$ npm start

> FoodTruckAPI@1.0.0 start C:\Users\wntmd\OneDrive\personal\work\food truck project
> node src/index.js

NAME              ADDRESS        
Julie's Hot Dogs  2386 MISSION ST
Paradise Catering 855 GEARY ST
Street Meet       100 LARKIN ST
Do you want to continue receiving list of food trucks?(Y/N)
```

Only 10 results will show up each time user requests for list. Then next 10 results show up when user inputs Y. If there are no more results returning from request or upon user input of N, program will terminate with message.

### Developing it as a Web application

If I were to develop this as a full scale web application, there are several ways we can go around to do this. 
-   First, we can just make single call to a Socratia API and get bulk list of food trucks without adding `$limit` and `$offset` to a get call. Then store results into redux upon page generation. When `Load More` is getting called to get more list, it will loop through lists in redux to load more results to user. This approach might help us reduce down on usage of Socratia API, but it will not display up to date lists to user. 
-   Second, we might want to just call Socratia API everytime user clicks `Load More` for more results. This approach will display upto date results to user, but if we were to think about scaling this application, it will blow up our limit to use socratia API and become very inefficient in terms of performance.
-   Third, we can develop one simple microservice that maintains the up to date list of food trucks on its database using its current time. When user request to load this application, application can make a call to our microservice with the timezone that user is located at. By doing this, we are not going to blow up Socratia API to reach its limit, and be able to provide up to date results to user. However, this approach will cost more for maintaining database and hosting server for extra microservice.

Since this is not going to be a command line application, we need to apply better logging(not using console log) and error handling from making api calls.