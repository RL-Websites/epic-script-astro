let map;

async function initMap() {
	const { Map } = await google.maps.importLibrary("maps");

	map = new Map(document.getElementById("map"), {
		center: { lat: 40.676, lng: -74.042 },
		zoom: 11,
		mapTypeControl: true,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.BOTTOM_CENTER,
		},
	});

	var mapStyle = [
		{
			featureType: "administrative",
			elementType: "labels.text.fill",
			stylers: [
				{
					color: "#2D2D2D",
				},
			],
		},
		{
			featureType: "administrative.country",
			elementType: "geometry.stroke",
			stylers: [
				{
					visibility: "on",
				},
				{
					weight: "1.17",
				},
			],
		},
		{
			featureType: "administrative.country",
			elementType: "labels.text",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "administrative.locality",
			elementType: "labels.text",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "landscape",
			elementType: "all",
			stylers: [
				{
					color: "#f2f2f2",
				},
			],
		},
		{
			featureType: "poi",
			elementType: "all",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "poi.park",
			elementType: "geometry.fill",
			stylers: [
				{
					hue: "#2100ff",
				},
				{
					visibility: "on",
				},
			],
		},
		{
			featureType: "road",
			elementType: "all",
			stylers: [
				{
					saturation: -100,
				},
				{
					lightness: 45,
				},
			],
		},
		{
			featureType: "road.highway",
			elementType: "all",
			stylers: [
				{
					visibility: "simplified",
				},
			],
		},
		{
			featureType: "road.arterial",
			elementType: "labels.icon",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "transit",
			elementType: "all",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "water",
			elementType: "all",
			stylers: [
				{
					color: "#FCCC24",
				},
				{
					visibility: "on",
				},
			],
		},
		{
			featureType: "water",
			elementType: "geometry.fill",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#fccc24",
				},
			],
		},
	];

	map.setOptions({ styles: mapStyle });
}
initMap();
