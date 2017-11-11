var map;
var autocomplete;
var geocoder;
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

    geocoder = new google.maps.Geocoder();
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', function(){
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
    map.addListener('bounds_changed', function() {
        updateLimits();
        console.log(limits);
        updateCampaigns();
    });
}

$(document).ready(function() {
    $('#locationBtn').click(function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(changeMapCenter, browserGeolocationFail);
        }
    });

    $('#searchBtn').click(function(){
        var address_input = autocomplete.getPlace();
        console.log(address_input);

        if(address_input != ""){
            geocoder.geocode({'address': address_input}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // Center map on location
                    map.setCenter(results[0].geometry.location);
                } else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        }
    });

});

function changeMapCenter(position) {
    map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
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
}

function updateCampaigns() {
    $.post("/campaigns/insideCoords", {
        lat_left: limits.lat_left,
        lat_right: limits.lat_right,
        lng_up: limits.lng_up,
        lng_down: limits.lng_down
    }, function (data) {
        while(markers.length > 0) {
            var m = markers.pop();
            m.setMap(null);
        }
        $.each(data, function(i, campaign) {
            var marker = new google.maps.Marker({
                position: {lat: campaign.lat, lng: campaign.lng},
                map: map,
                id: campaign._id,
                title: campaign.title,
                goal: campaign.goal,
                progress: campaign.progress,
                image: campaign.image
            });
            marker.addListener('click', popupCampaign);
            markers.push(marker);
        });
        console.log(data);
    });
}

function popupCampaign(){
    $('#campaignsModal').modal('show');
    $('#campaignsModal .modal-body .row').html('');
    var lat = this.position.lat();
    var lng = this.position.lng();
    $.each(markers, function(i, campaign) {
        if(campaign.position.lat() == lat && campaign.position.lng() == lng) {
            var progress_ratio = 100;
            if (campaign.progress<campaign.goal){ progress_ratio = campaign.progress/campaign.goal*100 };
            $('#campaignsModal .modal-body .row').append(
                '<div class="col-lg-4 col-md-4 mb-4 campaign_div">' +
                '<div class="card">' +
                '<a class="card-link" href="/campaigns/' + campaign.id + '"></a>' +
                '<img class="card-img-top campaign_img" src="/' + campaign.image+'" alt="">' +
                '<div class="card-body">' +
                '<h4 class="card-title"><a class="title_link" href="/campaigns/' + campaign.id  + '" > ' + campaign.title  + '</a></h4>' +
                '<p class="card-text">' + campaign.description + '</p>' +
                '</div>' +
                '<div class="card-footer">' +
                '<div class="card-progress progress">' +
                '<div class="progress-bar" role="progressbar" aria-valuenow="' +  campaign.progress  + '" ' +
                'aria-valuemin="0" aria-valuemax=" ' + campaign.goal + '" style="width:' + progress_ratio +'%">' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<span class="card-footer-">' + parseInt(progress_ratio) + '%</span> concluído' +
                '</div>' +
                '<div class="campaign-location">' +
                '<span><i class="fa fa-map-marker" aria-hidden="true"></i></span> <div class="latlng_campaign">' +
                '<input type="hidden" value="' + campaign.lat + '">' +
                '<input type="hidden" value="' + campaign.lng + '">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<input type="hidden" class="id_campaign" value="'+ campaign._id +'">' +
                '</div>'
            );
            /*alert(marker.id + "\n" + marker.title + "\n" + marker.progress + "/" + marker.goal + "\n" + marker.image + "\n" + marker.position
                + "\n" + marker.position.lat()+ "\n" +this.position.lat()+ "\n" + marker.position.lng()+ "\n" + this.position.lng());*/
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