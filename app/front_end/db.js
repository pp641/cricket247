module.exports = {
    url : 'mongodb://localhost:27017/test',
    options: {
        autoIndex: true,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        useUnifiedTopology: true,
    }
}

