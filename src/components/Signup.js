import React, { useRef } from 'react'
import firebase from "firebase"
import { auth, db } from '../firebase.js'
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Signup = () => {
    const emailRefSignup = useRef(null)
    const passwordRefSignup = useRef(null)
    const usernameRefSignup = useRef(null)
    const signup = e => {
        e.preventDefault()
        auth.createUserWithEmailAndPassword(
            emailRefSignup.current.value,
            passwordRefSignup.current.value
        ).then(user => {
            console.log('Logged in successfully!')
        }).catch(err => {
            console.log(err)
        })
    }

    const emailFocusSignup = () => {
        document.getElementById("emailInputDivSignup").style.backgroundColor = "rgb(88, 86, 214)"
        document.getElementById("emailInputDivSignup").style.border = "1px solid transparent"
        document.getElementById("emailIconSignup").style.color = "#fff"
        document.getElementById("emailInputSignup").classList.add("placeholderActive")
    }

    const emailUnfocusSignup = () => {
        document.getElementById("emailInputDivSignup").style.backgroundColor = "#172447"
        document.getElementById("emailInputSignup").classList.remove("placeholderActive")
    }

    const usernameUnfocusSignup = () => {
        document.getElementById("usernameInputDivSignup").style.backgroundColor = "#172447"
        document.getElementById("usernameInputSignup").classList.remove("placeholderActive")
    }

    const passwordFocusSignup = () => {
        document.getElementById("passwordInputDivSignup").style.backgroundColor = "rgb(88, 86, 214)"
        document.getElementById("passwordInputDivSignup").style.border = "1px solid transparent"
        document.getElementById("passwordIconSignup").style.color = "#fff"
        document.getElementById("passwordInputSignup").classList.add("placeholderActive")
    }

    const passwordUnfocusSignup = () => {
        document.getElementById("passwordInputDivSignup").style.backgroundColor = "#172447"
        document.getElementById("passwordInputSignup").classList.remove("placeholderActive")
    }

    return (
        <div className="signupPage">
            <div className="signupDiv" id="signupDiv">
                <form className="signupForm" autoComplete="off">
                    <h1 className="signupTitle">SIGNUP</h1>
                    <div className="signupInputs">
                        <div className="inputDiv" id="emailInputDivSignup">
                            <FontAwesomeIcon className="inputIcon" id="emailIconSignup" icon={faEnvelope} size="lg" color="#fff" />
                            <input onFocus={emailFocusSignup} onBlur={emailUnfocusSignup} id="emailInputSignup" className="loginInput" type="email" placeholder="Email" ref={emailRefSignup}/>
                        </div>

                        <div className="inputDiv" id="passwordInputDivSignup">
                            <FontAwesomeIcon className="inputIcon" id="passwordIconSignup" icon={faLock} size="lg" color="#fff" />
                            <input onFocus={passwordFocusSignup} onBlur={passwordUnfocusSignup} id="passwordInputSignup" className="loginInput" type="password" placeholder="Password" ref={passwordRefSignup}/>
                        </div>
                    </div>
                    <div className="lowerForm">
                        <a className="loginA">Forgot password</a>
                        <button className="loginButton" onClick={signup}>CONNECT</button>
                    </div>
                    <div className="lowerForm">
                        <p className="loginA">Already a member?</p>
                        <a className="loginA" onClick={() => {window.location.href="/login"}}>Login</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
