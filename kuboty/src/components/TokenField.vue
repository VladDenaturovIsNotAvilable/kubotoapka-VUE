<template>
    <div class = "board" @:dragenter = "(e)=>{this.over = ''}" >

        <div class = innerBoard>
            <div class = "imageDiv"  v-for = " img in boardArray" v-bind:id = "img"
            @:dragover= "(e)=>{
                this.over = e.target.id
            }">
                <img v-bind:src = "img.src" width = "40px" height = "40px" >
            </div> 
        </div>

    </div>
    <div class = "tokenField" >
        <div>
            <img id = 'niq' v-for="ele in tokenArray" draggable="true" class = "tokenImage" v-bind:src = "ele.data " @:dragend= "(e)=>{
                if (this.over != ``) {
                    console.log(e.target.src)
                    console.log(this.over)

                    
                }
               
            }" >
        </div>
           
    </div>
    
    <input mulitple id = "image" type = "file" class = "UploadButton" accept="image/png, image/jpeg" hidden = "true" @change = "uploadImage" @:dragenter = "(e)=>{this.over = ''}">
    <label for ="image">Upload Image</label >
</template>


<script>
    export default{
        data(){
                return{
                    over:``,
                    tokenArray:[],
                    boardArray:[]
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
             console.log(x)
                this.boardArray = x.boardObjectsArr
});
        },
        methods:{
            //for TokenField
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
    width:50px;
    height:50px;
    border-style: ridge;
    border-width:1px;
    
}
</style>