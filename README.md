# TileCache - Utility
A nodejs utility to work with ESRI tilecache formats.

<ins>ESRI docs:</ins>
https://github.com/Esri/raster-tiles-compactcache
https://github.com/Esri/tile-package-spec


https://github.com/mapbox/mbtiles-spec

_Note:_ Only supports projections and tilingschemes that follows Web Mercator(Google/Bing/etc) ([EPSG:3857](https://epsg.io/3857))  (Google/Bing/etc).

## Goals
-   Convertion of ESRI tileCache formats.
-   Serve tiles from ESRI tileCache.
-   View content of ESRI tileCache.


## Installation
Grap latest release. No installation needed just run the exe file.
_Note:_ better-sql.NODE only need when working with mbtiles.

## Usage

### Command line interface

```
tilecache-utility.exe --help

Commands:
  tilecache-utility.exe export <-i input> <-o output> [OPTIONS]     export tilecache content to output
  tilecache-utility.exe serve <-i dir> [OPTIONS]                    publish tilecache as a webservice

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

```
tilecache-utility.exe export --help

Usage: tilecache-utility.exe export -i dir -o file

Options:
  -i, --input    path to input data                              [default: "./"]
  -o, --output   where to put the data               [default: "export.mbtiles"]
  -z, --maxZoom  set maxzoom to be exportet    [number] [required] [default: 25]

Examples:
  tilecache-utility.exe export --input=./Map --output=tavg_01.mbtiles
```

```
tilecache-utility.exe serve --help

Usage: tilecache-utility.exe serve -i dir -p port

Options:
  -i, --input  path to input data                                [default: "./"]
  -p, --port   port to bind on                                   [default: 5000]

Examples:
  tilecache-utility.exe  serve --input=./Map
```
## License:
See LICENSE.md