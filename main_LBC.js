// Définition de la configuration de la carte
var defaultZoom = 10;
var mapCenter = [0, 43.5]; // Coordonnées en longitude/latitude

var extent = ol.proj.transformExtent(
    [-1.25, 43, 0.9, 43.9], // Coordonnées en EPSG:4326 (lon/lat)
    'EPSG:4326', 
    'EPSG:3857' // Transformation vers la projection utilisée
);

let tileDimension = 20;
let projection = ol.proj.get('EPSG:3857');
let projectionExtent = projection.getExtent();
let size = ol.extent.getWidth(projectionExtent) / tileDimension;
let resolutions = [
    152.8740565703525, 76.43702828517625, 38.21851414258813,
    19.109257071294063, 9.554628535647032,
    4.777314267823516, 2.388657133911758, 1.194328566955879
];
let matrixIds = [];
for (let z = 10; z <= 17; z++) {
    matrixIds.push(z);
}

var map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine()
    ]),
    layers: [
        new ol.layer.Tile({
            preload: Infinity,
            source: new ol.source.WMTS({
                url: 'http://lostinzoom.huma-num.fr/geoserver/la_bonne_carte/gwc/service/wmts',
                layer: 'la_bonne_carte:LBC_agregation',
                matrixSet: 'WebMercatorQuad',
                format: 'image/png',
                dimensions: [tileDimension, tileDimension],
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds,
                }),
                wrapX: true,
            })
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat(mapCenter),
        zoom: defaultZoom,
        minZoom: 10,
        maxZoom: 18,
        // extent: extent // Limitation du pan
    }),
});

var zoomDiv = document.getElementById('zoom');
zoomDiv.innerHTML = 'Zoom : ' + defaultZoom;

map.on('moveend', function () {
    var currentZoom = map.getView().getZoom();
    zoomDiv.innerHTML = 'Zoom : ' + currentZoom.toFixed(2);
});
