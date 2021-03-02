const path = require('path')

const TILE_INDEX_OFFSET = 64;
const TILE_INDEX_ARRAY_SIZE = 128;
const TILE_INDEX_RECORD_SIZE = 8;


const tileIndexOffset = (row, column) => TILE_INDEX_OFFSET + TILE_INDEX_RECORD_SIZE * (TILE_INDEX_ARRAY_SIZE * (row % TILE_INDEX_ARRAY_SIZE) + (column % TILE_INDEX_ARRAY_SIZE));

const getOffset = bundleFileName => {
    const bundleName = path.basename(bundleFileName, '.bundle').substring(1).split("C") // R<rrrr>C<cccc> -> [<rrrr>,<cccc>]

    const row = bundleName[0].toUpperCase()
    const rowOffset = parseInt(row, 16)

    const col = bundleName[1].toUpperCase()
    const columnOffset = parseInt(col, 16)

    return {
        rowOffset: rowOffset,
        columnOffset: columnOffset
    }
}

const tileIndexRecord = (buffer) => {
    const record = {
        tileOffset: buffer.readUIntLE(0, 5),
        tileSize: buffer.readUIntLE(5, 3)
    }
    return record
}

const getTileIndex = async (fd, row, column) => {
    const buffer = Buffer.alloc(TILE_INDEX_RECORD_SIZE)
    await fd.read(buffer, 0, TILE_INDEX_RECORD_SIZE, tileIndexOffset(row, column))
    const record = tileIndexRecord(buffer)
    if (record.tileSize !== 0) {
        return record
    }
    else { return }
}

const getTileIndexes= async (fd) => {
    const buffer = Buffer.alloc(TILE_INDEX_RECORD_SIZE)
    const allRecords = []
    for (let row = 0; row < TILE_INDEX_ARRAY_SIZE; row++) {
        for (let column = 0; column < TILE_INDEX_ARRAY_SIZE; column++) {
            await fd.read(buffer, 0, TILE_INDEX_RECORD_SIZE, tileIndexOffset(row, column))
            const record = tileIndexRecord(buffer)
            if (record.tileSize !== 0) {
                allRecords.push({ ...{ row: row, column: column }, ...record })
            }
        }
    }
    return allRecords
}

const getTile = async (fd, tileRecord) => {
    const buffer = Buffer.alloc(tileRecord.tileSize)
    await fd.read(buffer, 0, tileRecord.tileSize, tileRecord.tileOffset)
    return buffer
}


module.exports = {
    getOffset: getOffset,
    getTileIndex: getTileIndex,
    getTileIndexes: getTileIndexes,
    getTile: getTile
};