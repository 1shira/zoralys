const myApp = {
	data() {
		return {
		};
	},
    methods:{
        getUserProfilePicture(){
            //will later ask the server for an image
            return "./images/user.png"
        },
        username(){
            //will get username
            let username = "UsernameThatIsTooLongToShow"
            if(username.length > 12){
                return username.substring(0,10) + "..."
            }
            return username
        }
    }
};
Vue.createApp(myApp).mount('#app');
