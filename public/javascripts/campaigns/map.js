var map;
var autocomplete;
var zoom = 14;
var limits;
var markers = [];

// Google Maps handling functions
function initGoogleMaps() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.157944, lng: -8.629105},
        zoom: zoom
    });

    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('location')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', function(){
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
        map.setCenter({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
        updateLimits();
    });
}

$(document).ready(function() {
    $('#locationBtn').click(function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(changeMapCenter, browserGeolocationFail);
        }
    });

});

function changeMapCenter(position) {
    map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
    updateLimits();
}

function updateLimits(){
    limits = {
        lat_left: map.getBounds().getNorthEast().lat(),
        lat_right: map.getBounds().getSouthWest().lat(),
        lng_up: map.getBounds().getNorthEast().lng(),
        lng_down: map.getBounds().getSouthWest().lng()
    }
}

function changeMapZoom(newZoom)
{
    zoom = newZoom;
    map.setZoom(parseInt(zoom));

    updateLimits();
    console.log(limits);

    updateCampaigns();
}

function updateCampaigns() {
    $.post("/campaigns/insideCoords", {
        lat_left: limits.lat_left,
        lat_right: limits.lat_right,
        lng_up: limits.lng_up,
        lng_down: limits.lng_down
    }, function (data) {
        $.each(data, function(i, campaign) {
            var marker = new google.maps.Marker({
                position: {lat: campaign.lat, lng: campaign.lng},
                map: map,
                id: campaign._id,
                title: campaign.title,
                goal: campaign.goal,
                progress: campaign.progress,
                image: campaign.image,

            });
            marker.addListener('click', popupCampaign);
            markers.push(marker);
        });
        console.log(data);
    });
}

function popupCampaign(){
    $.each(markers, function(i, marker) {
        if(JSON.stringify(marker.position) === JSON.stringify(this.position) ) {
            alert(marker.id + "\n" + marker.title + "\n" + marker.progress + "/" + marker.goal + "\n" + marker.image);
        }
    });
}

// util function in case browser getLocation fail
var browserGeolocationFail = function(error) {
    if(error.code == error.PERMISSION_DENIED) {
        if (error.message.indexOf("Only secure origins are allowed") == 0) {
            jQuery.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAYD9E2TQzUSIST7qw8ns3quQ2Ry-BDuh4", function(success) {
                map.setCenter({lat: success.location.lat, lng: success.location.lng});
                updateLimits();
            })
        }
    }
};