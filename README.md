Louis Ditzel ld13280, James Hughes jh13293
We would like this project to be marked as ongoing work on both the client and server.  

# Festerr
Festerr is a music festival discovery platform that combines data from mutliple 3rd party API's (Skiddle and Spotify) to provide users with a personalised event calendar. 

An event is ranked by our Festerr score; the number of artists playing at the event that are also in the user's Spotify library. The more artists, the higher the rank. This score will also be calculated using how soon an event is occuring and how many other people have 'favourited' that event. 

User's are also able to search for upcoming events and artists that they are interested in.

# Technologies
## Stack
 * Fester uses a nodeJS server to serve the html/css/js files to the client. The [ExpressJS](http://expressjs.com/) framework is used for route handling, serving the user the main app when they go to the base url. Other endpoints are used to provide a REST API service for the client to access data. For example, the /spotify/artists/ endpoint provides the client with all of a user's Spotify artists. 
    
 * [AngularJS](https://angularjs.org/) is a popular front end framework developed by Google, aiding the the creation of Single Page Apps (SPA). Angular provides an implementation of the Model, View, Controller (MVC) model. Two way bindings can be added to HTML templates, allowing data on the page to be updated in real time when background models are changed.
 
 * The app gathers this data by hitting endpoints defined in the server. The client and server are designed to be stateless, to follow REST guidelines, and use access tokens to authorize user sessions.
    
## API    
 * All Events info is gathered from [Skiddle](http://www.skiddle.com), a Festival and Events finder website. We use the [API](http://www.skiddle.com/api/) to access this data about events happening in the UK. Other event API's exist, such as Songkink. However, skiddle provided the least restrictive data access, allowing us to search for any events in a given time frame. Skiddle also provides basic artist data, which we cross reference with Spotify data to provide tailored front page for every user.
    
 * [Spotify](https://www.spotify.com/uk/) is one of the largest music streaming services in the UK, offering both free and premium access. People interested in festivals and music events are likely to have Spotify accounts, which reveal their music tastes and preferences. Spotify provides an [API](https://developer.spotify.com/web-api/) allowing us to access this data allowing us to enrich the platform with a personal feel when used with Skiddle.
     

## Operating Overview
 * The main page shows a list of festivals, ranked by Skiddle as most popluar to least. We limit this to 20 events, but plan to add pagination or 'infinite scrolling' to show more than this. 
 
 * The toolbar allows users to search for events or artists. These are autosuggested as 'chips' by our search engine, which uses a version of the hamming distance (Levenshtein Distance) to give intelligent suggestions on user input, updated as they type. Events with matching names or artists are then shown.
 
 * Selecting an event expands the event card to show more details, such as when and where the event is happening. We also display all artists appearing in the event. We plan to show a Google Maps location on this card as well.
 
 * The toolbar contains a button allowing to user to login using an existing Spotify account. This takes them to a Spotify login page, allowing them to securly log in to Spotify servers without Festerr having to store usernames or passwords. When they agree to allow Festerr access to their playlist data, they are taken back to the front page. Now festivals are ranked by our Festerr ranking score (explained above). 
 
 
 # Next Stage
 Data base 
 user presistance
 favouriting items
 caching data
 tabs
 better festerr score
  

* The events shown on the page when you first start the page are actully stored in the json_dump file, which I scraped from the skiddle api in June 2015, i.e it's not dynamically pulled from skiddle. This is something which obviosuly needs to be fixed

## Running the Site
    
* `cd` to the festerr root level folder.
* run `node server.js`.You should see the output `Festerr app listening at http://0.0.0.0:3000` on the prompt.
* Navigate to `localhost:3000` and you should see the page.

## Deployed Site on Heroku
Festerr is also delployed on the Heroku hosting service. This reflects the current state of the master branch of the project. Navigate to 


# Technial Challnages
caching data, prevent api throttling (google images)
workflow, issiues, waffle, github, feature branch workflow
mention cross browser compatability
deploying in the wild
responsive design 
keeping access codes secret
spotify auth flow
lichenstein search (and search in general)
animations
Using GIMp to design logo
Sepration of concers (both in client and server)
