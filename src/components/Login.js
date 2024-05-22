import React, { useRef } from 'react'
import { auth } from '../firebase.js'
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = () => {
    const emailRefLogin = useRef(null)
    const passwordRefLogin = useRef(null)
    const signin = e => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(
            emailRefLogin.current.value,
            passwordRefLogin.current.value
        ).then(user => {
            console.log('Logged in successfully!')
        }).catch(err => {
            console.log(err)
            let elems = document.querySelectorAll('.inputIcon');
            let elems2 = document.querySelectorAll('.inputDiv')
            for (var i=0;i<elems.length;i++){
                elems[i].style.color = 'red'
                elems2[i].style.border = '1px solid red'
            }
        })
    }

    const emailFocusLogin = () => {
        document.getElementById("emailInputDivLogin").style.backgroundColor = "rgb(88, 86, 214)"
        document.getElementById("emailInputDivLogin").style.border = "1px solid transparent"
        document.getElementById("emailIconLogin").style.color = "#fff"
        document.getElementById("emailInputLogin").classList.add("placeholderActive")
    }

    const emailUnfocusLogin = () => {
        document.getElementById("emailInputDivLogin").style.backgroundColor = "#172447"
        document.getElementById("emailInputLogin").classList.remove("placeholderActive")
    }

    const passwordFocusLogin = () => {
        document.getElementById("passwordInputDivLogin").style.backgroundColor = "rgb(88, 86, 214)"
        document.getElementById("passwordInputDivLogin").style.border = "1px solid transparent"
        document.getElementById("passwordIconLogin").style.color = "#fff"
        document.getElementById("passwordInputLogin").classList.add("placeholderActive")
    }

    const passwordUnfocusLogin = () => {
        document.getElementById("passwordInputDivLogin").style.backgroundColor = "#172447"
        document.getElementById("passwordInputLogin").classList.remove("placeholderActive")
    }

    return (
        <div className="loginPage">
            <div className="loginDiv" id="loginDiv">
                <form className="loginForm" autoComplete="off">
                    <h1 className="loginTitle">LOGIN</h1>
                    <div className="loginInputs">
                        <div className="inputDiv" id="emailInputDivLogin">
                            <FontAwesomeIcon className="inputIcon" id="emailIconSignup" icon={faEnvelope} size="lg" color="#fff" />
                            <input onFocus={emailFocusLogin} onBlur={emailUnfocusLogin} id="emailInputLogin" className="loginInput" type="email" placeholder="Email" ref={emailRefLogin}/>
                        </div>

                        <div className="inputDiv" id="passwordInputDivLogin">
                            <FontAwesomeIcon className="inputIcon" id="passwordIconSignup" icon={faLock} size="lg" color="#fff" />
                            <input onFocus={passwordFocusLogin} onBlur={passwordUnfocusLogin} id="passwordInputLogin" className="loginInput" type="password" placeholder="Password" ref={passwordRefLogin}/>
                        </div>
                    </div>
                    <div className="lowerForm">
                        <a className="loginA">Forgot password</a>
                        <button className="loginButton" onClick={signin}>CONNECT</button>
                    </div>
                    <div className="lowerForm">
                        <p className="loginA">Not a member?</p>
                        <a className="loginA" onClick={() => {window.location.href="/signup"}}>Join now</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
