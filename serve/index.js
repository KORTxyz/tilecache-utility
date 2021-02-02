const serve = async () => {
    
    require("./server.js")(process.argv.port);
}

module.exports = serve;