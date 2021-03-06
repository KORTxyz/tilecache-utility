const express = require('express');
const cacheV2 = require('../export/cacheV2');
const router = express.Router();

const mimetypes = {
    "png": "image/png",
    "jpg": "image/jpeg",
    "pbf": "application/vnd.mapbox-vector-tile"
}

const serviceIdentification = `
<ows:ServiceIdentification>
    <ows:Title>tilecache-utility</ows:Title>
    <ows:ServiceType>OGC WMTS</ows:ServiceType>
    <ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
</ows:ServiceIdentification>
`;

const serviceProvider = `
<ows:ServiceProvider>
    <ows:ProviderName>local</ows:ProviderName>
    <ows:ProviderSite xlink:href="${process.env.BASE_URL}/WMTS?"></ows:ProviderSite>
</ows:ServiceProvider>
`;

const operationsMetadata = `
    <ows:OperationsMetadata>
    <ows:Operation name="GetCapabilities">
        <ows:DCP>
            <ows:HTTP>
                <ows:Get xlink:href="${process.env.BASE_URL}/WMTS?">
                    <ows:Constraint name="GetEncoding">
                        <ows:AllowedValues>
                            <ows:Value>KVP</ows:Value>
                        </ows:AllowedValues>
                    </ows:Constraint>
                </ows:Get>
            </ows:HTTP>
        </ows:DCP>
    </ows:Operation>
    <ows:Operation name="GetTile">
        <ows:DCP>
            <ows:HTTP>
                <ows:Get xlink:href="${process.env.BASE_URL}/WMTS?">
                    <ows:Constraint name="GetEncoding">
                        <ows:AllowedValues>
                            <ows:Value>KVP</ows:Value>
                        </ows:AllowedValues>
                    </ows:Constraint>
                </ows:Get>
            </ows:HTTP>
        </ows:DCP>
    </ows:Operation>
</ows:OperationsMetadata>
`;


const layer = () => {
    //const bbox = metadata.bounds.split(",").map(e=>Number(e))
    return `
    <Layer>
        <ows:Title>tilecache-utility</ows:Title>
        <ows:Abstract>tilecache-utility</ows:Abstract>
        <ows:Identifier>tilecache-utility</ows:Identifier>
        <ows:WGS84BoundingBox crs="urn:ogc:def:crs:OGC:2:84">
            <ows:LowerCorner>-180 -85</ows:LowerCorner>
            <ows:UpperCorner>180 85</ows:UpperCorner>
        </ows:WGS84BoundingBox>
        <Style isDefault="true">
            <ows:Identifier>default</ows:Identifier>
        </Style>
        <Format>image/png</Format>
        <TileMatrixSetLink>
            <TileMatrixSet>GoogleMapsCompatible</TileMatrixSet>
        </TileMatrixSetLink>
    </Layer>
    `;
}; 

