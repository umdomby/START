const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path')
const app = express()
app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname, 'build')))

const httpServer = http.createServer(app);
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

httpServer.listen(8081, () => {
    console.log('HTTP Server running on port 8081');
});
