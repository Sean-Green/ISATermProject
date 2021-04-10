    function Signup() {
        let user = document.getElementById("userInput").value;
        let pass = document.getElementById("passInput").value;
        if(user && pass){
            const url = "http://sean-green-cst.com/quarterKings/v1/signup";
            var http = new XMLHttpRequest;
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.onload = () => {console.log(`${http.status} ${http.responseText}`)};
            http.send(JSON.stringify({name : user, password : pass}));
        }
    }



    function Login(){
        let user = document.getElementById("userInput").value;
        let pass = document.getElementById("passInput").value;
        if(user && pass){
            const url = "http://sean-green-cst.com/quarterKings/v1/login";
            var http = new XMLHttpRequest;
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.send(JSON.stringify({name : user, password : pass}));
            http.onload = () => { if(http.status == 200){
                                    window.location.href = "./docs.html";
                                }
                                }
    }
}

    document.getElementById("loginBtn").onclick = Login;
    document.getElementById("signinBtn").onclick = Signup;