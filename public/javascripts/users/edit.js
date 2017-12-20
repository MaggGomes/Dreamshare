var autocomplete;
function initAutocomplete() {
	// Create the autocomplete object, restricting the search to geographical
	// location types.
	autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('user-location')),
		{types: ['geocode']});

	// When the user selects an address from the dropdown, populate the address
	// fields in the form.
	autocomplete.addListener('place_changed', fillInAddress);


}

function fillInAddress() {
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();
	document.getElementById('lat').value = place.geometry.location.lat();
	document.getElementById('lng').value = place.geometry.location.lng();
	document.getElementById('address').value =  place.formatted_address;

	var locality, administrative_area_level_1;
	for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		if (addressType == 'locality') { // Localidade
			locality = place.address_components[i].long_name;
		} else if (addressType == 'administrative_area_level_1'){ // Distrito
			administrative_area_level_1 = place.address_components[i].short_name;
		} else if (locality && administrative_area_level_1){ // já foi recolhida a localidade e o distrito
			break;
		}
	}
	document.getElementById('location').value =  locality + ', ' + administrative_area_level_1 ;
}