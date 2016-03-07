Louis Ditzel ld13280, James Hughes jh13293

# Festerr
Festerr is a music festival discovery platform that combines data from mutliple 3rd party API's (Skiddle and Spotify) to provide users with a personalised event calendar. An event is ranked by the number of artists playing at the event that are also in the user's Spotify library. The more artists, the higher the rank. User's are also able to search for upcoming events and artists that they are interested in.

We would like this project to be marked as ongoing work on both the client and server.  

# Technologies
## Stack
    * Fester uses a nodeJS server to serve the html/css/js files to the client. The Express framework is used for route handling, serving the user the main app when they go to the base url. Other endpoints are used to provide a REST API service for the client to access data. For example, the /spotify/artists/ endpoint provides the client with all of a user's Spotify artists. 
    
    * [AngularJS](https://angularjs.org/) is a popular front end framework developed by Google, aiding the the creation of Single Page Apps (SPA). Angular provides an implementation of the Model, View, Controller (MVC) model. Two way bindings can be added to HTML templates, allowing data on the page to be updated in real time when background models are changed. The app gathers this data by hitting endpoints defined in the server. The client and server are designed to be stateless, to follow REST guidelines, and use access tokens to authorize user sessions.
    
## API    
    * All Events info is gathered from [Skiddle](http://www.skiddle.com), a Festival and Events finder website. We use the [API](http://www.skiddle.com/api/) to access this data about events happening in the UK. Other event API's exist, such as Songkink. However, skiddle provided the least restrictive data access, allowing us to search for any events in a given time frame. Skiddle also provides basic artist data, which we cross reference with Spotify data to provide tailored front page for every user.
    
    * [Spotify](https://www.spotify.com/uk/) is one of the largest music streaming services in the UK, offering both free and premium access. People interested in festivals and music events are likely to have Spotify accounts, which reveal their music tastes and preferences. Spotify provides an [API](https://developer.spotify.com/web-api/) allowing us to access this data allowing us to enrich the platform with a personal feel when used with Skiddle.
     
    

## Operating Overview


* The site is a single html page 'festivalMap' and a .js file 'Festerr.js' to handle all the user input on the page



* The map component is an html5 canvas, using a static image of the UK as a background
    * A canvas framework, [Fabric.js](http://fabricjs.com/), is used to handle drawing and animating the circles on the canvas in response to user input (clicking on the map, clicking on the events list)
    * Most of the code in Festerr.js is animation code to handle increasing and decreasing the size of the festival cirles, drawing them onto the canvas etc and linking them to mouse events that fire api requests.

* Selecting an event displays the event details on the right
    * The details are grabbed from the skiddle api using my api token. By sending a request to our server for the event, the server then makes the call to skiddle before returning back to our site whatever response skiddle provided. 
        * This routeabout method is because we cannot make api calls to skiddle directly from the client browser, which is known as cross-site scripting, prevented for security reasons in most browsers.
    * When the request returns successfully, we display the info on the page using a templating library called [Mustache](https://mustache.github.io/). 
        * Using a template html file in the templates/ folder, we fill the {{fields}} with data passed to the template function. The field name is replaced by the value of the same named field in the object passed to template function.
        * This template is then rendered and displayed beside the map

* The events shown on the page when you first start the page are actully stored in the json_dump file, which I scraped from the skiddle api in June 2015, i.e it's not dynamically pulled from skiddle. This is something which obviosuly needs to be fixed

## Running the Site
    
* `cd` to the festerr root level folder.
* run `node server.js`.You should see the output `Festerr app listening at http://0.0.0.0:3000` on the prompt.
* Navigate to `localhost:3000` and you should see the page.

## Deployed Site on Heroku
Festerr is also delployed on the Heroku hosting service. This reflects the current state of the master branch of the project. Navigate to 


# Technial Challnages
mention cross browser compatability
deploying in the wild
responsive design 
keeping access codes secret
spotify auth flow
lichenstein search (and search in general)
animations
Using GIMp to design logo
Sepration of concers (both in client and server)