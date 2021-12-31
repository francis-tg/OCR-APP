const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const multer = require('multer')
const { TesseractWorker } = require('tesseract.js')
const worker = new TesseractWorker()

app.use(cors())

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './uploads');
    },
    filename: (req, res, cb) => {
        cb(null, req.file)
    }
})

const upload = multer({ storage: storage }).single('avatar');

app.get('/pdf', (req, res) => {
    upload(req, res, err => {
        console.log(req.file)
    })
})



http.createServer(app).listen(2021, () => {
    console.log('server running on port 2021')
})