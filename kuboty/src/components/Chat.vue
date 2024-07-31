
<template>
    <div class = "chat">
        <div   class = "chatTextLog" readonly = "true">
            <div class = "messageLogDiv" v-for = "ele in msgArray"> 
                <img v-bind:src = "ele.messageUser.avatar"  alt = "" class = "chatAvatar"> 
                <div>{{ ele.messageUser.name +": " + ele.messageValue }}</div>
            </div>

        </div>
        <textarea v-model = "chatValue" class = "chatTextArea" maxlength = "500"  @:keydown = "postMessage" @:input = "saveMessage"></textarea>
    </div>
    
</template>

<script>
export default {
    data(){
        return{
            msgArray:[],
            message:"",
            chatValue:"",
            username:""
        }
    },
    mounted(){
        this.username = Math.random()
       // downlaoding a chat but with weeb sockets..its all cmoming together...yeaa...and i did it..
        var socket = new WebSocket("http://localhost:2138")
            socket.addEventListener("message", (eve) => { 
             var x = JSON.parse(eve.data)
                this.msgArray = x.chatlogValue
});
},
    
    
    methods:{
        //save message to a variable (just in case if i need to acces it later).
        saveMessage(eve){
             if (eve.data != null) { 
                this.message = this.message + eve.data
             } else if (eve.inputType != "deleteContentBackward"){
                this.message = ""
                this.chatValue = "";
                //console.log(eve)
             } else if ( eve.inputType === "deleteContentBackward" ){
                this.message = this.chatValue
                //console.log(this.message)
             }
        },
       
       
    //post message to a server
       async postMessage(eve){
        var image = new Image
        var canvas =  document.createElement("CANVAS")
        var ctx =  canvas.getContext("2d")

        // a little kek but this the easiest way lol
            image.src = 'avatars/papaj.png'
            ctx.drawImage(image,-25,0)
            var dataURL = canvas.toDataURL("image/png")
            
          

        if (this.chatValue != "") {
            if (eve.key == "Enter") {
            this.chatValue == " "
            const data = {
                messageUser : {
                    avatar:dataURL,
                    name:this.username
                },
                messageValue : this.message,
            }



            const response = await fetch("http://localhost:2137/sendMessage",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(data)
            }); 

            
           }
        }
        },
       

    }
}
</script>

<style>
.chat{
    display: block;
    width:384px;
}
    .chatTextLog{
        display:block;
        resize: none;
        width:380px;
        height:88vh;
        border-radius: 10px;
        border-width: 1px;
        border-color: black;
        border-style:groove;
    }

    .chatTextArea{
        border-radius: 10px;
        width:380px;
        height:7.4vh;
        display:block;
        resize: none;
    }
    .chatAvatar{
        display: block;
        width:45px;
        height:45px;
    }
    .messageLogDiv{
        display:flex;
    }
</style>