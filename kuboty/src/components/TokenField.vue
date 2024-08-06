<template>
    <div class = "board" @:dragenter = "(e)=>{this.over = ''}" @:click = "cancelMenu">

        <div class = innerBoard>
            <div class = "imageDiv"  v-for = " img in boardArray" v-bind:id = "`img`+img.id"  ref = "image"
            @:dragover= "(e)=>{
                this.over = e.target.id
            }">


            <div class = "barsContainer" ref = "bars" v-bind:id = "`bar`+img.id">
                <div v-if = "img.hasData" v-for = "elem in boardArray[img.id].data.bars" class = "bar" >{{ elem[0] }}</div>
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
                    editClicked:"false",
                    contexted : "false",
                    clicked : 0,
                    movedData:{src:"",id:"",movedFrom:"",dataState:false,barsData:{name:"",perc:0,color:"green"}},
                    over:``,
                    tokenArray:[],
                    boardArray:[],
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
                    dataState:"true"
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
                    //token selection
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
                e.preventDefault();
                 if (this.boardArray[e.target.id].hasData === "true") {
                this.contexted = "true"
                var element = document.createElement("div")
                    var menuEdit = document.createElement("div")
                    var windowEdit = document.createElement("div")
                        var addButton = document.createElement("div")
                        //var bar = document.createElement("div")

                if (this.clicked === 0 ) {
                    this.clicked = 1
                   
                    //menu
                document.body.appendChild(element)
                    element.className = "contextMenu"
                    element.style.left = e.clientX + 50 + `px`
                    element.style.top = e.clientY + `px`
                    

                        //buttons
                            //edit button
                        menuEdit.className = "contextButton menuEditButton"
                        menuEdit.innerHTML = "edit"
                        element.appendChild(menuEdit)

                      
                        //edit button listener
                            menuEdit.addEventListener("click",async (eve)=>{
                            this.editClicked = "true"
                                
                                    windowEdit.style.left = eve.clientX - 100 + `px`
                                    windowEdit.style.top = eve.clientY + `px`
                                    windowEdit.className = "windowEdit"
                                    document.body.appendChild(windowEdit)

                                    
                                    addButton.className = "button EditMenuaddButton"
                                    addButton.style.left = eve.clientX - 95 + `px`
                                    addButton.style.top = eve.clientY + 5 + `px`
                                    document.body.appendChild(addButton)

                                  

                                    // downloading of a existing bars
                                            //here should be creation of the node elements
                                            const respons1 = await fetch("http://localhost:2137/giveBarData",{
                                            method:"POST",
                                            headers:{"Content-Type": "application/json"},
                                            body:JSON.stringify({
                                            color:"",
                                            id:e.target.id,
                                            bar:[],
                                            posY:10
                                        })
                                        }); 
                                            const respons1Data = await respons1.json()
                                            var barsCount = respons1Data.bars.length
                                            
                                            for (let i = 0; i < barsCount; i++) {
                                                document.body.appendChild(Object.assign(document.createElement('input'), {
                                                className :"barMenu",
                                                style:""
                                        }))
                                                
                                            }
                                            
                                        var bar = document.querySelectorAll(".barMenu")
                                            for (let i = 0; i < bar.length; i++) {
                                                bar[i].style.left = e.clientX + 20 + `px`
                                                bar[i].style.top = e.clientY + 25 + (15*i) + `px`
                                        }

                                    //adding a new bar
                                        //clientside
                                    addButton.addEventListener("click",async (eveB)=>{
                                            //fetch for bars count
                                          const barsLengthReq = await   fetch("http://localhost:2137/giveBarsLength",{
                                            method:"POST",
                                            headers:{"Content-Type": "application/json"},
                                            body:JSON.stringify({
                                                id:e.target.id
                                            })
                                        });
                                        const barsLength = await barsLengthReq.json()
                                        console.log(barsLength)


                                        if (barsLength.dat < 3) {
                                            document.body.appendChild(Object.assign(document.createElement('input'), {
                                                className :"barMenu",
                                                style:""
                                        }))
                                        var bar = document.querySelectorAll(".barMenu")
                                            for (let i = 0; i < bar.length; i++) {
                                                bar[i].style.left = e.clientX + 20 + `px`
                                                bar[i].style.top = e.clientY + 25 + (15*i) + `px`
                                        }
                                        console.log(e.target.getBoundingClientRect().x)

                                        //editing bar data and sending them to a server
                                                //for adding new one
                                     var barNew = document.querySelectorAll(".barMenu")
                                                barNew[barNew.length-1].addEventListener("input",async (eveC)=>{
                                                console.log(eveC.target)

                                                const responsBarDataMenu0 = await fetch("http://localhost:2137/sendBarDataMenuToBoard",{
                                                method:"POST",
                                                headers:{"Content-Type": "application/json"},
                                                body:JSON.stringify({
                                                color:"",
                                                id:e.target.id,
                                                barNumber:barNew.length-1,
                                                value:eveC.target.value
                                            })
                                        });
                                            })
                                            
                                        
                                      
                                            //serverside
                                        const respons2 = await fetch("http://localhost:2137/sendBarData",{
                                            method:"POST",
                                            headers:{"Content-Type": "application/json"},
                                            body:JSON.stringify({
                                            color:"",
                                            id:e.target.id,
                                            bar:[],
                                            posY:10
                                        })
                                        });
                                        }
                                        
                                    })
                                     //editing bar data and sending them to a server
                                        //for all of the old ones
                                     var bar = document.querySelectorAll(".barMenu")
                                            for (let i = 0; i < bar.length; i++) {
                                            bar[i].addEventListener("input",async (eveC)=>{
                                                const responsBarDataMenu1 = await fetch("http://localhost:2137/sendBarDataMenuToBoard",{
                                                method:"POST",
                                                headers:{"Content-Type": "application/json"},
                                                body:JSON.stringify({
                                                color:"",
                                                id:e.target.id,
                                                barNumber:i,
                                                value:eveC.target.value
                                            })
                                        });
                                            })
                                                
                                            }

                                    
                        })
                        
                     


                        //del button
                    var menuDel = document.createElement("div")
                        menuDel.className = "contextButton menuDel"
                        menuDel.innerHTML = "delete"
                        element.appendChild(menuDel)


                           //reset button
                    var menuReset = document.createElement("div")
                        menuReset.className = "contextButton menuReset"
                        menuReset.innerHTML = "reset"
                        element.appendChild(menuReset)
                        


                } else {
                    var contextMenuRem = document.querySelector(".contextMenu")
                    document.body.removeChild(contextMenuRem)
                        //remove any menu element if clicked
                            //edit menu
                    if (this.editClicked === "true") {
                            var removeEditButton = document.querySelector(".windowEdit")
                            var removeAddButton = document.querySelector(".EditMenuaddButton")
                            var removemenuBarButton = document.querySelectorAll(".barMenu")
                                document.body.removeChild(removeAddButton)
                                document.body.removeChild(removeEditButton)
                                for (let i = 0; i <removemenuBarButton.length; i++) {
                                    document.body.removeChild(removemenuBarButton[i])
                                    
                                }
                                
    
                        this.editClicked = "false"
                        
                    }
                    
                    this.clicked = 0
                    this.contexted = "false"
                }
                 }
              
               

                
                
        


            },
            cancelMenu(){
                if (this.contexted === "true") {
                    var contextMenuRem = document.querySelector(".contextMenu")
                    document.body.removeChild(contextMenuRem)
                        //remove any menu element if clicked
                            //edit menu
                    if (this.editClicked === "true") {
                            var removeEditButton = document.querySelector(".windowEdit")
                            var removeAddButton = document.querySelector(".EditMenuaddButton")
                            var removemenuBarButton = document.querySelectorAll(".barMenu")
                                document.body.removeChild(removeAddButton)
                                document.body.removeChild(removeEditButton)
                                for (let i = 0; i <removemenuBarButton.length; i++) {
                                    document.body.removeChild(removemenuBarButton[i])
                                    
                                }
                                
    
                        this.editClicked = "false"
                        
                    }
                    
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
    height:900px;
    width:1200px;
    overflow: hidden;

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
    position: absolute;
    overflow: hidden;
    
    height:900px;
    width:1200px;

    display:flex;
    flex-wrap: wrap;
    align-content:center;
    justify-content: center;
    flex-direction:column
  }
.imageDiv{
    display: flex;
    align-content:center;
    justify-content:center;

    width:50px;
    height:50px;
    border-style: ridge;
    border-width:1px;
    display:flex;
    flex-wrap: wrap;

   
    
}
.contextMenu{
    position: absolute;
    width:60px;
    height:250px;

    border-style:ridge;
    border-width: 1px;
    border-color: black;

    background-color: rgb(233, 226, 214);
}
.bar{
    width:50px;
    height:8px;
    border-style:ridge;
    border-width: 1px;
    border-color: black;

    font-size: 10px;

    text-align: center;
    margin-bottom: 3px;
}

.barsContainer{
    width:50xp;
    height:50px;
    position: relative;
    bottom:40px;
    flex-direction: column;
}
.image{
    width:50px;
    height:50px;
    position: absolute;
  
}
.contextButton{
    width:60px;
    height:30px;
    border-width: 1px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-style:solid;
    border-color:black;


    display:flex;
    align-items:center;
    justify-content: center;
}
.windowEdit{
    width:250px;
    height:360px;
    border-width: 1px;

    border-style:solid;
    border-color:black;
    background-color: antiquewhite;

    position:absolute;

    display:flex;
    align-items:center;
    justify-content: center;
}
.button{
    width:15px;
    height:15px;
    border-width: 1px;

    border-style:solid;
    border-color:black;
    background-color: antiquewhite;

    position:absolute;

   
}
.barMenu{
    width:150px;
    height:9px;
    border-width: 1px;

    border-style:solid;
    border-color:black;
    background-color: white;
    display:flex;
    position:absolute;
}
</style>