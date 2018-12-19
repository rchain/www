$(document).ready(function () {
    initMap();
});


//Initialize our Google Map
function initMap() {
    // Styles a map in night mode.
    var venue = {
        lat: 52.520431,
        lng: 13.416334
    };
    var center = {
        lat: 52.530431,
        lng: 13.416334
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 13,
        styles: [{
                elementType: 'geometry',
                stylers: [{
                    color: '#242f3e'
                            }]
                        },
            {
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#242f3e'
                            }]
                        },
            {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#746855'
                            }]
                        },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#CC1E46'
                            }]
                        },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{
                    color: '#263c3f'
                            }]
                        },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#6b9a76'
                            }]
                        },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                    color: '#000000'
                            }]
                        },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#000000'
                            }]
                        },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#c5c7c9'
                            }]
                        },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{
                    color: '#000000'
                            }]
                        },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#000000'
                            }]
                        },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#c5c7c9'
                            }]
                        },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{
                    color: '#000000'
                            }]
                        },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#ffffff'
                            }]
                        },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                    color: '#17263c'
                            }]
                        },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#515c6d'
                            }]
                        },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#17263c'
                            }]
                        }
                    ]
    });
    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h3 id="firstHeading" class="firstHeading">bcc Berlin Congress Center GmbH</h3>' +
        '<div id="bodyContent">' +
        '<p>Alexanderstr. 11 <br>' +
        '10178 Berlin<br></p>' +
        '<a href="https://www.google.com/maps/place/bcc+Berlin+Congress+Center+GmbH/@52.520431,13.416334,15z/data=!4m5!3m4!1s0x0:0xd2a15220241f2080!8m2!3d52.520431!4d13.416334" target="_blank">' +
        'View on Google Maps</a> ' +
        '</div>' +
        '</div>';
    var venueImage = 'assets/red-marker.png';
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 250
    });
    var marker = new google.maps.Marker({
        position: venue,
        map: map,
        title: 'bcc Berlin Congress Center GmbH',
        icon: venueImage,
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
}

