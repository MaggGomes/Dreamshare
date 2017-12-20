function showGoodsTypeSelect(isFunds) {
	if (isFunds) {
		$('#euroIcon').show();
		$('#goodsTypeSelect').hide();
		$('#goodsType').hide();
		$('#goodsTypeSelect').val('');
	} else {
		$('#euroIcon').hide();
		$('#goodsTypeSelect').show();
	}
}

function otherGoodsType(val) {
	var element = $('#goodsType');
	if (val == 'outro') {
		element.val('');
		element.show();
	} else {
		element.hide();
		element.val(val);
	}
}

var autocomplete;
function initAutocomplete() {
	// Create the autocomplete object, restricting the search to geographical
	// location types.
	autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('searchAddress')),
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

var $profilePicPreview = $('#profile-pic-preview').croppie({
	url: 'http://www.publicdomainpictures.net/pictures/30000/velka/plain-white-background.jpg',
	viewport: {
		width: 600,
		height: 300,
		type: 'square'
	},
	boundary: {
		width: 700,
		height: 400
	},
	enableExif: true
});

function getCropPoints() {
	var cropped = $('#profile-pic-preview').croppie('get');
	var points = cropped.points;

	$('#cropPoints').val(JSON.stringify(points));

	$('#createForm').submit();
}

function readFile(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (event) {
			$profilePicPreview.croppie('bind', {
				url: event.target.result
			});
		};

		reader.readAsDataURL(input.files[0]);
	} else {
		alert('O seu browser não suporta a FileReader API');
	}
}

$('#profile-picture-upload').on('change', function () {
	readFile(this);
});

$(document).ready(function() {
	$('#createForm').on('submit', function(e) {
		e.preventDefault();

		var title = $(this).find('input[name="title"]').val();
		var description = $(this).find('textarea[name="description"]').val();
		var isFunds = $(this).find('input[name="isFunds"]:checked').val();
		var goodsType = $(this).find('input[name="goodsType"]').val();
		var goal = $(this).find('input[name="goal"]').val();
		var endDate = $(this).find('input[name="endDate"]').val();
		var lat = $(this).find('input[name="lat"]').val();
		var lng = $(this).find('input[name="lng"]').val();
		var address = $(this).find('input[name="address"]').val();
		var location = $(this).find('input[name="location"]').val();

		$('#profile-pic-preview').croppie('result', 'base64').then(function (data) {
			$.post('create',
				{title: title, description: description, isFunds: isFunds, goodsType: goodsType, goal: goal, endDate: endDate, lat: lat, lng: lng, address: address, location: location, fileBase64: data},
				function (data, success, xhr) {
					if (xhr.status === 200 && data !== null) {
						window.location.href = data;
					}
				}
			);
		});
	});
});