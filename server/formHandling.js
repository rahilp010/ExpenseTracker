// import http from 'http'

// const server = http.createServer((req, res) => {
//     if (req.method === 'POST' && req.url === '/') {
//         let body = ''
//         req.on('data', (chunk) => {
//             body += chunk.toString()
//         })

//         req.on('end', () => {
//             console.log(JSON.parse(body))
//             res.writeHead(200, { 'Content-Type': 'application/json' })
//             res.end(JSON.stringify({ success: true, message: 'Account created successfully' }))
//         })
//     } else {
//         res.writeHead(400, { 'Content-Type': 'application/json' })
//         res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }))
//     }
// })

// server.listen(8000, () => {
//     console.log('Server is running on port 8000');

// })


import express from 'express'
import { config } from '../../../Node/src/config/config.js'


const app = express()

app.get('/', (req, res, next) => {
    res.status(200).json({ message: 'Welcome to the expense tracker API' })

})

const startServer = () => {
    const port = config.port
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}

startServer()