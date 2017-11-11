$(document).ready(function () {
    getLocations();

    $('#more_campaigns').click(function () {

        existingCampaigns = [];

        $('.id_campaign').each(function () {
            existingCampaigns.push($(this).val());
            //console.log($(this).val());
        });

        $.post("/campaigns/more", {
            existingCampaigns: existingCampaigns,
            nCampaigns : 6
        }, function (result) {
            $.each(result, function(i, campaign){
                var progress_ratio = 100;
                if (campaign.progress<campaign.goal){ progress_ratio = campaign.progress/campaign.goal*100 };
                $('#more_campaigns').parent().before(
                    '<div class="col-lg-4 col-md-4 mb-4 campaign_div">' +
                    '<div class="card">' +
                    '<a class="card-link" href="/campaigns/' + campaign._id + '"></a>' +
                    '<img class="card-img-top campaign_img" src="/' + campaign.image+'" alt="">' +
                    '<div class="card-body">' +
                    '<h4 class="card-title"><a class="title_link" href="/campaigns/' + campaign._id  + '" > ' + campaign.title  + '</a></h4>' +
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
            });
            getLocations();
        });
    });
});

function getLocations(){
    var geocoder = new google.maps.Geocoder;

    /* Percorre cada div com inputs hidden das coordenadas e que ainda não tenham localizacao */
    $('.latlng_campaign:not(:has(p))').each(function () {
        var latlng = {lat: parseFloat($(this).children()[0].value), lng: parseFloat($(this).children()[1].value)};
        var footer = $(this);
        setTimeout(function(){ getLocation(geocoder, latlng, footer) }, Math.floor(Math.random() * 1000));
    });
}

function getLocation(geocoder, latlng, footer){
    geocoder.geocode({'location': latlng}, function(results, status) {
        console.log(latlng);
        if (status === 'OK') {
            if (results[1]) {
                var locality, administrative_area_level_1;
                for (var i = 0; i < results[1].address_components.length; i++) {
                    var addressType = results[1].address_components[i].types[0];
                    if (addressType == "locality") { /* Localidade */
                        locality = results[1].address_components[i].long_name;
                    } else if (addressType == "administrative_area_level_1"){ /* Distrito */
                        administrative_area_level_1 = results[1].address_components[i].short_name;
                    } else if (locality && administrative_area_level_1){ // já foi recolhida a localidade e o distrito
                        break;
                    }
                }
                console.log(results[1]);
                footer.append('<p class="card-text">' + locality + ', ' + administrative_area_level_1+'</p>');
            } else {
                footer.append('<p></p>');
                console.log('No results found');
            }
        } else {
            setTimeout(function(){ getLocation(geocoder, latlng, footer) }, Math.floor(Math.random() * 1000));
            //footer.append('<p></p>');
            console.log('Geocoder failed due to: ' + status);
        }
    });
}



