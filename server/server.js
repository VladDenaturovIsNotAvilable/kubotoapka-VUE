
import express from 'express'
import path from 'path'
import cors from 'cors'
import fs from 'fs'
import Watcher from 'watcher';
//const express = require('express')
//const path = require('path')
//var cors = require('cors')
//const fs = require('fs')
const app = express()
const port = 2137




    



app.use(cors())
app.use(express.json({limit: "10mb"}))
app.use(express.static('/dist'));


//----- html response -----//
app.get('/', (req, res) => {
    res.sendFile((path.join(__dirname, `dist`, `/index.html`)))
})


//------ handlers -----// 
    //--chat--//
//upload
app.post('/sendMessage', (req, res) => {
        var chatLog = JSON.parse(fs.readFileSync("./serverFiles/chatLog.json", "utf-8"))
        chatLog.chatlogValue.push(req.body)
        fs.writeFileSync("./serverFiles/chatLog.json",JSON.stringify(chatLog))
        res.send("nigger")  
})

//download
import { WebSocketServer } from 'ws'
    const wss = new WebSocketServer({ port: 2138 });
    const watcher = new Watcher ( "./serverFiles/chatLog.json" );
    
        wss.on('connection', function connection(ws) {
         const chatLog = fs.readFileSync( "./serverFiles/chatLog.json", "utf-8" )
            ws.send(chatLog) 

            watcher.on ( 'all', ( event, targetPath, targetPathNext ) => { 
                let chatLog = fs.readFileSync( "./serverFiles/chatLog.json", "utf-8" )
            ws.send(chatLog)
            });
    })
    //--tokens--//
//upload
app.post('/sendToken', (req, res) => {

var tokenBinaries = JSON.parse(fs.readFileSync("./serverFiles/tokensBinaryData.json", "utf-8"))
tokenBinaries.tokensArray.push(req.body)
    fs.writeFileSync("./serverFiles/tokensBinaryData.json",JSON.stringify(tokenBinaries))
   res.send("nigger")
    
})
//download
app.get('/getToken', (req, res) => {
    var x = fs.readFileSync("./serverFiles/tokensBinaryData.json", "utf-8")
    res.send(x)
    })

    
//--gameBoard
//upload
//download
app.listen(port, () => {
  console.log("i live...prolly")
})


    //--weeb Socket tests
    


   

   
    
    


