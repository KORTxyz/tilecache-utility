const fs = require('fs').promises;

const cacheV2 = require('./cacheV2');
const metadata = require('./metadata');
const mbtiles = require('./mbtiles');

const extract = async () => {
    process.argv.type = process.argv.output.split(".").pop() == "mbtiles"?"mbtiles":"files";
    const dir = process.argv.input;
    const maxZoom = process.argv.maxZoom || 25;
    
    if(process.argv.type=="mbtiles") await mbtiles.createDatabase();
    const _alllayers = await fs.readdir(dir + "/_alllayers");
    for (const zoomlevel of _alllayers) {
        const zoom = Number(zoomlevel.substr(-2, 2));
        if (zoom <= maxZoom) await cacheV2.readZoomlevelDir(dir, zoomlevel)
    }
    if(process.argv.type=="mbtiles") {
        await mbtiles.createTilesIndex();
        const cacheInfo = await metadata.getCacheInfo(process.argv.input);
        const bbox = await metadata.getBBOX(process.argv.input);
        const inputInfo = {
            "name ":process.argv.input.split("/").pop(),
            "format":cacheInfo.CacheTileFormat.toLowerCase(),
            "bounds": bbox.toString()
        }

        await mbtiles.insertMetadata(inputInfo);
    }
};

module.exports = extract;