const tileMatrixSet = `
<TileMatrixSet>
    <ows:Identifier>GoogleMapsCompatible</ows:Identifier>
    <ows:BoundingBox crs="urn:ogc:def:crs:EPSG:6.3:3857">
        <ows:LowerCorner>-20037508.342789 -20037508.342789</ows:LowerCorner>
        <ows:UpperCorner>20037508.342789 20037508.342789</ows:UpperCorner>
    </ows:BoundingBox>
    <ows:SupportedCRS>urn:ogc:def:crs:EPSG:6.3:3857</ows:SupportedCRS>
    <WellKnownScaleSet>urn:ogc:def:wkss:OGC:1.0:GoogleMapsCompatible</WellKnownScaleSet>
    <TileMatrix>
        <ows:Identifier>0</ows:Identifier>
        <ScaleDenominator>559082264.02871787548065185547</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>1</MatrixWidth>
        <MatrixHeight>1</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>1</ows:Identifier>
        <ScaleDenominator>279541132.01435887813568115234</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>2</MatrixWidth>
        <MatrixHeight>2</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>2</ows:Identifier>
        <ScaleDenominator>139770566.00717940926551818848</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>4</MatrixWidth>
        <MatrixHeight>4</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>3</ows:Identifier>
        <ScaleDenominator>69885283.00358971953392028809</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>8</MatrixWidth>
        <MatrixHeight>8</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>4</ows:Identifier>
        <ScaleDenominator>34942641.50179485976696014404</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>16</MatrixWidth>
        <MatrixHeight>16</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>5</ows:Identifier>
        <ScaleDenominator>17471320.75089742988348007202</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>32</MatrixWidth>
        <MatrixHeight>32</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>6</ows:Identifier>
        <ScaleDenominator>8735660.37544871494174003601</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>64</MatrixWidth>
        <MatrixHeight>64</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>7</ows:Identifier>
        <ScaleDenominator>4367830.18772435747087001801</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>128</MatrixWidth>
        <MatrixHeight>128</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>8</ows:Identifier>
        <ScaleDenominator>2183915.09386217873543500900</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>256</MatrixWidth>
        <MatrixHeight>256</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>9</ows:Identifier>
        <ScaleDenominator>1091957.54693108866922557354</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>512</MatrixWidth>
        <MatrixHeight>512</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>10</ows:Identifier>
        <ScaleDenominator>545978.77346554468385875225</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>1024</MatrixWidth>
        <MatrixHeight>1024</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>11</ows:Identifier>
        <ScaleDenominator>272989.38673277228372171521</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>2048</MatrixWidth>
        <MatrixHeight>2048</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>12</ows:Identifier>
        <ScaleDenominator>136494.69336638617096468806</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>4096</MatrixWidth>
        <MatrixHeight>4096</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>13</ows:Identifier>
        <ScaleDenominator>68247.34668319307093042880</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>8192</MatrixWidth>
        <MatrixHeight>8192</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>14</ows:Identifier>
        <ScaleDenominator>34123.67334159654274117202</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>16384</MatrixWidth>
        <MatrixHeight>16384</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>15</ows:Identifier>
        <ScaleDenominator>17061.83667079827137058601</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>32768</MatrixWidth>
        <MatrixHeight>32768</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>16</ows:Identifier>
        <ScaleDenominator>8530.91833539913568529300</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>65536</MatrixWidth>
        <MatrixHeight>65536</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>17</ows:Identifier>
        <ScaleDenominator>4265.45916769956784264650</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>131072</MatrixWidth>
        <MatrixHeight>131072</MatrixHeight>
    </TileMatrix>
    <TileMatrix>
        <ows:Identifier>18</ows:Identifier>
        <ScaleDenominator>2132.72958384978392132325</ScaleDenominator>
        <TopLeftCorner>-20037508.342789 20037508.342789</TopLeftCorner>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>262144</MatrixWidth>
        <MatrixHeight>262144</MatrixHeight>
    </TileMatrix>
</TileMatrixSet>
`;

const capabilities = () => {
    return `
    <Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
        ${serviceIdentification}
        ${serviceProvider}
        ${operationsMetadata}
        <Contents>
            ${layer()}
            ${tileMatrixSet}
        </Contents>
        <ServiceMetadataURL xlink:href="${process.env.BASE_URL}/WMTS?" />
    </Capabilities>
    `
};


const getCapabilities = async res => {
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(capabilities());
}

const getTile = async (req,res) => {
    //http://localhost:9999/WMTS?TileCol=0&TileMatrix=1&TileMatrixSet=GoogleMapsCompatible&TileRow=1&format=image%2Fpng&layer=tilecache-utility&request=GetTile&service=WMTS&style=default&version=1.0.0
    const {TileMatrix, TileCol, TileRow} = req.query;
    const tile = await cacheV2.getTile(TileMatrix, TileCol, TileRow)
    res.writeHead(200, {'Content-Type': 'image/png'})
    res.end(tile)
}

const root = async (req, res, next) => {
    try {
        if(!req.query.request && !req.query.REQUEST) return next("no request parameter")
        const request = req.query.request || req.query.REQUEST;
        const type = request.toLowerCase();
        if(type == "getcapabilities") await getCapabilities(res);
        else if(type == "gettile") await getTile(req,res);
        else return next("no valid request parameter")

    }
    catch (err){   
        return next(err)
    } 
}


router.get('/', root);

module.exports = router;
