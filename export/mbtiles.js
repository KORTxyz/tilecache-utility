const sqlite = require('better-sqlite3');
const fs = require('fs').promises;

const createDatabase = async () => {
    try {
        await fs.unlink(process.argv.output);
        return true;
    } catch (err) {
        console.log("creating: MBTiles file")
    }
    finally{
        global.outputDb = sqlite(process.argv.output);
        global.outputDb.prepare('CREATE TABLE metadata ( name text, value text )').run();
        global.outputDb.prepare('CREATE TABLE tiles (zoom_level INTEGER NOT NULL,tile_column INTEGER NOT NULL,tile_row INTEGER NOT NULL,tile_data BLOB NOT NULL, UNIQUE (zoom_level, tile_column, tile_row) )').run();
        return process.argv.output + " created"
    }

}


const insertTiles = async tiles => {
    const insertTile = global.outputDb.prepare('INSERT INTO tiles (zoom_level,tile_column,tile_row,tile_data) VALUES (@z,@x,@tmsY,@tile)');

    tiles.map(tile => tile.tmsY = (1 << tile.z) - 1 - tile.y)

    const insert = global.outputDb.transaction((tiles) => {
        for (const tile of tiles) insertTile.run(tile);
    });
    await insert(tiles)
    return "Tiles inserted";
}

const createTilesIndex = async () => {
    await global.outputDb.prepare('CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row)').run();
    console.log("creating: tile_index table")
}


const insertMetadata = async metadata => {

    const insertmetadata = global.outputDb.prepare('INSERT INTO metadata (name,value) VALUES (?,?)');

    const insert = global.outputDb.transaction((tiles) => {
        const entries = Object.entries(metadata)
        for (const entry of entries) insertmetadata.run(entry);
    });
    await insert(metadata)
    
    console.log("inserting: metadata")
}

module.exports = {
    createDatabase: createDatabase,
    insertTiles: insertTiles,
    createTilesIndex: createTilesIndex,
    insertMetadata: insertMetadata
}

