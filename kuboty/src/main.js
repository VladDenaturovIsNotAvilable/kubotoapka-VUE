//import any css here :)

import { createApp } from 'vue'
import App from './App.vue'
import Chat from './components/Chat.vue'
import TokenField from './components/TokenField.vue'


const app = createApp(App)
app.component('Chat', Chat)
app.component('TokenField', TokenField)
app.mount('#app')
