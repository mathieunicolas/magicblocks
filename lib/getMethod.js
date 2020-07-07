const axios = require('axios')

const getMethod = async (method) => {
    const data = {"jsonrpc":"2.0","method":method,"params":[],"id":1};

    const config = {
        method: 'post',
        url: 'http://localhost:8555/testnet',
        headers: {
            'content-type': 'application/json;'
        },
        data : data
    };

    let result = (await axios(config)).data

    return result
}

module.exports = getMethod