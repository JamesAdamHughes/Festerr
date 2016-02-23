# Festerr
Visualising music festivals across the UK

## Operating Overview
* Fester uses a nodeJS server to serve the html/css/js files to the client. The Express framework is used to handle serving the user when the go to the base url, but apart from that the server is very small. 

* The site is a single html page 'festivalMap' and a .js file 'Festerr.js' to handle all the user input on the page

* All Events info is gathered from [Skiddle](http://www.skiddle.com), a festival and events finder website. We will use the [API](http://www.skiddle.com/api/) to get data about events happening in the UK.

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

