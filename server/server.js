
import express from 'express'
import path from 'path'
import cors from 'cors'
import fs from 'fs'
import Watcher from 'watcher';
import { WebSocketServer } from 'ws'

const app = express()
const port = 2137

function appUses(){
    app.use(cors())
    app.use(express.json({limit: "10mb"}))
    app.use(express.static('/dist'));
    app.use(express.static('/serverFiles/avatars'));
}
appUses()

function createBoard(){
    fs.writeFileSync("./serverFiles/Board.json",JSON.stringify({"boardObjectsArr":[]}))
    let gameBoardCreate = fs.readFileSync( "./serverFiles/Board.json", "utf-8" )
    var x = fs.readFileSync("./serverFiles/avatars/huite.png")
    var y = btoa(String.fromCharCode(...new Uint8Array(x)))

var objGameBoard = JSON.parse(gameBoardCreate)

for (let i = 0; i < 374; i++) {
    let boardObj = {
        src:"data:image/png;base64," + y,
        id:i,
        data:{
            bars:[]
},
    }
 objGameBoard.boardObjectsArr.push(boardObj) 
}
var x = JSON.stringify(objGameBoard)

fs.writeFileSync("./serverFiles/Board.json",x)
}
//createBoard()  //this thing resets the board

//----- html response -----//
app.get('/', (req, res) => {
    res.sendFile((path.join(__dirname, `dist`, `/index.html`)))
})


function messageReciever(){
    app.post('/sendMessage', (req, res) => {
        var chatLog = JSON.parse(fs.readFileSync("./serverFiles/chatLog.json", "utf-8"))
        chatLog.chatlogValue.push(req.body)
        fs.writeFileSync("./serverFiles/chatLog.json",JSON.stringify(chatLog))
        res.send("nigger")  
})
}
messageReciever()

function tokenReciever(){
    app.post('/sendToken', (req, res) => {

        var tokenBinaries = JSON.parse(fs.readFileSync("./serverFiles/tokensBinaryData.json", "utf-8"))
        tokenBinaries.tokensArray.push(req.body)
            fs.writeFileSync("./serverFiles/tokensBinaryData.json",JSON.stringify(tokenBinaries))
           res.send("nigger")
            
        })
}
tokenReciever()


function tokenUploader(){
    app.get('/getToken', (req, res) => {
        var x = fs.readFileSync("./serverFiles/tokensBinaryData.json", "utf-8")
        res.send(x)
    })
}
tokenUploader()

function gameBoardUploader(){
    app.post('/gameBoardUpload', (req, res) => {
        var obj = req.body
        var board = JSON.parse(fs.readFileSync("./serverFiles/Board.json", "utf-8"))
         board.boardObjectsArr[obj.number].src = obj.img
         var newBoard = JSON.stringify(board)
        fs.writeFileSync("./serverFiles/Board.json",newBoard)

        res.send('sent')
    })
}
gameBoardUploader()

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
app.listen(port, () => {
  console.log("i live...prolly")
})

    


   

   
    
    


