    String.prototype.hashCode = function() {
        var hash = 0;
        if (this.length == 0) {
            return hash;
        }  
        for (var i = 0; i < this.length; i++) {
            var char = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }   
    
    
    function Signup() {
        let user = document.getElementById("userInput").value;
        let pass = document.getElementById("passInput").value;
        pass = pass.hashCode();
        if(validateEmail(user)){ 
        if(user && pass){
            const url = "http://sean-green-cst.com/quarterKings/v1/signup";
            var http = new XMLHttpRequest;
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.send(JSON.stringify({name : user, password : pass}));
            http.onload = () =>{ if(http.status == 201){
                let domain = "https://www.johnnyscott.ca"
                const url = "http://sean-green-cst.com/quarterKings/v1/generate";
                http.open("POST", url, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                http.send(JSON.stringify({name : user, password : pass, domain: domain}));
                http.onload = () =>{ 
                window.location.href = "./apikey.html";
                localStorage.setItem("userInfo", JSON.stringify({name : user, password : pass}))
            }
            }
            }
        }
    } else {
        var x = document.getElementById("errorLogin");
        x.style.display = "block";
        x.innerHTML = "Invalid Email."
    }
        console.log(validateEmail(user))
    }



    function Login(){
        let user = document.getElementById("userInput").value;
        let pass = document.getElementById("passInput").value;
        pass = pass.hashCode();
        if(validateEmail(user)){ 
        if(user && pass){
            const url = "http://sean-green-cst.com/quarterKings/v1/login";
            var http = new XMLHttpRequest;
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.send(JSON.stringify({name : user, password : pass}));
            http.onload = () => { if(http.status == 200){
                                    window.location.href = "./apikey.html";
                                    localStorage.setItem("userInfo", JSON.stringify({name : user, password : pass}))
                                } else {
                                        var x = document.getElementById("errorLogin");
                                        x.style.display = "block";
                                        x.innerHTML = "Invalid Email/Password, try again or sign up."
                                }
                        }
        }
    } else {
        var x = document.getElementById("errorLogin");
        x.style.display = "block";
        x.innerHTML = "Invalid Email."
    }
    console.log(validateEmail(user))
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

    document.getElementById("loginBtn").onclick = Login;
    document.getElementById("signinBtn").onclick = Signup;