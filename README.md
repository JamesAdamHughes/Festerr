
Louis Ditzel ld13280, James Hughes jh13293 
 
We would like this project to be marked as ongoing work on both the client and server.   
 
# Festerr 
Festerr is a music festival discovery platform that combines data from multiple 3rd party APIs (Skiddle and Spotify) to provide users with a personalised event calendar.  
 
An event is ranked by our Festerr score: the number of artists playing at the event that are also in the user's Spotify library. The more artists, the higher the rank. This score will also be calculated baed on how soon an event is occurring and how many other people have it 'favourited'. 
 
Users are also able to search for upcoming events and artists that they are interested in. 
 
# Technologies 
## Stack 
### Backend
 * Fester uses a NodeJS server to serve the html/css/js files to the client. The [ExpressJS](http://expressjs.com/) framework is used for route handling, serving the user the main app when they go to the base url. Other endpoints are used to provide a REST API service for the client to access data. For example, the `/spotify/artists/` endpoint provides the client with all of a user's Spotify artists.   
    
 * The app gathers the necessary data by hitting endpoints defined in the server. The client and server are designed to be stateless, to follow REST guidelines, and use access tokens to authorize user sessions. 
 
 * We use [Sqlite3](https://www.sqlite.org/whentouse.html) as our database engine. We choose this over MySQL and PostgreSQL because it was the most simple and effective solution to our needs while also offering excellent performance (Sqlite3 is recommeded for sites with over 100,000 hits a day). We do not need to store huge amounts of data as our database acts as a cache, and for each page we need only 2-3 SQL queries at most. Sqlite3 also required much less overhead in terms of setup and configuation, and as it offers far fewer features than than a traditional RDBMS (none of which we need for our app) is a much lighter system, and allows our site to be more responsive to user interaction with the DB when compared to a 'heavier' database solution.
 
 * To interact with Sqlite3 we could use raw SQL queries, but we decided that this would be cumberson, error prone and less secure (through SQL injection attacks). We therefore choose to use an Object-Relational Mapping solution, which provides an API ontop of a database that allows us to use a 'virtual object database' in our Javascript code to manage to underlying data. We choose to use [Sequelize](http://docs.sequelizejs.com/en/latest/) as it is a promise-based ORM for Node.js which supports using SQlite and features transaction support, relations and more. (See more in the technical challanges section). 
 
### Frontend
   
 * [AngularJS](https://angularjs.org/) is a popular frontend framework developed by Google, which we have used to aide in the creation of our Single Page App (SPA). Angular provides an implementation of the Model, View, Controller (MVC) pattern. A declarative user interface allows two-way bindings to be added to HTML templates, allowing data on the page to be updated in real time when background models are changed. The app is built with reusable components (services, directives, factories) which are injected into the required views. This allows the separation of display & render logic (such as DOM manipulations) from the main logic (network requests, behind-the-scenes logic), which promotes DRY code, more so than with standard JavaScript. Finally, Angular comes with a powerful testing framework, Protractor, that provides unit and integration testing for the entire front end. 
  
 * We use vanilla CSS3 to provide styling to components. However, Angular also allows styles and classes to be applied dynamically, which results in some inline CSS on some components.   
  
 * Festerr has a unique logo and favicon, created using GIMP and saved as .pngs and .ico files. Button icons use the .svg format to allow for adaptive rescaling.   
  
 * [Angular Material](https://material.angularjs.org/latest/) is a CSS library that provides pre-built HTML components that are a 'reference implementation of Google's Material Design Specification.' These components are reusable and tested, and also integrate well with the AngularJS framework we are already using.  

     
## APIs 
 * All event info is gathered from [Skiddle](http://www.skiddle.com), a festival and event finder website. We use the [API](http://www.skiddle.com/api/) to access data about events happening in the UK. Other event APIs exist, such as SongKick, however Skiddle proved the least restrictive: allowing us to search for any events in a given time frame. Skiddle also provides basic artist data, which we cross-reference with Spotify data to provide a tailored front page for every user. 
     
 * [Spotify](https://www.spotify.com/uk/) is one of the largest music streaming services in the UK, offering both free and premium tiers. People interested in festivals and music events are likely to have Spotify accounts containing self-curated playlists full of their favourite music. Spotify provides an [API](https://developer.spotify.com/web-api/) to access this data allowing us to enrich our platform by personalising it to a user's music taste. 
 
## Challenges Faced
 * __Workflow__. The first important hurdle to cross was the workflow implementation. When multiple people are working on a project with as many parts as this, it can be easy to lose track of what another person is doing. Both members of the team are well-versed in the use of git to manage a project and so the project was integrated into version control before any code was written. GitHub was used to host the repository and keep track of issues, pull requests and code reviews. We used another service, [Waffle.io](https://waffle.io/) (which integrates heavily with GitHub) to organise our tasks, by separating them into 'Backlog', 'In Progress', 'In Review' and 'Done' lists. This eased development headaches dramatically as it clearly structured the work we had done and the work that remained to be done. 
 
 * __Responsive Design__. Modern websites should be designed to be viewable and usable on many different screen sizes, be they desktop, tablet or phone. This can be done by using separate desktop and mobile templates and serving the appropriate one, or using one responsive template that dynamically fits to any screen size. As mobile use of the web is growing, so too is it important for a site to be responsive.  
    * To achive this, we designed the site mobile first, mocking up UI ideas in GIMP (which can be seen in the `/dumpFiles` folder) until we settled on a design which worked well on both small and large screens. We split the interface into 'modules' of separate content, which can be reordered or flowed on the screen using CSS media queries to define screen size breakpoints. The CSS property 'flex' allows items to grow and shrink in size to fit its container. Flex also allows for the ordering, spacing and wrapping of items in space using simple properties, which provide a simple but powerful tool for building responsive designs. For example, the main festival tile grid wraps to smaller sizes, showing 4 elements per row on large screens, 2 on smaller and finally a single column on phone screens. This keeps all the functionality the same but better usability on small devices. 
    * We plan to add further responsive design elements, such as increasing font sizes on smaller screens.  
  
 * __Modular Components__. While developing non-trival app in JS, we deemed it important build components as 'mini-services', stand alone modules that serve a single, clearly defined purpose. By then combining these small modules we could then build larger functional components. AngularJS promotes this design pattern through dependency injection. Modules can be composed of directive or services which contain the main logic, which are then injected into angular controllers, providing an 'inversion of control'. 
    * An example of this is our SpotifyService module. This service handles managing the user's Spotify session, for example refreshing access tokens or getting a user's artists. We then inject this into the FestivalList controller, which uses this module to retrive and display Spotify information in response to user input. 

 * __Non-blocking Design__. NodeJS (and JavaScript in general) is an asyncronous language, using an event driven loop to fire callbacks to provide non-blocking functions. This allows Node to handle many concurrent requests as they do not block as they would in other langauges, but register a callback and do CPU bound work only when no other work is being carried out. However, can lead to 'callback hell', with many nested callback functions. 
    * To prevent this, we use a relativly new feature of ECMAScript called [promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise). These act as a proxy for a value which is not know yet, but is fulliled later at some point by the result of an asyncronous function.
    * Promises can be chained, and the result of one promise passed to another when complete, but allowing other work to be done in the meantime. A common use of promises is for network requests, an inherently asynchronous action. By requesting a resource from the server, but immediatly returning a promise, we can continue with other work, such as rendering other UI components or handling other network requests until the promise is fullied by the result of the original request. This is the pattern we use for all network requests in Festerr, either from Spotify, Skiddle or our own server. We also use promises when doing IO work, such as accessing databases or loading files.
    * Using promises effectively requires practice and study, but has allowed us to build a responsive and fast site, with UI events (animation/rendering) not being blocked by slow network requests.
    * Furthermore, if we cannot render elements due to waiting on a resource to load, we display loading symbols and progress bars. This is good UI design, as it provides visual feedback to the user, instead of assuming something has frozen or broken. We also plan to implement placeholder elements while content is loading, to reduce the impact of content loading and 'jumping' around the screen.   
          
 * __Access Tokens__. When using external APIs, many often require the use of some access token retreived beforehand when a developer registers with the API provider. As these are personal to the developer and should not be shared it was essential to store them privately. This had two consequences: first, the keys would have to remain on the server, and as such all API calls would have to be called from there. As we already had a robust routing framework in place, we implemented this effectively by having specific server endpoints calling specific external APIs. Secondly, the necessary keys would have to be kept out of version control, so as to keep them safe from security breaches in the hosted git repository. This meant creating an untracked JSON file containing the keys, and maintaining it manually on both team members local repositories.
  
 * __Google Search API__. Ongoing work is being done to integrate images taken from the Google Search API to provide more images for each event. Google has a restriction on it's API that prevents it from being called more than 100 times in any given day. This throttling proved to be somewhat crippling as for one page load, 20 separate calls had to be made (one for each event shown). In order to overcome this, and similar issues plaguing other APIs, we implemented a data caching scheme, which would simply call each API once when the relevant page is first loaded on the server. This not only alleviated those problems, but reduced our reliance on the stability of these external services whilst our platform is running. 
 
 * __Festival and Event Search__. The search bar at the top of the site has been a major area of development during this first phase. Initially an input field that would filter the event list based on name alone, the search box was not complex. However we quickly realised that it would need to be a lot smarter in order to be of any real use.  
    * Using ['Chips'](https://www.google.com/design/spec/components/chips.html), we were able to come up with a system that was both smart and robust. When a user starts typing, a list of possible matches to their query appears beneath the searchbox as possible suggestions. When the one they want is found, they can select it and then start a new search, chaining the searches together to narrow down their selection.  
    * Several issues were encountered during this. First was the time it took to calculate the autocomplete suggestions meant that the user could experience some stutter whilst typing, as the client was attempting to do too much at once. By adding a check to pause the search (while showing a loading icon) if the user was typing over a certain speed, this stuttering was reduced. By then making the search asynchronous, the stuttering was eliminated completely. The second issue was one of ordering. The order that autocomplete results were being shown were simply the order they had been placed into the event & artist arrays. 
    * We wanted this to be smarter and show the most likely suggestion at the top. [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) allowed us to do exactly that. By computing the distance between all event and artist names and the current search query, we were able to sort the list from smallest to largest, giving a much tighter ordering. 
 
 * __Access Tokens__. When using external APIs, many often require the use of some access token retreived beforehand when a developer registers with the API provider. As these are personal to the developer and should not be shared it was essential to store them privately. This had two consequences. 
    * Firstly, the keys would have to remain on the server, and as such all API calls would have to be called from there. As we already had a robust routing framework in place, we implemented this effectively by having specific server endpoints calling specific external APIs. 
    * Secondly, the necessary keys would have to be kept out of version control, so as to keep them safe from security breaches in the hosted git repository. This meant creating an untracked JSON file containing the keys, and maintaining it manually on both team members local repositories.
    * All keys (and other private info) are set as enviroment variables at run time. This means the keys are never stored in code, and has the benefit of allowing different configuations of the server by setting or changing enviroment variables. This important as we have need different API codes for local development and for deployment in the wild (on Heroku).  

 * Spotify OAuth2 Flow. Some requests to the Spotify API, for example user's private data like their name or saved tracks, require the user to have granted permission for the app to access it. To prove the user has given permission, request headers to the resource must include a valid access token.
    * Spotify provides different 'flows' for authorisation, and we decided to use the [Authorisation Code](https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow) flow for Festerr. This flow provides a refresh token, to extend the validatiy of access tokens (which expire after a given time). The is suitable for us as the user need only log in once, and not on every visit to the site.
    * The OAuth2 flow consists of serval steps, detailed in the link above. This was a new challnage for us, and has been a significant feature to add as it required conforming to a rigorous 3rd party specifiation of several API calls. To improve security, we also generate unique states and codes to correlate requests and responses and ensure they come from our server. 
        * Additionally we plan to encode the hash of some client state (like the cookie) in this state variable, validating the response to additionally ensure that the request and response originated in the same browser. This provides protection against attacks such as cross-site request forgery.
    * Getting the access token from Spotify's OAuth2 service allows use to access playlist and track data from a user's spotify playlist. This token however is only valid for a certain amount of time (60 minutes). We therefore store the expiry date in the site's cookies, and when they expire automaticlly request a new access token for the user. We must also check the token is valid when the user first navigates to the page. This is done using Angular's module system, which provides a config function for modules before they are injected into other components.  

 * __Heroku__. Festerr is deployed onto a Heroku free dyno. The deployment is linked to the Festerr GitHub repository, each commit to the master branch triggers the Heroko app to fetch and delpoy the master app, using the commands defined in the Procfile. As we currently have no pre-deployment steps, this is simply `node server.js`. We plan to add a task runner (such as grunt) to run pre-deployment steps, such as minifying scripts and managing client-side dependancies.
    * We futher plan to add a continious integration service to Festerr, using CircleCI. This will allow us to run tests and other scripts required before starting the app. This be more important when we add our database, which will require migrations between deployments.
    * Heroku supports setting configuration enviroment variables, which we use to change API endpoints between local and production enviroments. For example, the spotify API callback for getting access tokens must be set to a domain, which is localhost for testing, and herokuapps in production. 

 * __Database Integration and Caching__. If one user requests data, we first check if it is in the cache and return that, otherwise we make the external call and cache the response before sending it abck to the user. We also store user id's (generated by the user's Spotify information) so that we can uniquely identify them.  between external API's and our own pages to reduce the number of external API called we need to make.  so that which is not in the cache, we fetch such cache only tokens and references to external links for as event IDs)
 

 * __XHTML__. FILL IN THIS SECTION JAMES

 * __SVG ANIAMTIONS__. FILL IN THIS SECTION LOUIS

 * __IMAGE COLOR PALETTE EXTRACTION__. FILL IN THIS SECTION LOUIS

 * __Cross Browser Compatibility__. To ensure cross browser compatibility we regularly tested the site on a range of browsers using several different rendering and JavaScript engines, including WebKit based Chrome and Safari, Gecko used by Firefox and Microsoft's Chakra and Trident. From this testing we found missing components that had to be polyfilled, for example the [fetch](https://fetch.spec.whatwg.org/) API for making http requests. However, by sticking to the most common HTML tags and CSS properties we encountered few issues.  
 
  
# Operating Overview 
## Running the Site 
     
 * `cd` to the festerr root level folder. 
 * run `npm install` to install the necessary NodeJS packages.
 * run `node server.js`.You should see the output `Festerr app listening at https://0.0.0.0:3000` on the prompt. 
 * Navigate to `https://localhost:3000` and you should see the page. 
 * As we are using HTTPS protocol with a self signed certificate, some browsers may show a dialog warning you when you naviagte to the page. Simply click through this to view the site.
 * We have provided a free Spotify account to use for testing. This account has several playlists containing many unique artists, allowing us to see the impact of the Festerr score. The account details are: 
    * username: UOBFesterrTest 
    * password UOBFesterrPassword 
  
## User Guide 
 
 * The main page shows a list of festivals, ranked by Skiddle as most popular to least. We limit this to 20 events, but plan to add pagination or 'infinite scrolling' to show more. 
 
 * The first time the `/event/` endpoint it called on the server, it will call the Skiddle API and retrieve the necessary event list, and then will cache it so as to reduce unnecessary calls to the external service. 
  
 * The toolbar allows users to search for events or artists. These are autosuggested as 'chips' by our search engine, which uses a version of the hamming distance (Levenshtein Distance) to give intelligent suggestions on user input, updated as they type. Events with matching names or artists are then shown. 
  
 * Selecting an event brings you to the event details page. This page gives much more detail about an event such as when and where the event is happening. It also displays all artists appearing in the event, highlighting those that are found in the user's Spotify collection. We also include a link that allows users to go to the festival's site to buy tickets. This page also shows a background image for the event which we dynamically add from our google search integration.
  
 * The toolbar contains a button allowing to user to login using an existing Spotify account. This takes them to a Spotify login page, allowing them to securely log in to Spotify servers without Festerr having to store usernames or passwords. When they agree to allow Festerr access to their playlist data, they are taken back to the front page. Festivals are then ranked by our Festerr ranking score (explained above).  
 
 
## Deployed Site on Heroku 
Festerr is also deployed on the Heroku hosting service. This reflects the current state of the master branch of the project. Navigate to https://festerr.herokuapp.com to view the site. 
 
 
# Next Stages 
 
 * Currently, when events are retrieved from Skiddle, they are stored in an object, which is then passed around the application. Although this works for now, it is not scalable, and work is underway to migrate this into an SQLite driven database.  
 
 * This database can (and will) be also used to persist users across sessions and allow them to change preferences. This will also give us the ability to tie new features to a user's account: for example, the ability to favourite a specific artist or event, so they can build their own calendar. 
 
 * The opportunity for better caching of data exists throughout the app; the Spotify API is called every time the page is refreshed, which is a needless waste of resources. Again, this is something which can be remedied with the use of a database and is something which is being actively worked on. 
 
 * There are currently three non-functional tabs across the header of the page. These will soon be put to good use providing different navigational areas of the site. The first will remain as the list present today; the second will display a list of a user's top artists; the third tab will then show a list of a user's favourited items - event or artist. The design and implementation of these have yet to be worked out, but are a crucial next step. 
 
 * In order to provide a great user experience, and really show them events that they could find interesting, we plan to update how we calculate our Festerr Score. The current single-factor implementation is ripe for upgrading and we are looking into ways of combining all the information available to us through the use of APIs and the aforementioned favouriting to rank artists and events in the best way possible. 
 
