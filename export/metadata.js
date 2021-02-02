const proj4 = require('proj4');
const fs = require('fs').promises;

const getXMLValue = (xml, tag) => {
    const startTag = `<${tag}>`
    const endTag = `</${tag}>`

    const start = xml.indexOf(startTag) + startTag.length;
    const length = xml.indexOf(endTag) - start;

    return xml.substr(start, length)
};


const getBBOX = async dir => {
    const xml_string = await fs.readFile(dir + "/conf.cdi", { encoding: "utf8" });
    const decodeHTML = str => str.replace(/&quot;/g, '"');

    let config = {};
    ["WKT", "XMin", "YMin", "XMax", "YMax"].forEach(tag => {
        config[tag] = getXMLValue(xml_string, tag)
    });

    const min = proj4(decodeHTML(config.WKT)).inverse([Number(config.XMin), Number(config.YMin)]);
    const max = proj4(decodeHTML(config.WKT)).inverse([Number(config.XMax), Number(config.YMax)]);
    const bbox = [min[0], min[1], max[0], max[1]]

    return bbox
};

const getCacheInfo = async dir => {
    const xml_string = await fs.readFile(dir + "/conf.xml", { encoding: "utf8" });

    let cacheInfo = {};
    ["CacheTileFormat", "StorageFormat", "PacketSize"].forEach(tag => {
        cacheInfo[tag] = getXMLValue(xml_string, tag)
    });

    return cacheInfo
};

module.exports = {
    getBBOX: getBBOX,
    getCacheInfo: getCacheInfo,
};

