var map;
var autocomplete;
var geocoder;
var zoom = 14;
var limits;
var markers = [];

// Google Maps handling functions
function initGoogleMaps() {
	var center = {lat: parseFloat($('#lat').val()), lng: parseFloat($('#lng').val())};
	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: zoom
	});

	// Create the autocomplete object, restricting the search to geographical
	// location types.
	autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('location')),
		{types: ['geocode']});

	geocoder = new google.maps.Geocoder();
	// When the user selects an address from the dropdown, populate the address
	// fields in the form.
	autocomplete.addListener('place_changed', function () {
		// Get the place details from the autocomplete object.
		var place = autocomplete.getPlace();
		map.setCenter({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
	});

	/*map.addListener('center_changed', function() {
		updateLimits();
		console.log(limits);
		updateCampaigns();
	});
	map.addListener('zoom_changed', function() {
		updateLimits();
		console.log(limits);
		updateCampaigns();
	});*/
	map.addListener('bounds_changed', function () {
		updateLimits();
		console.log(limits);
		updateCampaigns();
	});
}

$(document).ready(function () {
	$('#locationBtn').click(function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(changeMapCenter, browserGeolocationFail);
		}
	});

	$('#searchBtn').click(function () {
		var address_input = autocomplete.getPlace();
		
		if (address_input != '') {
			geocoder.geocode({'address': address_input}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					// Center map on location
					map.setCenter(results[0].geometry.location);
				} else {
					console.log('Geocode was not successful for the following reason: ' + status);
				}
			});
		}
	});

});

function changeMapCenter(position) {
	map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
}

function updateLimits() {
	limits = {
		lat_left: map.getBounds().getNorthEast().lat(),
		lat_right: map.getBounds().getSouthWest().lat(),
		lng_up: map.getBounds().getNorthEast().lng(),
		lng_down: map.getBounds().getSouthWest().lng()
	};
}

function changeMapZoom(newZoom) {
	zoom = newZoom;
	map.setZoom(parseInt(zoom));
}

function updateCampaigns() {
	$.post('/campaigns/insideCoords', {
		lat_left: limits.lat_left,
		lat_right: limits.lat_right,
		lng_up: limits.lng_up,
		lng_down: limits.lng_down
	}, function (data) {
		while (markers.length > 0) {
			var m = markers.pop();
			m.setMap(null);
		}

		console.log(data);
		$.each(data, function (i, campaign) {
			var marker = new google.maps.Marker({
				position: {lat: campaign.lat, lng: campaign.lng},
				map: map,
				_id: campaign._id,
				title: campaign.title,
				goal: campaign.goal,
				progress: campaign.progress,
				location: campaign.location,
				image: campaign.image,
				description: campaign.description,
				lat: campaign.lat,
				lng: campaign.lng
			});
			marker.addListener('click', popupCampaign);
			markers.push(marker);
		});
		console.log(data);
	});
}

function popupCampaign() {
	$('#campaignsModal').modal('show');
	$('#campaignsModal .modal-body .row').html('');
	var lat = this.position.lat();
	var lng = this.position.lng();
	$.each(markers, function (i, campaign) {
		if (campaign.position.lat() == lat && campaign.position.lng() == lng) {
			$('#campaignsModal .modal-body .row').append(getCampaignCard(campaign));
		}
	});
}

// util function in case browser getLocation fail
var browserGeolocationFail = function (error) {
	if (error.code == error.PERMISSION_DENIED) {
		if (error.message.indexOf('Only secure origins are allowed') == 0) {
			jQuery.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAYD9E2TQzUSIST7qw8ns3quQ2Ry-BDuh4', function (success) {
				map.setCenter({lat: success.location.lat, lng: success.location.lng});
				updateLimits();
			});
		}
	}
};