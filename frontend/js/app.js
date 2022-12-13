const myApp = {
	data() {
		return {
            //this ofc will come from a server, and will include more data
            animeList: ["Naruto", "Overlord","Bleach"]
		};
	},
    methods:{
        getUserProfilePicture(){
            //will later ask the server for an image
            return "./images/user.png"
        },
        username(){
            //will get username
            let username = "Username"
            if(username.length > 11){
                return username.substring(0,10) + "..."
            }
            return username
        }
    }
};
Vue.createApp(myApp).mount('#app');
