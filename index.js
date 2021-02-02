const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
    .command('export [-i input] [-o output] [OPTIONS]', 'export tilecache content to output', (yargs) => {
        yargs
            .usage("Usage: $0 export -i dir -o file")
            .options({
                'input': {
                    alias: 'i',
                    describe: 'path to input data',
                    default: './'
                },
                'output': {
                    alias: 'o',
                    describe: 'where to put the data',
                    default: './export.mbtiles'
                },
                'maxZoom': {
                    alias: 'z',
                    describe: 'set maxzoom to be exportet',
                    demandOption: "The zoom is required.",
                    type: "number",
                    nargs: 1,
                    default: 25
                }, 
                'verbose': {
                    alias: 'v',
                    type: 'boolean',
                    default: false,
                    description: 'Run with verbose logging'
                }
            })
            .example("$0 export --input=./Map --output=tavg_01.mbtiles")
            .hide('help')
            .hide('version')
            .hide('verbose')

    }, async (argv) => {
        process.argv = { ...argv }
        try {
            await require('./export')()
        }
        catch (err) {
            console.error(err)
        }
        finally {
            console.log("completed: export to "+process.argv.output)
        }
    })
    .command('serve [-i dir] [OPTIONS]', 'publish tilecache as a webservice', (yargs) => {
        yargs
            .usage("Usage: $0 serve -i dir -p port")
            .options({
                'input': {
                    alias: 'i',
                    describe: 'path to input data',
                    default: './'
                },
                'port': {
                    alias: 'p',
                    describe: 'port to bind on',
                    default: 5000
                },
                'verbose': {
                    alias: 'v',
                    type: 'boolean',
                    default: false,
                    description: 'Run with verbose logging'
                }
            })
            .example("$0 serve --input=./Map")
            .hide('help')
            .hide('version')
            .hide('verbose')
    }, async (argv) => {
        process.argv = { ...argv }
        await require('./serve')();

    })
    .showHelpOnFail(true)
    .demandCommand(1, '')
    .argv