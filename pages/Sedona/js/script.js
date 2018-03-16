function initialize() {
    var x = 34.8655061;
    var y = -111.8029705;
    var mapOptions = {
        zoom: 17,
        center: new google.maps.LatLng(x, y),
        scrollwheel: false,
		disableDefaultUI: true
    }
    var map = new  google.maps.Map(
        document.querySelector(".map-script"),
        mapOptions
    );
    var myLatLng = new google.maps.LatLng(x, y);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map
    });
}
google.maps.event.addDomListener(window, "load", initialize);