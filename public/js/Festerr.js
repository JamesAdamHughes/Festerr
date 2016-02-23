

var prev_selected = -1;
var width = 596;
var height = 750;

var small_size = 2;
var map_group = new fabric.Group();
var event_group = [];
var events_open_data = [];

var mouse_down_canvas_event;

var events_id_dump = []

var canvas;
var context;

var ROOT_PATH = "../";
var UK_MAP_PATH = ROOT_PATH + "images/UK_MAP_ac_processed.png";
var JSON_DUMP = ROOT_PATH + "json_dump/events_dump_29_5_15.json";
var TEMPLATES = ROOT_PATH + "templates/";


function run(){		
	//set up cavas
	canvas = new fabric.Canvas('canvas', {renderOnAddRemove: false });
	context = canvas.getContext("2d");

	var dot_red = "#F44336";


	canvas.hoverCursor = 'pointer';

	//Load MAP Image
	fabric.Image.fromURL(UK_MAP_PATH, function(oImg){
		
		// var imgInstance = new fabric.Image(oImg, {
		// 	lockMovementY:true,
		// 	lockMovementX:true
		// })
		oImg.lockMovementX = true;
		oImg.lockMovementY = true;
		oImg.hasBorders = false;
		oImg.hasControls = false;

		canvas.add(oImg);
		canvas.sendToBack(oImg);
		canvas.renderAll();

	})


	//retrieve the data from skiddle about festivals
	//plots the festivals on the map
	//builds the events list
	getFestivalJSON("4", "20" , function(festivals){

		// Loop though each festival object and create a circle for each
		// Store that event data in the events list
		// Store the circle into the events_group list for later
		for(var i = 0; i < festivals.length; i++){
			var fest = festivals[i];
			var venue = fest["venue"];
			var event_name = fest["eventname"];
			var event_id = fest["id"];

			//convert lat lon to x y on map
			//MAP SPECIFIC, HARD CODED
			var lat = venue["latitude"];
			var lon = venue["longitude"];			
			var place =  convert(lat, lon, width, height);

			//get event colour
			var color = getHashedColor(event_name);

			var baseSize = 11;
			var size = baseSize + (0.5 * (1 + fest["artists"].length));
			// var size = 8;

			//add festival to the map
			circle = new fabric.Circle({
			  id: event_id,                    //identify the event 
			  type: 'event', 
			  color: color,             //color of circle
			  inital_radius: size,      //inital radius of circle before scaling
			  radius: size, 
			  fill: color, 
			  left: place.xpos - size, 
			  top: place.ypos - size,
			  animating : false,
			  hasBorders:false,
			  hasControls:false,
			  lockMovementY:true,
			  lockMovementX:true
			})

			canvas.add(circle);
			canvas.bringToFront(circle);

			event_group.push(circle);
			events_open_data.push(fest);

			
			//now dsplay all the festivals at the side
			$("#event-list").append("<li class=\"list-group-item\" data-event-id=\"" + event_id + "\" >" + event_name + "</li>");

		}	
		canvas.renderAll();
	});
	
	
	//handle clicks to the map
	canvas.observe('mouse:down', function(e) {
	    activeInstance = canvas.getActiveObject();
	    activeGroupInstance = canvas.getActiveGroup();

	    // Disable any more mose down events while we handle this one
	    // Can do this by simply remvoing this fucntion from the canvas's event listener list lol
	    // We add this back in later
	    canvas.__eventListeners["mouse:down"] = [];

	    if (activeInstance!=null){   

	    	var event_id = e.target.id;	
	    	//check if we clicked on an event or just the map
	    	if(event_id != undefined){
	    		updateSelection(event_id); 
	    	}
	    	else{
	    		updateSelection(-1);
	    	}
	    }

	});


	//get all event data to store and search later
	$.getJSON(JSON_DUMP, function(data){
			event_data = data["results"];
			for(var i = 0; i < event_data.length; i++){
				var e = event_data[i];
				events_id_dump.push({
					"id": e["id"],
					"eventname": e["eventname"]
				});
			}

	});

	//save this event to renable later when disabled for animations
	mouse_down_canvas_event = canvas.__eventListeners["mouse:down"];

}

