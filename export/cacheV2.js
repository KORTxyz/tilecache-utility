const fs = require('fs').promises;
const bundle = require('./bundle');
const mbtiles = require('./mbtiles');

const writeTile = async (folder, z, x, y, tile) => {

    await fs.mkdir(`${folder}/${z}/${x}`, { recursive: true });

    const fileName = `${folder}/${z}/${x}/${y}.png`

    try {
        outputFd = await fs.open(fileName, 'w')
        await outputFd.write(tile)
        console.log(`created file ${fileName}`)
    }
    catch (error) {
        console.dir(error)
    }
    finally {
        await outputFd.close()
    }

}

const unpackBundle = async (dir, zoomlevel, bundlefile) => {
    const file = `${dir}/_alllayers/${zoomlevel}/${bundlefile}`;
    let fd;
    console.log(`unpacking: ${zoomlevel}/${bundlefile}`)
    try {
        const bundleOffset = bundle.getOffset(file)

        fd = await fs.open(file, 'r');
        const records = await bundle.getTileIndexes(fd)
        let tiles = []
        for (const record of records) {
            const tile = {
                z: Number(zoomlevel.substr(-2, 2)),
                y: bundleOffset.rowOffset + record.row,
                x: bundleOffset.columnOffset + record.column,
                tile: await bundle.getTile(fd, record)
            }

            tiles.push(tile)
            //await writeTile("./tiles", z, x, y, tile)
        }
        await mbtiles.insertTiles(tiles)
    }
    catch (err) {
        console.error(err)
    }
    finally {
        await fd.close()
    }

}

const readZoomlevelDir = async (dir, zoomlevel) => {
    const zoomlevelDir = await fs.readdir(dir + "/_alllayers/" + zoomlevel);
    for (const bundlefile of zoomlevelDir) await unpackBundle(dir, zoomlevel, bundlefile)
};


const getFilename = (column, row) => {
    var r = parseInt(row - (row % 128), 10).toString(16);
    r = "R" + r.padStart(4, '0');

    var c = parseInt(column - (column % 128), 10).toString(16);
    c = "C" + c.padStart(4, '0');

    return `${r}${c}.bundle`
};

const getTile = async (zoomlevel, x, y) => {
    const bundlefile = getFilename(x, y);
    const file = `${process.argv.input}/_alllayers/L${zoomlevel.padStart(2, '0')}/${bundlefile}`;
    let fd;
    try {
        fd = await fs.open(file, 'r');
        
        const tileIndex = await bundle.getTileIndex(fd, y % 128, x % 128)
        const tile = tileIndex? await bundle.getTile(fd, tileIndex):null;
        
        fd.close()

        return tile;
    }
    catch (err) {
        throw err
    }
};

module.exports = {
    getTile: getTile,
    readZoomlevelDir: readZoomlevelDir
};