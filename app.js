const express = require('express')
const axios = require('axios')
const app = express()
const getMethod = require('./lib/getMethod')

app.get('/api/height', async function(req, res) {
    let height0 = (await getMethod('int_blockNumber')).result
    let height = JSON.stringify({ "height": parseInt(height0, 16) })

    //console.log(height)

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(height)
});

app.get('/api/avgBlockTime', async function(req, res) {
    let aBT0 = (await axios.get("http://titansexplorer.intchain.io/api/block/avgBlockTime")).data
    let aBT = JSON.stringify({'averageBlockTime' : aBT0/1000, 'rawValue': aBT0})

    //console.log(aBT)

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(aBT)
});

app.get('/api/nextMagicBlock', async function(req, res) {
    let magic_blocks = [2250000,2300000,2350000,2400000,2450000,2500000,2550000,2600000]
    let height = parseInt((await getMethod('int_blockNumber')).result, 16)

    let i = 0;
    while (height > magic_blocks[i]) {
        i++;
    }

    let nextMB = magic_blocks[i]

    //console.log(height)
    res.writeHeader(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({ 'nextMagicBlock': nextMB}))
})

app.get('/api/dateNextMB', async function(req, res) {
    let height = (await axios.get('https://golgoth.duckdns.org/api/height')).data
    let aBT = (await axios.get('https://golgoth.duckdns.org/api/avgBlockTime')).data
    let nextMB = (await axios.get('https://golgoth.duckdns.org/api/nextMagicBlock')).data

    let msRemaining = (nextMB.nextMagicBlock - height.height)*aBT.rawValue
    console.log(msRemaining)
    res.writeHeader(200, {'Content-Type': 'application/json'})
    res.end('ok')
})

app.get('/', function(req, res) {
    res.send()
})

var server = app.listen(3000, function () {
    var port = server.address().port
    console.log("Example app listening at %s", port)
})
