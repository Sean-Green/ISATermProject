

function Login(){
    let user = document.getElementById("userInput").value;
    let pass = document.getElementById("passInput").value;
    if(user && pass){
        const url = "https://www.sean-green-cst.com/quarterKings/v1/stats";
        var http = new XMLHttpRequest;
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(JSON.stringify({name : user, password : pass}));
        http.onload = () => { if(http.status == 200){
                                window.location.href = "./admin.html";
                            } else {
                                    var x = document.getElementById("errorLogin");
                                    x.style.display = "block";
                                    x.innerHTML = "Invalid Email/Password, try again or sign up."
                            }
                    }
    }
}

document.getElementById("loginBtn").onclick = Login;