//Get Festival data from Skiddle API
function getFestivalJSON(RequestType, limit, callback){
	
	$.getJSON(JSON_DUMP, function(data){
		var events = data["results"];
		var return_data = [];

		for(var i = 0; i < 20; i++){
			return_data.push(events[i]);
		}

		callback(return_data);
	})
}	

// Handle an event in the events' list being clicked
// same as if someone had clicked an event on the map
function listClicked(event, item_clicked){
	var event_id = item_clicked.data("event-id");
	updateSelection(event_id);			
}


// Called when an event is selected from the map or the list
function updateSelection(event_id){
	var color_select_pair = updateMapFromClick(event_id, event_group, canvas);
	//check if we selected or deselected an item
	if(color_select_pair["was_prev"] == false){
		//show event details in the sidebar
		showEventDetails(event_id, color_select_pair["color"]);
	}
	else{
		//show the event list again
		showEventList(events_open_data);
	}
	
}

// Searches for events given a search term
// Currently from staticlly servved file
// Called when user enters a term into the search bar and presses enter
function searchForEvent(searchTerm, callback){

		var matching_items = [];
		searchTerm = searchTerm.toLowerCase();

		for(var i = 0; i < events_id_dump.length; i++){
			
			var name = events_id_dump[i];
			name = name["eventname"].toLowerCase();

			if(name.indexOf(searchTerm) >= 0){
				matching_items.push(events_id_dump[i]);
			}
		}

		callback(matching_items);
}

// Show the event details on the side, using mustash templates
// Calls events api to get event details from the server
function showEventDetails(event_id, event_color){

	$.getJSON("/event/?event_id=" + event_id, function(data){

		//put event data into the mustache info template
		$.get(TEMPLATES + 'EventDetail.mst', function(template) {

			//add color the json object
			data["results"].eventcolor = event_color;
			data["results"].eventcolor_light = shadeColor(event_color, 50);
			data["results"].date = prettify_date(data["results"].date);

			if(data["results"].artists.length == 0){
				data["results"].artists = [{"name" : "No artist data available for event"}];
			}
			// console.log(data["results"]);
		    
		    var rendered = Mustache.render(template, data["results"]);

		    $('#info-container').empty();
			$('#info-container').html(rendered);
		});

	});

}

// display the current events in a list
function showEventList(event_list){
	$('#info-container').empty();
	var template_data = {"events" : event_list};

	$.get(TEMPLATES + "EventListItem.mst", function(template) {
		var rendered = Mustache.render(template, template_data);
		$('#info-container').html(rendered);
		$('#event-list').on('click', 'li', function(event){	
				listClicked(event, $(this));
		});
	});
}


