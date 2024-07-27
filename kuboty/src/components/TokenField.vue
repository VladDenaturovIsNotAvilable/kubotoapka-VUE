<template>
    <div class = "board" @:dragenter = "(e)=>{this.over = ''}">

        <div class = innerBoard>
            <div class = "imageDiv"  v-for = " img in boardArray" v-bind:id = "`img`+img.id"  ref = "image"
            @:dragover= "(e)=>{
                this.over = e.target.id
            }">


            <div class = "barsContainer" >
                <div v-if = "img.hasData" v-for = "elem in barsArray" class = "bar"></div>
            </div>
                <img class = "image" v-bind:src = "img.src" width = "40px" height = "40px" v-bind:id = "img.id"  @:dragstart = "moveStart" @:dragover = "moveOver"  @:dragend = "moveEnd" @:contextmenu = "context" >
            </div> 
        </div>

    </div>
    <div class = "tokenField" >
        <div>
            <img id = 'niq' v-for="ele in tokenArray" draggable="true" class = "tokenImage" v-bind:src = "ele.data " @:dragend= "uploadBoardToken">
        </div>
           
    </div>
    
    <input mulitple id = "image" type = "file" class = "UploadButton" accept="image/png, image/jpeg" hidden = "true" @change = "uploadImage" @:dragenter = "(e)=>{this.over = ''}">
    <label for ="image">Upload Image</label >
</template>


<script>
    export default{
        data(){
                return{
                    contexted : "false",
                    clicked : 0,
                    movedData:{src:"",id:"",movedFrom:""},
                    over:``,
                    tokenArray:[],
                    boardArray:[],

                    //how many bars
                    barsArray:[1,1,1]
                }
        },
        mounted(){
            //getting tokens
            setTimeout(async ()=>{ //set timeout is for using this and await at the same time
                var response = await fetch("http://localhost:2137/getToken")
                 var resData = await response.json()
                 this.tokenArray = (resData.tokensArray)

                
            },1)
                
                //board download.. 374 obj
                var socket = new WebSocket("http://localhost:2139")
            socket.addEventListener("message", (eve) => { 
             var x = JSON.parse(eve.data)
                this.boardArray = x.boardObjectsArr
                console.log(this.boardArray[0].data.bars)
});

        },
        methods:{
            uploadImage(eve){
               var image = eve.target.files[0]
               var imageReader = new FileReader
               imageReader.readAsArrayBuffer(image, "UTF-8")

               imageReader.onload = (readerEve) => {
                var imageData = readerEve.target.result; 
                var tokenBinary = {data:"data:image/png;base64,"+ btoa(String.fromCharCode(...new Uint8Array(imageData)))}

                    //for some reason i couldn't use async at uploadImage function.. so i did this

                async function sendToken(){
                    const response = await fetch("http://localhost:2137/sendToken",{
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body:JSON.stringify(tokenBinary)},);
                } sendToken()
                }
            },

            uploadBoardToken(e){
                const data = {
                    img:e.target.src,
                    number:this.over,
                    dataState:true
                }
                async function sendImg(){
                    const response = await fetch("http://localhost:2137/gameBoardUpload",{
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body:JSON.stringify(data)},);
                console.log(data)
                } sendImg()
            },
            moveStart(e){
                if (this.contexted === "false") {
                    this.movedData.src = e.target.src
                    this.movedData.movedFrom = e.target.id
                }
                    
            },
            moveOver(e){
                if (this.contexted === "false") {
                    this.movedData.id = e.target.id
                }
                
            },
            moveEnd(e){

                if (this.contexted === "false") {
                    setTimeout(async ()=>{
                    const response = await fetch("http://localhost:2137/sendMovedToken",{
                    method:"POST",
                    headers:{
                    "Content-Type": "application/json"
                    },
                    body:JSON.stringify(this.movedData)
            }); 
                },1)
                }
               
                
            },
            context(e){
                //for some reason v-bind ing a class didn't worked.. so i did this the old fashion way
                //context menu hide and show
                e.preventDefault();
                this.contexted = "true"
                var element = document.createElement("div")
                var elRef = this.$refs.image[e.target.id]
                

                if (this.clicked === 0 ) {
                elRef.appendChild(element)
                    element.className = "contextMenu"
                    element.style.left = e.clientX + 50 + `px`
                    element.style.top = e.clientY + `px`
                    this.clicked = 1
                    console.log(e.target)

                } else {
                    elRef.removeChild((elRef.children[2]))
                    this.clicked = 0
                    this.contexted = "false"
                }
               

                
                
        


            }

        }
    }



</script>

<style>

.tokenField{
    width:26vh;
    height:96vh;
    border-radius: 10px;
    border-style: groove;
    border-width:1px;
    border-color: black;


    display:flex;
    gap:0;
    flex-wrap:wrap;
    align-content:flex-start;

}
.tokenImage{
    width:30px;
    height:30px;
    border-style:ridge;
    border-color: black;
    border-radius: 10px;
    border-width: 1px
}
.board{
    overflow-x: scroll;
    overflow-y:visible;

    height:900px;
    width:1200px;

    border-width: 1px;
    border-style:ridge;
    border-color: black;
    border-radius: 10px;

    display:flex;
    flex-wrap: wrap;
    align-content:center;
    justify-content:center;
    flex-direction:column
  }

  .innerBoard{
    height:900px;
    width:1200px;

    display:flex;
    flex-wrap: wrap;
    align-content:center;
    flex-direction:column
  }
.imageDiv{
    display: flex;
    align-items:center;
    justify-content:center;

    width:50px;
    height:50px;
    border-style: ridge;
    border-width:1px;
    display:flex;
    flex-wrap: wrap;

   
    
}
.contextMenu{
    display:flex;

    position: absolute;
    width:60px;
    height:250px;

    border-style:inherit;
    border-width: 1px;

    background-color: rgb(233, 226, 214);
}
.bar{
    width:50px;
    height:5px;
    border-style:ridge;
    border-width: 1px;
    border-color: black;
}
.barsContainer{
    position: relative;
    bottom:38px;
    display:flex;
    flex-direction: column;
}
.image{
    position: absolute;
}
</style>