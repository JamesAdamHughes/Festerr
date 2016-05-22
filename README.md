
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
    
 * The app gathers the necessary data by hitting endpoints defined in the server using AJAX requests. The client and server are designed to be stateless, to follow REST guidelines, and use access tokens in the HTTP headers to authorize user sessions. 
 
 * We use [Sqlite3](https://www.sqlite.org/whentouse.html) as our database engine. We choose this over MySQL and PostgreSQL because it was the most simple and effective solution to our needs while also offering excellent performance (Sqlite3 is recommended for sites with over 100,000 hits a day). We do not need to store huge amounts of data as our database acts as a cache, and for each page we need only 2-3 SQL queries at most. Sqlite3 also required much less overhead in terms of setup and configuration, and as it offers far fewer features than than a traditional RDBMS (none of which we need for our app) is a much lighter system, and allows our site to be more responsive to user interaction with the DB when compared to a 'heavier' database solution.
 
 * To interact with Sqlite3 we could use raw SQL queries, but we decided that this would be cumbersome, error prone and less secure (through SQL injection attacks). We therefore choose to use an Object-Relational Mapping solution, which provides an API on top of a database that allows us to use a 'virtual object database' in our Javascript code to manage to underlying data. We choose to use [Sequelize](http://docs.sequelizejs.com/en/latest/) as it is a promise-based ORM for Node.js which supports using SQlite and features transaction support, relations and more. (See more in the technical challenges section). 
 
### Frontend
   
 * [AngularJS](https://angularjs.org/) is a popular frontend framework developed by Google, which we have used to aide in the creation of our Single Page App (SPA). Angular provides an implementation of the Model, View, Controller (MVC) pattern. A declarative user interface allows two-way bindings to be added to HTML templates, allowing data on the page to be updated in real time when background models are changed. The app is built with reusable components (services, directives, factories) which are injected into the required views. This allows the separation of display & render logic (such as DOM manipulations) from the main logic (network requests, behind-the-scenes logic), which promotes DRY code, more so than with standard JavaScript. Finally, Angular comes with a powerful testing framework, Protractor, that provides unit and integration testing for the entire front end. 
  
 * We use vanilla CSS3 to provide styling to components. However, Angular also allows styles and classes to be applied dynamically, which results in some inline CSS on some components.   
  
 * Festerr has a unique logo and favicon, created using GIMP and saved as .png, .ico and .svg files. Button icons also use the .svg format to allow for adaptive rescaling.   
  
 * [Angular Material](https://material.angularjs.org/latest/) is a CSS library that provides pre-built HTML components that are a 'reference implementation of Google's Material Design Specification.' These components are reusable and tested, and also integrate well with the AngularJS framework we are already using.  

     
## APIs 
 * All event info is gathered from [Skiddle](http://www.skiddle.com), a festival and event finder website. We use the [API](http://www.skiddle.com/api/) to access data about events happening in the UK. Other event APIs exist, such as SongKick, however Skiddle proved the least restrictive: allowing us to search for any events in a given time frame. Skiddle also provides basic artist data, which we cross-reference with Spotify data to provide a tailored front page for every user. 
     
 * [Spotify](https://www.spotify.com/uk/) is one of the largest music streaming services in the UK, offering both free and premium tiers. People interested in festivals and music events are likely to have Spotify accounts containing self-curated playlists full of their favorite music. Spotify provides an [API](https://developer.spotify.com/web-api/) to access this data allowing us to enrich our platform by personalising it to a user's music taste. 
           
 * __Google Search API__. To provide extra context for an event, large header images are used on the event details page. These images are retrieved using the Google Search API as it allows the site to adapt to the addition of new events without the manual inclusion of related imagery. In order to ensure the return of accurate and relevant results, extra search terms are added along with the event in question, as well as setting filetype and size flags.  Google has a restriction on it's API that prevents it from being called more than 100 times in any given day. This throttling proved to be somewhat limiting during development as originally the search would be performed every time the page was loaded. In order to overcome this, and similar issues plaguing other APIs, we implemented a data caching scheme, which would simply call each API once when the relevant page is first loaded on the server. This not only alleviated those problems, but reduced our reliance on the stability of these external services whilst our platform is running. 
 
## Challenges Faced
 * __Workflow__. The first important hurdle to cross was the workflow implementation. When multiple people are working on a project with as many parts as this, it can be easy to lose track of what another person is doing. Both members of the team are well-versed in the use of git to manage a project and so the project was integrated into version control before any code was written. GitHub was used to host the repository and keep track of issues, pull requests and code reviews. We used another service, [Waffle.io](https://waffle.io/) (which integrates heavily with GitHub) to organise our tasks, by separating them into 'Backlog', 'In Progress', 'In Review' and 'Done' lists. This eased development headaches dramatically as it clearly structured the work we had done and the work that remained to be done. 
 
 * __Responsive Design__. Modern websites should be designed to be viewable and usable on many different screen sizes, be they desktop, tablet or phone. This can be done by using separate desktop and mobile templates and serving the appropriate one, or using one responsive template that dynamically fits to any screen size. As mobile use of the web is growing, so too is it important for a site to be responsive.  
    * To achieve this, we designed the site mobile first, mocking up UI ideas in GIMP (which can be seen in the `/dumpFiles` folder) until we settled on a design which worked well on both small and large screens. We split the interface into 'modules' of separate content, which can be reordered or flowed on the screen using CSS media queries to define screen size breakpoints. The CSS property 'flex' allows items to grow and shrink in size to fit its container. Flex also allows for the ordering, spacing and wrapping of items in space using simple properties, which provide a simple but powerful tool for building responsive designs. For example, the main festival tile grid wraps to smaller sizes, showing 4 elements per row on large screens, 2 on smaller and finally a single column on phone screens. This keeps all the functionality the same but better usability on small devices. 

 * __Non-blocking Design__. NodeJS (and JavaScript in general) is an asyncronous language, using an event driven loop to fire callbacks to provide non-blocking functions. This allows Node to handle many concurrent requests as they do not block as they would in other languages, but register a callback and do CPU bound work only when no other work is being carried out. However, can lead to 'callback hell', with many nested callback functions. 
    * To prevent this, we use a relativly new feature of ECMAScript called [promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise). These act as a proxy for a value which is not know yet, but is fulfilled later at some point by the result of an asynchronous function.
    * Promises can be chained, and the result of one promise passed to another when complete, but allowing other work to be done in the meantime. A common use of promises is for network requests, an inherently asynchronous action. By requesting a resource from the server, but immediately returning a promise, we can continue with other work, such as rendering other UI components or handling other network requests until the promise is fulfilled by the result of the original request. This is the pattern we use for all network requests in Festerr, either from Spotify, Skiddle or our own server. We also use promises when doing IO work, such as accessing databases or loading files.
    * Using promises effectively requires practice and study, but has allowed us to build a responsive and fast site, with UI events (animation/rendering) not being blocked by slow network requests.
    * Furthermore, if we cannot render elements due to waiting on a resource to load, we display loading symbols and progress bars. This is good UI design, as it provides visual feedback to the user, instead of assuming something has frozen or broken. We also plan to implement placeholder elements while content is loading, to reduce the impact of content loading and 'jumping' around the screen.      
    
 * __Database Integration and Caching__. As part of our database integration for the app, we used Sqlite3 and Sequelize to implement a caching service and unique user store.
    * __ORM__. Using an ORM like Sequelize allows us to define tables in the database as javascript objects, and interact with that data in a more object oriented way. For example, we define a User and Event object, with names, dates, locations as one would a regular Javascript object which are actually represented as tables in the database. An instance of the model object is a row in the model table. We can also specify validation for these fields to allow for better data integrity (for example not allowing Null fields), which would be cumbersome to check and maintain in Javascript objects. 
    * __Caching__. Most of the API services we use implement some kind of rate limiting or request limit, so that someone cannot abuse their service. For example the Google Search API allows only 100 searches a day from any one app. We therefore wanted to reduce the number of calls we had to make for each user visiting the site. E.g. if two users visit the 'Creamfields 2016' page, we do not want to request the data from Skiddle twice. To rectify this, we use Sqlite3 as read-through cache with an Events model that mirrors the fields of a Skiddle Event object. If one user requests data, we first check if it is in the cache and return that, otherwise we make the external call and cache the response before sending it back to the user. This means we only load unique data once per the lifetime of the server. Not only does this allow us to stay below of rate limits, but it also improves our page loading times, as we do not have the gather the data again from external APIs. If time allowed, we would also add a timeout to the data in the cache, so that we could periodically check that data in the cache was still valid against the actual data from the provider. However as event data is unlikely to change from day to day we did not see this as vital. 
    * __Users__. We also store unique userID's (the same ID that Spotify uses to identify them). We do not store any other user details, or any other tokens that could be used to access the user's personal data on Spotify. This gives security an anonymity to users visiting the site, who have nothing to fear even if our database was compromised by malicious attacks.
    
 * __User Likes__. We wanted to allow users to 'favourite' festivals they were interested in, so they could view them later if they visit the site again. We could store this in a session, but we wanted this data to persist longer than a normal cookie (an approach normally used for shopping carts etc). 
    * To prevent this temporal limitation, we created a database record that joined Users (with a unique Spotify ID) and Events (with a unique Skiddle ID). This was a many to many relationship, as one user can like many events, and an event can be liked by many users. Hence we had a UserEvents table, with each row being a mapping of userID to event ID. When a signed in user liked an event (using the Heart on the event detail page) this was saved to the database. They can continue liking as many events as they like. They can then review all liked events in the 'favourites' panel of the site. We visiting this page, we check if the user is authorized to view it (i.e. have a valid session cookie) and then retrieve all the events that their userID maps to in the database.  
 
 * __HTTPS__. To improve the security of the site, we serve all of our data over the HTTPS protocol, rather than unsecure HTTP. This means the user knows that all data being sent between the app and and server is encrytped and secure, and that no 3rd party is injected malicious data, or able to view what is being sent.
    * In order to allow HTTPS, we required an SSL certificate. This we generated and self-signed using the openssl library using up to date encryption standards. However as our certificate is self-signed, some browsers (such as chrome) warn the user before allowing them to visit it, as this is often a sign that the site in question is suspicious. Without buying a certificate we are unable to rectify this issue. Furthermore, our hosting service, Heroku, does not allow HTTPS servers without payment, and therefore that deployment runs without HTTPS. However running the site locally with the certificates installed on the system allows for HTTPS. We have added a gracefull fallback to HTTP if the required certificates are not found when the server is started.      
   
 * __Modular Components__. While developing non-trival app in JS, we deemed it important build components as 'mini-services', stand alone modules that serve a single, clearly defined purpose. By then combining these small modules we could then build larger functional components. AngularJS promotes this design pattern through dependency injection. Modules can be composed of directive or services which contain the main logic, which are then injected into angular controllers, providing an 'inversion of control'. 
    * An example of this is our SpotifyService module. This service handles managing the user's Spotify session, for example refreshing access tokens or getting a user's artists. We then inject this into the FestivalList controller, which uses this module to retrieve and display Spotify information in response to user input. 
 
 * __Festival and Event Search__. The search bar at the top of the site has been a major area of development during this first phase. Initially an input field that would filter the event list based on name alone, the search box was not complex. However we quickly realized that it would need to be a lot smarter in order to be of any real use.  
    * Using ['Chips'](https://www.google.com/design/spec/components/chips.html), we were able to come up with a system that was both smart and robust. When a user starts typing, a list of possible matches to their query appears beneath the searchbox as possible suggestions. When the one they want is found, they can select it and then start a new search, chaining the searches together to narrow down their selection.  
    * Several issues were encountered during this. First was the time it took to calculate the autocomplete suggestions meant that the user could experience some stutter whilst typing, as the client was attempting to do too much at once. By adding a check to pause the search (while showing a loading icon) if the user was typing over a certain speed, this stuttering was reduced. By then making the search asynchronous, the stuttering was eliminated completely. The second issue was one of ordering. The order that autocomplete results were being shown were simply the order they had been placed into the event & artist arrays. 
    * We wanted this to be smarter and show the most likely suggestion at the top. [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) allowed us to do exactly that. By computing the distance between all event and artist names and the current search query, we were able to sort the list from smallest to largest, giving a much tighter ordering. 
 
 * __Access Tokens__. When using external APIs, many often require the use of some access token retreived beforehand when a developer registers with the API provider. As these are personal to the developer and should not be shared it was essential to store them privately. This had two consequences. 
    * Firstly, the keys would have to remain on the server, and as such all API calls would have to be called from there. As we already had a robust routing framework in place, we implemented this effectively by having specific server endpoints calling specific external APIs. 
    * Secondly, the necessary keys would have to be kept out of version control, so as to keep them safe from security breaches in the hosted git repository. This meant creating an untracked JSON file containing the keys, and maintaining it manually on both team members local repositories.
    * All keys (and other private info) are set as environment variables at run time. This means the keys are never stored in code, and has the benefit of allowing different configurations of the server by setting or changing environment variables. This important as we have need different API codes for local development and for deployment in the wild (on Heroku).  

 * __Sessions__. Although we store the Spotify tokens in the user's cookies, it would be possible for someone to spoof those tokens to make a request for the user's data from the server. In order to prevent this, we implement user sessions along with the tokens, which are used to authurize a user's session with our own server (the Spotify tokens authorize access to Spotify data only). 
    * The sessions are encrypted and sent in the header when a user signs into the app. All further HTTP requests made by the app must include the session in the header, which is verified then by the server before sending a response back.
    * Rather than implementing our own session service (which is not recommended due to security issues) we used the popular [Client Sessions](https://github.com/mozilla/node-client-sessions) library made by Mozilla which is we use as middle-wear in our express app for all routes requiring user authentication (such as retrieving user favourites). This uses the industry standard encryption algorithms (SHA and AES).  
    
 * __Spotify OAuth2 Flow__. Some requests to the Spotify API, for example user's private data like their name or saved tracks, require the user to have granted permission for the app to access it. To prove the user has given permission, request headers to the resource must include a valid access token.
    * Spotify provides different 'flows' for authorization, and we decided to use the [Authorisation Code](https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow) flow for Festerr. This flow provides a refresh token, to extend the validity of access tokens (which expire after a given time). The is suitable for us as the user need only log in once, and not on every visit to the site.
    * The OAuth2 flow consists of serval steps, detailed in the link above. This was a new challenge for us, and has been a significant feature to add as it required conforming to a rigorous 3rd party specification of several API calls. To improve security, we also generate unique states and codes to correlate requests and responses and ensure they come from our server. 
    * Additionally we to encode the hash of some client state (like the cookie) in this state variable, validating the response to additionally ensure that the request and response originated in the same browser. This provides protection against attacks such as cross-site request forgery.
    * Getting the access token from Spotify's OAuth2 service allows use to access playlist and track data from a user's Spotify playlist. This token however is only valid for a certain amount of time (60 minutes). We therefore store the expiry date in the site's cookies, and when they expire automatically request a new access token for the user. We must also check the token is valid when the user first navigates to the page. This is done using Angular's module system, which provides a config function for modules before they are injected into other components.  
    
 * __Access Tokens__. When using external APIs, many often require the use of some access token retrieved beforehand when a developer registers with the API provider. As these are personal to the developer and should not be shared it was essential to store them privately. This had two consequences: first, the keys would have to remain on the server, and as such all API calls would have to be called from there. As we already had a robust routing framework in place, we implemented this effectively by having specific server endpoints calling specific external APIs. Secondly, the necessary keys would have to be kept out of version control, so as to keep them safe from security breaches in the hosted git repository. This meant creating an untracked JSON file containing the keys, and maintaining it manually on both team members local repositories.  

 * __Heroku__. Festerr is deployed onto a Heroku free dyno. The deployment is linked to the Festerr GitHub repository, each commit to the master branch triggers the Heroko app to fetch and delpoy the master app, using the commands defined in the Procfile. As we currently have no pre-deployment steps, this is simply `node server.js`. 
    * Heroku supports setting configuration environment variables, which we use to change API endpoints between local and production environments. For example, the spotify API callback for getting access tokens must be set to a domain, which is localhost for testing, and herokuapps in production. 
    * Our app uses many external API's, which require some kind of authentication before using them. This is in the form of keys or tokens which are sent with requests. However we cannot store this cookies in our version control, as they would be included publicly on our Github repository and is considered bad practice. Therefore we store all sensitive configuration information as environment variables in the shell of the running server. These variables can be set at runtime or stored by an external program. Heroku allows us to save environment variables when setting up the app. This means even if someone gained access to Festerr's files, they would still not get access to the sensitive information.  
 
 * __XHTML__. As part of the specification for this coursework, we ensured our site returned files consistent with the XHTML standard. To to this, we had to convert Angular data-bindings and ensure we included what doctype to render the page as. 
    * To ensure we met the specification we used the [W3C Markup Validation Service](https://validator.w3.org/) to check our page. This flagged up errors in our site, such as missing closing tags, invalid tag attributes (such as Angular directives) and others. We deemed the site XHTML valid when the validator reported no errors.
 
 * __SVG ANIAMTIONS__. After designing the logo in Gimp, it was exported as an SVG file, so it would both render crisply across all screen dimensions, and was easily animatable. SVGs allow for embedded CSS, and as such, it was possible to animate the logo for different purposes. Two copies were made, one with a white circular background, to appear in the header bar which animates on mouseover; and another (with no background) which animates at all times to be used as a loading icon. The SVG animations were added manually to the files exported from Gimp, but not until they had been tidied-up. To make them human-readable, and easier to work with, each section of the logo was given a distinct class, which could then be accessed easier in the CSS.

 * __IMAGE COLOR PALETTE EXTRACTION__. To enhance the aesthetic of the website, and allow certain important elements to really catch the user's eye, we dynamically change their colour based on the vibrant colour of a header image. On the event detail page, both the circular favouriting button and the "Buy Tickets" button take on the colour of the large header image behind them. This not only draws attention to them, but provides some thematic consistency across the page. The effect was achieved using the [Vibrant.js](http://jariz.github.io/vibrant.js/) library, a Javascript port of the palette framework found in the Android OS. The library allows you to extract prominent colours from an image, of which we take the most vibrant, and style the necessary elements in the page to match, before they are made visible to the user.

 * __Cross Browser Compatibility__. To ensure cross browser compatibility we regularly tested the site on a range of browsers using several different rendering and JavaScript engines, including WebKit based Chrome and Safari, Gecko used by Firefox and Microsoft's Chakra and Trident. From this testing we found missing components that had to be polyfilled, for example the [fetch](https://fetch.spec.whatwg.org/) API for making http requests. However, by sticking to the most common HTML tags and CSS properties we encountered few issues.  
    * We ensured all CSS properties we used were fully specified with vendor prefixes to ensure compatibility, for example using -webkit and -moz.
 
  
# Operating Overview 
## Running the Site 
     
 * `cd` to the festerr root level folder. 
 * run `npm install` to install the necessary NodeJS packages.
 * run `node server.js`.You should see the output `Festerr app listening at https://0.0.0.0:3000` on the prompt. 
 * Navigate to `https://localhost:3000` and you should see the page. 
 * As we are using HTTPS protocol with a self signed certificate, some browsers may show a dialog warning you when you navigate to the page. Simply click through this to view the site.
 * We have provided a free Spotify account to use for testing. This account has several playlists containing many unique artists, allowing us to see the impact of the Festerr score. The account details are: 
    * username: UOBFesterrTest 
    * password UOBFesterrPassword 
  
## User Guide 
 
 * The main page shows a list of festivals, ranked by Skiddle as most popular to least. We limit this to 20 events, but plan to add pagination or 'infinite scrolling' to show more. 
 
 * Each event is shown with the name, the Festerr score and a thumbnail image of the festival. Hovering over an event shows more detail.
   
 * The toolbar allows users to search for events or artists. These are autosuggested as 'chips' by our search engine, which uses a version of the hamming distance (Levenshtein Distance) to give intelligent suggestions on user input, updated as they type. Events with matching names or artists are then shown.  
   
 * The toolbar contains a button allowing to user to login using an existing Spotify account. This takes them to a Spotify login page, allowing them to securely log in to Spotify servers without Festerr having to store usernames or passwords. When they agree to allow Festerr access to their playlist data, they are taken back to the front page. Festivals are then ranked by our Festerr ranking score (explained above).  
  
 * Selecting an event brings you to the event details page. This page gives much more detail about an event such as when and where the event is happening.    * This page also displays all artists appearing in the event, highlighting those that are found in the user's Spotify collection. 
    * We have included a link that allows users to go to the festival's site to buy tickets. 
    * We also shows a background image for the event which we dynamically add from our google search integration.
    * User's can 'favourite' the event to look at later by clicking the large heart button on the top right of the event card. When favorutied the heart is filled in, otherwise it is outlined. This button is coloured dynamcially with the main colours of the festival (retrieved from the festival header image)     
    * The first time the `/event/` endpoint it called on the server, it will call the Skiddle API and retrieve the necessary event list, and then will cache it so as to reduce unnecessary calls to the external service.

 * The Favorites tab shows a logged in user a list of events they have 'Favourited' in the past. Clicking on one of these cards brings the user to event details page. If the user is not logged in they are instead prompted to log in with Spotify.  

 
 
## Deployed Site on Heroku 
Festerr is also deployed on the Heroku hosting service. This reflects the current state of the master branch of the project. Navigate to https://festerr.herokuapp.com to view the site. 
 
 
 