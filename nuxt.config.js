import bodyParser from 'body-parser'
export default {
    head: {
        title: 'The next INT Titans Magic Block !'
    },
    modules: [
        '@nuxtjs/axios'
    ],
    serverMiddleware: [
        bodyParser.json(),
        '~/api'
    ]
}