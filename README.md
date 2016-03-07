Louis Ditzel ld13280, James Hughes jh13293

We would like this project to be marked as ongoing work on both the client and server.  

# Festerr
Festerr is a music festival discovery platform that combines data from mutliple 3rd party API's (Skiddle and Spotify) to provide users with a personalised event calendar. 

An event is ranked by our Festerr score: the number of artists playing at the event that are also in the user's Spotify library. The more artists, the higher the rank. This score will also be calculated using how soon an event is occuring and how many other people have it 'favourited'.

Users are also able to search for upcoming events and artists that they are interested in.

# Technologies
## Stack
 * Fester uses a nodeJS server to serve the html/css/js files to the client. The [ExpressJS](http://expressjs.com/) framework is used for route handling, serving the user the main app when they go to the base url. Other endpoints are used to provide a REST API service for the client to access data. For example, the /spotify/artists/ endpoint provides the client with all of a user's Spotify artists. 
    
 * [AngularJS](https://angularjs.org/) is a popular frontend framework developed by Google, aiding the the creation of Single Page Apps (SPA). Angular provides an implementation of the Model, View, Controller (MVC) model. Two-way bindings can be added to HTML templates, allowing data on the page to be updated in real time when background models are changed.
 
 * [Angular Material](https://material.angularjs.org/latest/) is a CSS library that provides pre-built HTML components that as a 'reference implementation of Google's Material Design Specification.' These components are reusable and tested, and also integrate well with the AngularJS framework we are already using. 
 
 * The app gathers the necessary data by hitting endpoints defined in the server. The client and server are designed to be stateless, to follow REST guidelines, and use access tokens to authorize user sessions.
    
## APIs
 * All Events info is gathered from [Skiddle](http://www.skiddle.com), a Festival and Events finder website. We use the [API](http://www.skiddle.com/api/) to access this data about events happening in the UK. Other event APIs exist, such as Songkick. However, Skiddle proved the least restrictive: allowing us to search for any events in a given time frame. Skiddle also provides basic artist data, which we cross-reference with Spotify data to provide a tailored front page for every user.
    
 * [Spotify](https://www.spotify.com/uk/) is one of the largest music streaming services in the UK, offering both free and premium tiers. People interested in festivals and music events are likely to have Spotify accounts containing self-curated playlists full of their favourite music. Spotify provides an [API](https://developer.spotify.com/web-api/) to access this data allowing us to enrich our platform by personalising it to a user's music taste.

## Technial Challnages
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

## Running the Site
    
* `cd` to the festerr root level folder.
* run `node server.js`.You should see the output `Festerr app listening at http://0.0.0.0:3000` on the prompt.
* Navigate to `localhost:3000` and you should see the page.
* We have provided a free Spotify account to use for testing. This account has several playlists containing many unique artists, allowing us to see the impact of the Festerr score.

## Operating Overview
 * The main page shows a list of festivals, ranked by Skiddle as most popluar to least. We limit this to 20 events, but plan to add pagination or 'infinite scrolling' to show more.

 * The first time the `/event` endpoint it called on the server, it will call the Skiddle API and retrieve the necessary event list, and then will cache it so as to reduce unnecessary calls to the external service.
 
 * The toolbar allows users to search for events or artists. These are autosuggested as 'chips' by our search engine, which uses a version of the hamming distance (Levenshtein Distance) to give intelligent suggestions on user input, updated as they type. Events with matching names or artists are then shown.
 
 * Selecting an event expands its card to show more details, such as when and where the event is happening. It also displays all artists appearing in the event, highlighting those that are found in the user's Spotify collection. We plan to show a Google Maps location on this card as well.
 
 * The toolbar contains a button allowing to user to login using an existing Spotify account. This takes them to a Spotify login page, allowing them to securly log in to Spotify servers without Festerr having to store usernames or passwords. When they agree to allow Festerr access to their playlist data, they are taken back to the front page. Festivals are then ranked by our Festerr ranking score (explained above). 
 

 # Next Stages

 * Currently, when events are retrieved from Skiddle, they are stored in an object, which is then passed around the application. Although this works for now, it is not scalable, and work is underway to migrate this into an SQLite driven database. 

 * This database can (and will) be also used to persist users across sessions and allow them to change preferences. This will also give us the ability to tie new features to a user's account: for example, the ability to favourite a specific artist or event, so they can build their own calendar.

* The opportunity for better caching of data exists throughout the app; the Spotify API is called every time the page is refreshed, which is a needless waste of resources. Again, this is something which can be remedied with the use of a database and is something which is being actively worked on.

* There are currently three non-functional tabs across the header of the page. These will soon be put to good use providing different navigational areas of the site. The first will remain as the list present today; the second will display a list of a user's top artists; the third tab will then show a list of a user's favourited items - event or artist. The design and implementation of these have yet to be worked out, but are a crucial next step.

* In order to provide a great user experience, and really show them events that they could find interesting, we plan to update how we calcuate our Festerr Score. The current single-factor implementation is ripe for upgrading and we are looking into ways of combining all the information available to us through the use of APIs and the aforementioned favouriting to rank artists and events in the best way possible.


## Deployed Site on Heroku
Festerr is also delployed on the Heroku hosting service. This reflects the current state of the master branch of the project. Navigate to 
