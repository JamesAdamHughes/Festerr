
Louis Ditzel ld13280, James Hughes jh13293 
 
We would like this project to be marked as ongoing work on both the client and server.   
 
# Festerr 
Festerr is a music festival discovery platform that combines data from multiple 3rd party API's (Skiddle and Spotify) to provide users with a personalised event calendar.  
 
An event is ranked by our Festerr score: the number of artists playing at the event that are also in the user's Spotify library. The more artists, the higher the rank. This score will also be calculated using how soon an event is occurring and how many other people have it 'favourited'. 
 
Users are also able to search for upcoming events and artists that they are interested in. 
 
# Technologies 
## Stack 
 * Fester uses a nodes server to serve the html/css/js files to the client. The [ExpressJS](http://expressjs.com/) framework is used for route handling, serving the user the main app when they go to the base url. Other endpoints are used to provide a REST API service for the client to access data. For example, the `/spotify/artists/` endpoint provides the client with all of a user's Spotify artists.  
     
 * [AngularJS](https://angularjs.org/) is a popular frontend framework developed by Google, which we have used to aide in the creation of our Single Page App (SPA). Angular provides an implementation of the Model, View, Controller (MVC) pattern. A declarative user interface allows two-way bindings to be added to HTML templates, allowing data on the page to be updated in real time when background models are changed. The app is built with reusable components (services, directives, factories) which are injected into the required views. This allows the separation of display/render logic (such as DOM manipulations) from the main logic (network requests, behind-the-scenes logic), which promotes DRY code, more so than with standard JavaScript. Finally, Angular comes with a powerful testing framework, Protractor, that provides unit and integration testing for the entire front end. 
  
 * We use vanilla CSS3 to provide styling to components. However, Angular also allows styles and classes to be applied dynamically, which results in some raw CSS on some components.   
  
 * Festerr has a unique logo and favicon, created using GIMP and saved as .pngs and .ico files. Button icons use the .svg format to allow for rescaling.   
  
 * [Angular Material](https://material.angularjs.org/latest/) is a CSS library that provides pre-built HTML components that as a 'reference implementation of Google's Material Design Specification.' These components are reusable and tested, and also integrate well with the AngularJS framework we are already using.  
  
 * The app gathers the necessary data by hitting endpoints defined in the server. The client and server are designed to be stateless, to follow REST guidelines, and use access tokens to authorize user sessions. 
     
## APIs 
 * All Events info is gathered from [Skiddle](http://www.skiddle.com), a Festival and Events finder website. We use the [API](http://www.skiddle.com/api/) to access this data about events happening in the UK. Other event APIs exist, such as SongKick. However, Skiddle proved the least restrictive: allowing us to search for any events in a given time frame. Skiddle also provides basic artist data, which we cross-reference with Spotify data to provide a tailored front page for every user. 
     
 * [Spotify](https://www.spotify.com/uk/) is one of the largest music streaming services in the UK, offering both free and premium tiers. People interested in festivals and music events are likely to have Spotify accounts containing self-curated playlists full of their favourite music. Spotify provides an [API](https://developer.spotify.com/web-api/) to access this data allowing us to enrich our platform by personalising it to a user's music taste. 
 
## Challenges 
 * The first important hurdle to cross was the workflow implementation. When multiple people are working on a project with as many parts as this, it can be easy to lose track of what another person is doing. Both members of the team are well-versed in the use of git to manage a project and so the project was integrated into version control before any code was written. GitHub was used to host the repository and keep track of issues, pull requests and code reviews. We used another service, [Waffle.io](https://waffle.io/) (which integrates heavily with GitHub) to organise our tasks, by separating them into 'Backlog', 'In Progress', 'In Review' and 'Done' lists. This eased development headaches dramatically as it clearly structures the work we had done and the work that remains to be done. 
 
 * Modern websites should be designed to be viewable and usable on many different screen sizes, be they desktop, tablet or phone. This can be done by using separate desktop and mobile templates and serving the appropriate one, or using one, responsive, template, that dynamically fits to any screen size. As mobile use of the web is growing, so too is it important for a site to be responsive.  
    * To achive this, we designed the site mobile first, mocking up UI ideas in GIMP (which can be seen in the /dumpFiles folder) until we settled on a design which worked well on both small and large screens. We split the interface into 'modules' of separate content, which can be reordered or flowed on the screen using CSS media queries to define screen size breakpoints. The CSS property 'flex' allows items to grow and shrink in size to fit its container. Flex also allows for the ordering, spacing and wrapping of items in space using simple properties, which provide a simple but powerful tool for building responsive designs. For example, the main festival tile grid wraps to smaller sizes, showing 4 elements per row on large screens, 2 on smaller and finally a single column on phone screens. This keeps all the functionality the same but better usability on small devices. 
    * We plan to add further responsive design elements, such as increasing font sizes on smaller screens. 
 
 * To ensure cross browser compatibility we regularly tested the site on a range of browsers using several different rendering and JavaScript engines, including WebKit based Chrome and Safari, Gecko used by Firefox and Microsoft's Chakra and Trident. From this testing we found missing components that had to be polyfilled, for example the fetch API for making http requests. However, by sticking to the most common HTML tags and CSS properties we encountered few issues.  
 
 * Async Design 
Separation of concerns (both in client and server) 
 
 * keeping access codes secret 
  
 * Ongoing work is being done to integrate images taken from the Google Search API to provide more images for each event. Google has a restriction on it's API that prevents it from being called more than 100 times in any given day. This throttling proved to be somewhat crippling as for one page load, 20 separate calls had to be made (one for each event shown). In order to overcome this, and similar issues plaguing other APIs, we implemented a data caching scheme, which would simply call each API once when the relevant page is first loaded on the server. This not only alleviated those problems, but reduced our reliance on the stability of these external services whilst our platform is running. 
 
 * The search bar at the top of the site has been a major area of development during this first phase. Initially an input field that would filter the event list based on name alone, the search box was not complex. However we quickly realised that it would need to be a lot smarter in order to be of any real use.  
    * Using ['Chips'](https://www.google.com/design/spec/components/chips.html), we were able to come up with a system that was both smart and robust. When a user starts typing, a list of possible matches to their query appears beneath the searchbox as possible suggestions. When the one they want is found, they can select it and then start a new search, chaining the searches together to narrow down their selection.  
    * Several issues were encountered during this. First was the time it took to calculate the autocomplete suggestions meant that the user could experience some stutter whilst typing, as the client was attempting to do too much at once. By adding a check to pause the search (while showing a loading icon) if the user was typing over a certain speed, this stuttering was reduced. By then making the search asynchronous, the stuttering was eliminated completely. The second issue was one of ordering. The order that autocomplete results were being shown were simply the order they had been placed into the event & artist arrays. 
    * We wanted this to be smarter and show the most likely suggestion at the top. [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) allowed us to do exactly that. By computing the distance between all event and artist names and the current search query, we were able to sort the list from smallest to largest, giving a much tighter ordering. 
 
lichenstein search (and search in general) 
 
spotify auth flow 
animations 
 * deploying in the wild with heroku 
 
# Operating Overview 
## Running the Site 
     
 * `cd` to the festerr root level folder. 
 * run `node server.js`.You should see the output `Festerr app listening at http://0.0.0.0:3000` on the prompt. 
 * Navigate to `localhost:3000` and you should see the page. 
 * We have provided a free Spotify account to use for testing. This account has several playlists containing many unique artists, allowing us to see the impact of the Festerr score. The account details are: 
    * username: UOBFesterrTest 
    * password UOBFesterrPassword 
  
## User Guide 
 
 * The main page shows a list of festivals, ranked by Skiddle as most popular to least. We limit this to 20 events, but plan to add pagination or 'infinite scrolling' to show more. 
 
 * The first time the `/event/` endpoint it called on the server, it will call the Skiddle API and retrieve the necessary event list, and then will cache it so as to reduce unnecessary calls to the external service. 
  
 * The toolbar allows users to search for events or artists. These are autosuggested as 'chips' by our search engine, which uses a version of the hamming distance (Levenshtein Distance) to give intelligent suggestions on user input, updated as they type. Events with matching names or artists are then shown. 
  
 * Selecting an event expands its card to show more details, such as when and where the event is happening. It also displays all artists appearing in the event, highlighting those that are found in the user's Spotify collection. We plan to show a Google Maps location on this card as well. 
  
 * The toolbar contains a button allowing to user to login using an existing Spotify account. This takes them to a Spotify login page, allowing them to securely log in to Spotify servers without Festerr having to store usernames or passwords. When they agree to allow Festerr access to their playlist data, they are taken back to the front page. Festivals are then ranked by our Festerr ranking score (explained above).  
 
 
## Deployed Site on Heroku 
Festerr is also deployed on the Heroku hosting service. This reflects the current state of the master branch of the project. Navigate to https://festerr.herokuapp.com to view the site. 
 
 
# Next Stages 
 
 * Currently, when events are retrieved from Skiddle, they are stored in an object, which is then passed around the application. Although this works for now, it is not scalable, and work is underway to migrate this into an SQLite driven database.  
 
 * This database can (and will) be also used to persist users across sessions and allow them to change preferences. This will also give us the ability to tie new features to a user's account: for example, the ability to favourite a specific artist or event, so they can build their own calendar. 
 
 * The opportunity for better caching of data exists throughout the app; the Spotify API is called every time the page is refreshed, which is a needless waste of resources. Again, this is something which can be remedied with the use of a database and is something which is being actively worked on. 
 
 * There are currently three non-functional tabs across the header of the page. These will soon be put to good use providing different navigational areas of the site. The first will remain as the list present today; the second will display a list of a user's top artists; the third tab will then show a list of a user's favourited items - event or artist. The design and implementation of these have yet to be worked out, but are a crucial next step. 
 
 * In order to provide a great user experience, and really show them events that they could find interesting, we plan to update how we calculate our Festerr Score. The current single-factor implementation is ripe for upgrading and we are looking into ways of combining all the information available to us through the use of APIs and the aforementioned favouriting to rank artists and events in the best way possible. 
 
