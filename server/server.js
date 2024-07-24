
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

//board function


function createBoard(){
    fs.writeFileSync("./serverFiles/Board.json",JSON.stringify({"boardObjectsArr":[]}))
    let gameBoardCreate = fs.readFileSync( "./serverFiles/Board.json", "utf-8" )
    let boardObj = {
        src:``,
        data:{
            bars:[]
},
    }
var objGameBoard = JSON.parse(gameBoardCreate)

for (let i = 0; i < 374; i++) {
 objGameBoard.boardObjectsArr.push(boardObj) 
}
var x = JSON.stringify(objGameBoard)

fs.writeFileSync("./serverFiles/Board.json",x)
}
createBoard()


    



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
app.post('/gameBoardTokenUP', (req, res) => {

        
    })
//download
const wssT = new WebSocketServer({ port: 2139 });
    const watcherT = new Watcher ( "./serverFiles/Board.json" );
        wssT.on('connection', function connection(ws) {

            let gameBoard1 = fs.readFileSync( "./serverFiles/Board.json", "utf-8" )
                ws.send(gameBoard1)

            watcherT.on ( 'all', ( event, targetPath, targetPathNext ) => { 
                let gameBoard2 = fs.readFileSync( "./serverFiles/Board.json", "utf-8" )
                ws.send(gameBoard2)
            });


    })
app.listen(port, () => {
  console.log("i live...prolly")
})


    //--weeb Socket tests
    


   

   
    
    