// Updates the color of each event on the map given a selected event
// NOTE we disable canvas events during animation to prevent oddities
function updateMapFromClick(event_id, event_group, canvas){
	var color;
	var was_prev = false;
	var next_clicked = -1;
	var map_clicked = false


	//if we select the map, unselect everything
	//setting eventID to prev selected will have this effect
	if(event_id == -1){
		map_clicked = true;
	}

	if(event_id == prev_selected){
		was_prev = true;
	}

	// Find the event we clicked in the events list
	// Animate that bad boy, and hide all the other events
	for(var i = 0; i < event_group.length; i++){
		
		var ev = event_group[i];

		// Map was clicked so we reset eveything to normal
		if(map_clicked){
			ev.setOpacity(1);
			color = "white";
			canvas.bringForward(ev);
			was_prev = true;

			// if this was the event that is was previously selected, bring it down to size
			if(ev.id == prev_selected){
				var delta_size = ev.radius - ev.inital_radius;
				
				ev.animate({
					'radius': ev.inital_radius,
					'top' : ev.top + delta_size,
					'left' : ev.left + delta_size
				}, 
				{
				  onChange:	canvas.renderAll.bind(canvas),
				  duration: 500,
				  easing: fabric.util.ease.easeInQuart,
				  
				  // Add back the mouse down event to the canvas
				  onComplete: function() {
				  	canvas.__eventListeners["mouse:down"] = mouse_down_canvas_event;
				  	console.log("reenabled mouse event");
				  }
				} );

			}
		}		

		// Clicked on an event circle
		else{

			// if this was the one previosuly selected, we reducing (unselecting the event)
			if(was_prev && ev.id == event_id){

				//not currently animating
				ev.setOpacity(1);
				color = "white";
				was_prev = true;				

				var delta_size = ev.radius - ev.inital_radius;
				var static_id = ev.id;
				console.log("static: " + static_id);

				ev.animate({
					'radius': ev.inital_radius,
					'top' : ev.top + delta_size,
					'left' : ev.left + delta_size

				}, 
				{	
				  onChange: canvas.renderAll.bind(canvas),
				  duration: 500,
				  easing: fabric.util.ease.easeInQuart,
				  // Add back the mouse down event to the canvas
				  onComplete: function() {
				  	canvas.__eventListeners["mouse:down"] = mouse_down_canvas_event;
				  	console.log("reenabled mouse event");	
			  	  }
				} );
				
			}

			//previous one was selected, reset the others to normal
			else if(was_prev){
				ev.setOpacity(1);
				color = "white";
			}

			//selected another one, reudce this size
			else if(ev.id == prev_selected){

					ev.setOpacity(0.5);
					var delta_size = ev.radius - ev.inital_radius;					

					ev.animate({
						'radius': ev.inital_radius,
						'top' : ev.top + delta_size,
						'left' : ev.left + delta_size
					}, 
					{	
					  onChange: canvas.renderAll.bind(canvas),
					  duration: 500,
					  easing: fabric.util.ease.easeInQuart,

					  onComplete: function() {
				  		console.log("didn't reanable events");	
				  	  }
					} );

			}
			//selected a new event, inrease it's size
			else if(ev.id == event_id){

				ev.setOpacity(1);
				color = ev.color;
				canvas.bringToFront(ev);
				
				var new_size = 50 + (1/ev.inital_radius);
				var delta_size = new_size - ev.inital_radius;

				ev.animate({
					'radius':new_size,
					'left' : ev.left - delta_size, 
					'top' : ev.top - delta_size
				}, 
				{
				  onChange: canvas.renderAll.bind(canvas),
				  duration: 1000,
				  easing: fabric.util.ease.easeOutQuart,
				  onComplete: function() {
				  		canvas.__eventListeners["mouse:down"] = mouse_down_canvas_event;
				  		console.log("reenabled mouse event");				  	
			  	  }
				} );

				next_clicked = ev.id;
				
			}
			//hide other events not selected		
			else{
				ev.setOpacity(0.5);
			}
			
		}
	}

	//update previous selection
	if(was_prev){
		prev_selected = -1;
	}
	else{
		prev_selected = next_clicked;

	}

	canvas.renderAll();

	return {
		"was_prev" : was_prev,
		"color" : color
	};
}	



/*
	Helper functions to handle colors, and map conversions
*/

//gets the color of an event based on a hash of the string
//ensures events gets the same color each time it's loaded
function getHashedColor(string){

	var colors = [
		"#2196F3", //blue
		"#3F51B5", //indigo
		"#03A9F4", //light blue
		"#FFC107", //amber
		"#FFEB3B", //yellow
		"#CDDC39", //lime
		"#9C27B0", //purple
		"#673AB7", //deep durple  
		"#E91E63", 
		"#F44336", //red
		"#FF9800", //orange
		"#FF5722", //deep orange
		"#4CAF50", //green
		"#009688", //teal
		"#E91E63" //pink
	]

	//get hash code of event name
	var hash = Math.abs(string.hashCode() % colors.length);

	return colors[hash];
}

//Get a nice date from the SKiddle format
function prettify_date(date){

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var split_date = date.split("-");
	var pretty_date = "";
	pretty_date = split_date[2] + " " +  months[split_date[1] - 1];

	return pretty_date;
}


String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function convert(lat, lon, width, height){

	var pi = 3.1415927
	var mapLonLeft = -10.50293;
	var mapLonRight = 2.680664;
	var mapLonDelata = mapLonRight - mapLonLeft;

	var mapLatBottom = 49.410973;
	var mapLatBottomDegree = mapLatBottom * pi / 180;


	var x = (lon - mapLonLeft) * (width / mapLonDelata);
	x = x - 5;

	lat = lat * pi / 180;
	var mapWidth = ((width / mapLonDelata) * 360) / (2 * pi);
	var mapOffsetY = (mapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
	var y = height - ((mapWidth / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mapOffsetY)

	y = y - 5;

	return {
		xpos:x,
		ypos:y
	};
}


//converts RGB to HSV values 
function rgb2hsv () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}
