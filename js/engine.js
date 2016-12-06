
var currentMarker = null;
var map;
var markersarray = []; 

var Location = function(data){
	var self = this;
	this.title = data.title;
	this.location = data.location;
	this.address = data.address;
	this.boolTest = ko.observable(true);
};	
	
var viewModel = function(){
	var self = this;
    self.query = ko.observable('');
	self.filteredlocations = ko.observableArray([]);
	self.places = ko.observableArray(locations);
	
	for(i=0;i<locations.length;i++){
		var places = new Location(locations[i]);
		self.filteredlocations.push(places);
	}
	
	self.filteringfunction = ko.computed(function() {
		var search = self.query();
		for (var i = 0; i < self.filteredlocations().length; i++) {
				if (self.filteredlocations()[i].title.toLowerCase().indexOf(search) >= 0) {
					self.filteredlocations()[i].boolTest(true);
					if (self.filteredlocations()[i].marker) {
						self.filteredlocations()[i].marker.setVisible(true);
					}
				} else {
					self.filteredlocations()[i].boolTest(false);
					if (self.filteredlocations()[i].marker) {
						self.filteredlocations()[i].marker.setVisible(false);
					}
				}
		};
	});	
		
	self.showmarker = function(locations) {
		google.maps.event.trigger(locations.marker,'click');  
	}	
};

var locations = [
          {
          title: "Empire State Building", 
          location: {lat:40.74844, lng: -73.985655}, 
          address: "350 5th Ave, New York, NY 10118, USA", 
    		  id:"nav1"
          },
          {
          title: "Times Square", 
          location: {lat:40.760262, lng: -73.993287}, 
          address: "Manhattan, NY 10036", 
		      id:"nav2"
          },
          {
          title: "National Museum of Mathematics", 
          location: {lat:40.743445, lng: -73.987228}, 
          address: "11 E 26th St, New York, NY 10010, USA", 
    		  id:"nav3"
          },
	      {
          title: "Madame Tussauds New York", 
          location: {lat: 40.756359, lng: -73.988873}, 
          address: "234 W 42nd St, New York, NY 10036, USA", 
    		  id:"nav4"
          },
          {
          title: "Rockefeller Center", 
          location: {lat:  40.759088, lng: -73.977599 }, 
          address: "45 Rockefeller Plaza, New York, NY 10111, USA", 
          id:"nav5"
          }
];

function openNav() {
    document.getElementById("search-nav").style.width = "200px";
    document.getElementById("wikipedia-container").style.width = "200px";}
function closeNav() {
    document.getElementById("search-nav").style.width = "0";} 

function closewiki() {
    document.getElementById("wikipedia-container").style.width = "0";}
/*function openNav() {
    document.getElementById("wikipedia-container").style.width = "200px";}*/

function initMap() {
        // Create a styles array to use with the map.
          var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map-canvas'), {
          center: {lat:  40.756643, lng: -73.983773},
          zoom: 14,
          mapTypeControl: false,
          styles: styles,
        }); 

        function resetMap() {
			  var windowWidth = $(window).width();
			  if(windowWidth <= 1080) {
				map.setZoom(13);
				map.setCenter(map.center);
				closeNav();
				closewiki();
			  } else if(windowWidth > 1080) {
				map.setZoom(14);
				map.setCenter(map.center); 
				openNav();  
				//openwiki();
			  }
        }
      $(window).resize(function() {
      resetMap();
      }); 

        var defaultIcon = makeMarkerIcon('0091ff');
		
        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('FFFF24');
		
		var streeturl = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=";
        var imageview;
		
		function getImage(){

         imageview = streeturl + vm.filteredlocations()[i].location.lat + ',' + vm.filteredlocations()[i].location.lng + '&heading=235&pitch=-0.76&key=AIzaSyCTv8rIJkV5WxGD8e4id3h75uR8VvltRhM';
        }

        for (var i = 0; i < vm.filteredlocations().length; i++) {
          // Get the position from the location array.
          var position = vm.filteredlocations()[i].location;
          var title = vm.filteredlocations()[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
          });
		  vm.filteredlocations()[i].marker = marker;
          markersarray[i]=marker;
         
		  marker.addListener('mouseover', function() {
				this.setIcon(highlightedIcon);
			  });
		  marker.addListener('mouseout', function() {
				this.setIcon(defaultIcon);
			  });
		  
		  getImage();
		  var articleStr;
		  var url = "";
		  var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + vm.filteredlocations()[i].title + '&limit=1&namespace=0&format=json&callback=wikiCallback';
          $.ajax({
					type: "GET",
					url: wikiUrl,
					dataType: "jsonp"
				  })
                    .done(function(response){
                      var articleList = response[1];
                      
                      for(var i=0;i < articleList.length; i++){
                        articleStr = articleList[i];
                        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                      };
                    }).fail(function() {
						alert( "Loading error. Please try again." );
					}) 
		  
		  vm.filteredlocations()[i].windowcontent = '<img src="' + imageview + '"alt="image of' + vm.filteredlocations()[i].title + '" width="190" height="90"><br><hr style="margin-bottom: 5px"><strong>' +
		                               vm.filteredlocations()[i].title + '<br></strong>'+
										'<p>'+ vm.filteredlocations()[i].address+ '</p>'+ '<p><strong> WikiInfo - ' + 
										'<a href="' + url + '">'+ vm.filteredlocations()[i].title + '</a></strong></p>';

			  var largeInfowindow = new google.maps.InfoWindow({
				  content : vm.filteredlocations()[i].windowcontent   
			  });

		    marker.addListener('click', (function(marker, i) {
				return function() {
				  if (currentMarker) currentMarker.setAnimation(null);
				  currentMarker = marker;
				  marker.setAnimation(google.maps.Animation.BOUNCE);
				  largeInfowindow.setContent(vm.filteredlocations()[i].windowcontent);
				  largeInfowindow.open(map, marker);
				  google.maps.event.addListener(largeInfowindow, 'closeclick', function() {
						   marker.setAnimation(null);
				  });
				}; 
            })(marker, i));
			//onload(i);
	}
}	
	
function maperror(){
	alert("Google Maps was not loaded properly");
};
        
function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage("http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|"+ markerColor +
          "|40|_|%E2%80%A2",
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
}
	
var vm = new viewModel();
ko.applyBindings(vm);	

/*function onload(i){
                /*var $wikiElem = $('#wikipedia-links');
                var wikisetTimeout = setTimeout(function(){
                    alert("FAILED TO GET WIKI RESOURCES");
                  },8000);

                var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + vm.filteredlocations()[i].title + '&limit=1&namespace=0&format=json&callback=wikiCallback';
                  $.ajax({
                    url: wikiUrl,
                    dataType : "jsonp",
                    success: function(response){
                      var articleList = response[1];
                      
                      for(var i=0;i < articleList.length; i++){
                        articleStr = articleList[i];
                        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                        $wikiElem.append('<li><strong><a href="' + url + '">'+
                                           articleStr + '</a></strong></li>');
                      };
                      clearTimeout(wikisetTimeout);
                    }
                  }); 

                  return false;
} */                