const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

const start = async (PORT) => {
    process.env.BASE_URL = process.argv.base_url || `http://localhost:${PORT}`
    
    app.use(cors());
    app.use((err, req, res, next) => res.status(400).json({ "name": err.name, "code": err.code, "msg": err.message }))

    const distPath = path.join(__dirname, '../dist'); 

    app.use('/dist',express.static(distPath))
    //app.use(function(req, res, next) {console.log(req.protocol + '://' + req.get('host') + req.originalUrl); next();});

    app.get('/', (req, res) => {
        res.header('Content-Type', 'text/html');
        res.send(`
        <html>
        <head>
            <title>tileCache viewer</title>
            <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
            <script src="/dist/mapbox-gl.js"></script>
            <link href="/dist/mapbox-gl.css" rel="stylesheet"></link>
        
            <style>
                body {
                    margin: 0;
                    padding: 0;
                }
        
                #map {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 100%;
                }               
            </style>
        </head>
        
        <body>
            <div id="map"></div>
            <script>
                var map = new mapboxgl.Map({
                    container: 'map',
                    style: {"version":8,"name":"Blank","center":[0,0],"zoom":3,"sources":{},"layers":[{"id":"background","type":"background","paint":{"background-color":"rgba(255,255,255,1)"}}],"id":"blank"},
                });
                map.addControl(new mapboxgl.NavigationControl());
                map.addControl(new mapboxgl.GeolocateControl({
                    positionOptions: {
                    enableHighAccuracy: true
                    },
                    trackUserLocation: true
                    }));
                map.addControl(new mapboxgl.ScaleControl());
                map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));

                map.on('load', () => {
                    map.addSource('tileSource', {
                                'type': 'raster',
                                'tileSize': 256,
                                'tiles': ['${process.env.BASE_URL}/tiles/{z}/{x}/{y}']
                            })
        
                    map.addLayer({
                            'id': 'tiles',
                            'type': 'raster',
                            'source': 'tileSource'
                        }, ''
                    );
                    map.showTileBoundaries = true
                })
        
        
        
            </script>
        
        </body>
        
        </html>
        `);
    })

    app.use('/tiles', require('./tiles'));
    app.use('/WMTS', require('./wmts'));

    app.listen(PORT, () => {
        console.log(`Webserver running on port ${PORT}`)
        console.log(`Viewer: ${process.env.BASE_URL}`)
        console.log(`Tiles: ${process.env.BASE_URL}/tiles/{z}/{x}/{y}`)
        console.log(`WMTS:  ${process.env.BASE_URL}/WMTS?request=getCapabilities`)
        console.log(`Press ctrl+c to termitate webserver..`)

        if (process.argv.open) {
            const startCmd = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
            require('child_process').exec(startCmd + ' ' + process.env.BASE_URL);
        }
    });
}

module.exports = start;