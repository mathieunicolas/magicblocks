import express from 'express'
import axios from 'axios'
import getMethod from '../lib/getMethod'
// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
router.use((req, res, next) => {
    Object.setPrototypeOf(req, app.request)
    Object.setPrototypeOf(res, app.response)
    req.res = res
    res.req = req
    next()
})

//get current block height
router.get('/height', async function(req, res) {
    let height0 = (await getMethod('int_blockNumber')).result
    let height = { "height": parseInt(height0, 16) }

    //console.log(height)

    res.status(200).json(height)
});

//get average blocktime (by the explorer API)
router.get('/avgBlockTime', async function(req, res) {
    let aBT0 = (await axios.get("http://titansexplorer.intchain.io/api/block/avgBlockTime")).data
    let aBT = {'averageBlockTime' : aBT0/1000, 'rawValue': aBT0}

    //console.log(aBT)

    res.status(200).json(aBT)
});

//determinates the next magic block height
router.get('/nextMagicBlock', async function(req, res) {
    let magic_blocks = [2250000,2300000,2350000,2400000,2450000,2500000,2550000,2600000]
    let height = parseInt((await getMethod('int_blockNumber')).result, 16)

    let i = 0;
    while (height > magic_blocks[i]) {
        i++;
    }

    let nextMB = magic_blocks[i]

    //console.log(height)
    res.status(200).json({ 'nextMagicBlock': nextMB})
})

/********************************************************************/
//dateNextMB reproduces the three precedent API calls
//in order to reduce the number of API calls when displaying index.vue
router.get('/dateNextMB', async function(req, res) {
    let height0 = (await getMethod('int_blockNumber')).result
    let height = parseInt(height0, 16)

    let aBT0 = (await axios.get("http://titansexplorer.intchain.io/api/block/avgBlockTime")).data
    let aBT = {'averageBlockTime' : aBT0/1000, 'rawValue': aBT0}

    let magic_blocks = [2250000,2300000,2350000,2400000,2450000,2500000,2550000,2600000]

    let i = 0;
    while (height > magic_blocks[i]) {
        i++;
    }

    let nextMB = magic_blocks[i]

    //msRemaining is the amount of milliseconds remaining till the next magic block
    let msRemaining = (nextMB - height)*aBT.rawValue
    //console.log(msRemaining)
    res.status(200).json({'height': height, 'aBT': aBT.rawValue, 'nextMB': nextMB, 'msRemaining': msRemaining})
})

// Export the server middleware
export default {
    path: '/api',
    handler: router
}
