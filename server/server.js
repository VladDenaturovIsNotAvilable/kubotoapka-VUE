
import express from 'express'
import path from 'path'
import cors from 'cors'
import fs, { readFileSync } from 'fs'
import Watcher from 'watcher';
import { WebSocketServer } from 'ws'

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express()
const port = 2137
var bcg  = fs.readFileSync("./serverFiles/defaultBinaries.json","utf-8")



    app.use(cors())
    app.use(express.static(__dirname +'/dist'));
    app.use(express.static(__dirname +'/serverFiles/avatars'));
    app.use(express.json({limit: "10mb"}));


function createBoard(){
    fs.writeFileSync("./serverFiles/Board.json",JSON.stringify({"boardObjectsArr":[]}))
    let gameBoardCreate = fs.readFileSync( "./serverFiles/Board.json", "utf-8" )
    var x = fs.readFileSync("./serverFiles/avatars/huite.png")
    var y = btoa(String.fromCharCode(...new Uint8Array(x)))

var objGameBoard = JSON.parse(gameBoardCreate)

for (let i = 0; i < 1000; i++) {
    let boardObj = {
        
        src:"data:image/png;base64," + y,
        id:i,
        hasData : false,
        data:{
            barPosX:70,     
            barPosY:10,
            bars:[],
            barsColors:["","",""],
            borderColors:["","",""]
},
    }
 objGameBoard.boardObjectsArr.push(boardObj) 
}
var x = JSON.stringify(objGameBoard)

fs.writeFileSync("./serverFiles/Board.json",x)
}
    createBoard()  //this thing resets the board


//----- html response -----//
app.get('/', (req, res) => {
    res.sendFile((path.join(__dirname, `dist`, `/index.html`)))
})

function sendMessage(){
    app.post('/sendMessage', (req, res) => {
        var chatLog = JSON.parse(fs.readFileSync("./serverFiles/chatLog.json", "utf-8"))
        chatLog.chatlogValue.push(req.body)
        fs.writeFileSync("./serverFiles/chatLog.json",JSON.stringify(chatLog))
        res.send("nigger")  
})
}
    sendMessage()


function sendToken(){
    app.post('/sendToken', (req, res) => {

        var tokenBinaries = JSON.parse(fs.readFileSync("./serverFiles/tokensBinaryData.json", "utf-8"))
        tokenBinaries.tokensArray.push(req.body)
            fs.writeFileSync("./serverFiles/tokensBinaryData.json",JSON.stringify(tokenBinaries))
           res.send("nigger")
            
        })
}
    sendToken()


function getToken(){
    app.get('/getToken', (req, res) => {
        var x = fs.readFileSync("./serverFiles/tokensBinaryData.json", "utf-8")
        res.send(x)
    })
}
    getToken()


function gameBoardUpload(){
    app.post('/gameBoardUpload', (req, res) => {
        var obj = req.body
        var board = JSON.parse(fs.readFileSync("./serverFiles/Board.json", "utf-8"))
         board.boardObjectsArr[obj.number].src = obj.img
         board.boardObjectsArr[obj.number].hasData = obj.dataState
         var newBoard = JSON.stringify(board)
        fs.writeFileSync("./serverFiles/Board.json",newBoard)

        res.send('sent')
    })
}
    gameBoardUpload()


    function createBoardSocket(){
    const wssT = new WebSocketServer({ port: 2139 });
    const watcherT = new Watcher ( "./serverFiles/Board.json" );

            //png transforming to btoa
        wssT.on('connection', function connection(ws) {

            let gameBoard1 = fs.readFileSync( "./serverFiles/Board.json", "utf-8" )
                ws.send(gameBoard1)

            watcherT.on ( 'all', ( event, targetPath, targetPathNext ) => { 
                let gameBoard2 = fs.readFileSync( "./serverFiles/Board.json", "utf-8" )
                ws.send(gameBoard2)
            });


    })
}
    createBoardSocket()


    function createChatSocket(){
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
}
    createChatSocket()


    function sendMovedToken(){
        app.post('/sendMovedToken', (req, res) => {
            var board = readFileSync("./serverFiles/Board.json","utf-8")
            var boardObj = JSON.parse(board)
            var movedTokenData = req.body
            var bcgObj = JSON.parse(bcg)
           

           if ( movedTokenData.src != boardObj.boardObjectsArr[movedTokenData.id].src) {
                    //image change
                boardObj.boardObjectsArr[movedTokenData.id].src =  movedTokenData.src
                boardObj.boardObjectsArr[movedTokenData.movedFrom].src =  bcgObj.boardBcg

                //bars data
                boardObj.boardObjectsArr[movedTokenData.id].data.bars =  boardObj.boardObjectsArr[movedTokenData.movedFrom].data.bars
                boardObj.boardObjectsArr[movedTokenData.movedFrom].data.bars = []

                //bars colors
                boardObj.boardObjectsArr[movedTokenData.id].data.barsColors =  boardObj.boardObjectsArr[movedTokenData.movedFrom].data.barsColors
                boardObj.boardObjectsArr[movedTokenData.movedFrom].data.barsColors = ["","",""]
                
                //bars border colors
                boardObj.boardObjectsArr[movedTokenData.id].data.borderColors =  boardObj.boardObjectsArr[movedTokenData.movedFrom].data.barsColors
                boardObj.boardObjectsArr[movedTokenData.movedFrom].data.borderColors = ["","",""]



                boardObj.boardObjectsArr[movedTokenData.movedFrom].hasData = false
                boardObj.boardObjectsArr[movedTokenData.id].hasData = "true"

           }
           
           var stringObj = JSON.stringify(boardObj)
            fs.writeFileSync("./serverFiles/Board.json",stringObj)


            res.send('ayaya')
        })
    }
    sendMovedToken()


function sendBarData(){
    app.post('/sendBarData', (req, res) => {
        var board = JSON.parse(fs.readFileSync("./serverFiles/Board.json", "utf-8"))
        board.boardObjectsArr[req.body.id].data.bars.push(req.body.bar)
        board.boardObjectsArr[req.body.id].data.barPosY = req.body.posY
        var strBoard = JSON.stringify(board)
        fs.writeFileSync("./serverFiles/Board.json",strBoard)

            res.send('ayaya')
        })
}
    sendBarData()


function giveBarData(){
    app.post('/giveBarData', (req, res) => {
        var board = JSON.parse(fs.readFileSync("./serverFiles/Board.json", "utf-8"))
        res.send( board.boardObjectsArr[req.body.id].data )
        })
    
}
    giveBarData()


function sendBarDataMenuToBoard(){
    app.post('/sendBarDataMenuToBoard', (req, res) => {
        var board = JSON.parse(fs.readFileSync("./serverFiles/Board.json", "utf-8"))
        board.boardObjectsArr[req.body.id].data.bars[req.body.barNumber] = [req.body.value]
        var newBoard = JSON.stringify(board)
        fs.writeFileSync("./serverFiles/Board.json",newBoard)
    res.send('ayaya')
        })

}
    sendBarDataMenuToBoard()


function giveBarsLength(){
    app.post('/giveBarsLength', (req, res) => {
        var board = JSON.parse(fs.readFileSync("./serverFiles/Board.json", "utf-8"))
        var boardLength = {
            dat:board.boardObjectsArr[req.body.id].data.bars.length
        }
        res.send( boardLength )
        })
}
    giveBarsLength()
    

app.listen(port, () => {
  console.log("i live...prolly")
})

    


   

   
    
    


