import firebase from "firebase"
import React, { Component } from 'react'
import { auth, db } from '../firebase'
import Header from './Header.js'
import { faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dummypfp from '../img/dummypfp.png'
import ollama from 'ollama'

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      sidenavOpen: false,
      rightSidenavOpen: false,
      userSettingsOpen: false,
      msg: '',
      currentUsername: 'user',
      userDocID: '',
      currentUserMod: false,
      currentMessage: {
        text: 'test',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: '',
        uid: '',
        username: 'user',
      },
      currentMessageFormattedDate: '',
      currentMessageFormattedTime: '',
    }
    this.scroll = React.createRef()
  }

  scrollDown = () => {
    this.scroll.current.scrollIntoView()
  }

  getUsername = () => {
    const query = db.collection("users")
    query.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid == auth.currentUser.uid) {
          this.setState({
            currentUsername: doc.data().username
          })
        }
      })
    })
  }

  getMessages = () => {
    setTimeout(() => {
      this.setState({
        messages: [],
      })
      const query = db.collection('messages').orderBy('createdAt');
      query.onSnapshot((snapshot) => {
        var list = []
        snapshot.docs.forEach(doc => {
          list.push(doc.data())
        })
        this.setState({
          messages: list
        })
      })
    }, 10)
    this.scrollDown()
  }


  sendMessage = (e) => {
    this.setState({
      msg: ''
    })
    e.preventDefault()
    const { uid, photoURL } = auth.currentUser
    if (!(this.state.msg.replace(/\s/g, '').length == 0)) {
      const query = db.collection('messages')
      query.add({
        text: this.state.msg,
        photoURL,
        uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        messageid: this.generateID(20),
      })
      this.generateAnswer(this.state.msg)
    }
    this.scrollDown()
  }

  addUserDataSignIn = () => {
    const query = db.collection('users')
    var userAlreadyIn = false
    query.onSnapshot((snapshot) => {
      snapshot.docs.forEach(doc => {
        if (doc.data().uid == auth.currentUser.uid) {
          userAlreadyIn = true
        }
      })
      if (userAlreadyIn == false) {
        query.add({
          email: auth.currentUser.email,
          photoURL: auth.currentUser.photoURL,
          uid: auth.currentUser.uid,
          username: this.state.currentUsername,
        })
      }
    })
  }

  componentDidMount() {
    this.getUserID()
    this.getUsername()
    this.resetGroupComponents()
  }

  resetGroupComponents = () => {
    this.getMessages()
    this.scrollDown()
  }

  setSideNav = (setSidenav) => {
    this.setState({
      sidenavOpen: setSidenav,
    })
    if (setSidenav) {
      document.getElementById("sideNav").style.width = "275px"
      document.getElementById("menuButton").innerHTML = "<i class='fa fa-times fa-3x'></i>"

      document.getElementById("messageInput").style.width = "66%"

      document.getElementById("main").style.marginLeft = "220px"
      setTimeout(() => { this.openMenuDiv() }, 370)
    } else {
      document.getElementById("sideNav").style.width = "55px"
      document.getElementById("menuButton").innerHTML = "<i class='fa fa-bars fa-3x'></i>"

      document.getElementById("main").style.marginLeft = "0px"

      document.getElementById("messageInput").style.width = "80%"

      this.closeMenuDiv()
    }
  }

  setRightSideNav = (setSidenav) => {
    this.setState({
      rightSidenavOpen: setSidenav,
    })
    if (setSidenav) {
      document.getElementById("rightSideNav").style.width = "275px"
      document.getElementById("main").style.marginRight = "270px"
    } else {
      document.getElementById("rightSideNav").style.width = "0px"
      document.getElementById("main").style.marginRight = "0px"
    }
  }

  openMenuDiv = () => {
    document.getElementById("menuDiv").style.display = "inline-block"
  }
  closeMenuDiv = () => {
    document.getElementById("menuDiv").style.display = "none"
  }

  getUserID = () => {
    const query = db.collection("users")
    query.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid == auth.currentUser.uid) {
          this.setState({
            userDocID: doc.id
          })
        }
      })
    })
  }


  getMessageInfo = (newMessageid) => {
    var currentMessageObject = this.state.currentMessage
    const messageRef = db.collection("messages")
    messageRef.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().messageid == newMessageid) {
          currentMessageObject = doc.data()
        }
      })
    })

    const userRef = db.collection("users")
    userRef.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid == currentMessageObject.uid) {
          var currentUsername = doc.data().username
          if (currentUsername.length > 13) {
            var changeUsername = ''
            for (let i = 0; i < 11; i++) {
              changeUsername += currentUsername[i]
            }
            changeUsername += '..'
            currentUsername = changeUsername
          }
          currentMessageObject.username = currentUsername
        }
      })
      var messageDate = currentMessageObject.createdAt.toDate()
      var messageDateDay = messageDate.getDate()
      var messageMonth = messageDate.getMonth() + 1
      var messageYear = messageDate.getFullYear()
      var formattedMessageDate = messageDateDay + '/' + messageMonth + '/' + messageYear
      var messageHour = messageDate.getHours()
      var messageMinute = messageDate.getMinutes()
      var formattedMessageTime = messageHour + ':' + messageMinute

      this.setState({
        currentMessage: currentMessageObject,
        currentMessageFormattedDate: formattedMessageDate,
        currentMessageFormattedTime: formattedMessageTime,
      })
    })

  }

  generateID = (n) => {
    var add = 1, max = 12 - add
    if (n > max) {
      return this.generateID(max) + this.generateID(n - max)
    }
    max = Math.pow(10, n + add)
    var min = max / 10
    var number = Math.floor(Math.random() * (max - min + 1)) + min
    return ("" + number).substring(add)
  }

  generateAnswer = async (msg) => {
    console.log("Starting AI")
    const response = await ollama.chat({
      model: 'llama2',
      messages: [{ role: 'user', content: msg }],
    })
    console.log(response.message.content)
  }

  render() {
    return (
      <div className="chat">
        <Header />
        {/* Sidenav */}
        <div id="sideNav" className="sideNav">
          <div className="sideNavButtons">
            <center>
              {/* Menu button */}
              <button id="menuButton" onClick={() => {
                if (this.state.sidenavOpen) {
                  this.setSideNav(false)
                } else {
                  this.setSideNav(true)
                }
              }}>
                <i class='fa fa-bars fa-3x'></i>
              </button>

              {/* Info button */}
              <button onClick={() => {
                window.open('https://elias.helfand.repl.co/', '_blank');
              }}><i class="fa fa-info-circle fa-3x"></i></button>
              <a onClick={this.scrollDown}>
                <div className="scrollDownDiv">
                  <div class='scrolldown'>
                    <div class="chevrons">
                      <div class='chevrondown'></div>
                      <div class='chevrondown'></div>
                    </div>
                  </div>
                </div>
              </a>
            </center>
          </div>

          <div className="menuDiv" id="menuDiv">
            {/* User settings */}
            <div className="userSettingsDiv">
              <center><span>{this.state.currentUsername}</span></center>
              <center><img id="menuPfp" src={dummypfp}/></center>
              <center>
                <button onClick={
                  () => {
                    this.setSideNav(false)
                    this.setRightSideNav(false)
                  }
                }>Profile</button>
              </center>
              <center>
                <button onClick={
                  () => {
                    auth.signOut()
                  }
                }>Logout</button>
              </center>
            </div>
          </div>
        </div>

        {/* Right message sidenav */}
        <div id="rightSideNav" className="rightSideNav">
          <button className="rightSideNavCloseButton" onClick={() => {
            this.setRightSideNav(false)
          }}>
            <FontAwesomeIcon className="closeIcon" icon={faTimes} size="3x" color="white" />
          </button>
          <center>
            <div className={(this.state.currentMessage.uid === auth.currentUser.uid) ? 'myMessageDiv messageInfo' : 'messageDiv messageInfo'} id={(this.state.currentMessage.uid === "eKxKl6uQESeOeXvcM9LVp4IG0ta2") ? 'modMessage' : ''}>
              <img src={dummypfp} alt="Failed to load" />
              <p className="messageText">{this.state.currentMessage.text}</p>
            </div>
          </center>
          <center>
            <div className="messageInfoWrap">
              <p className="messageInfoText messageUsernameText" >User: <strong className="messageUsernameTextOnly">{this.state.currentMessage.username}</strong></p>
              <p className="messageInfoText dateText">Date: <strong>{this.state.currentMessageFormattedDate}</strong></p>
              <p className="messageInfoText timeText">Time: <strong>{this.state.currentMessageFormattedTime}</strong></p>
            </div>
          </center>
        </div>

        <div id="main">
          {/* Chat */}
          <div className="messages" id="messages">
            {this.state.messages.map(({ id, text, photoURL, uid, createdAt, messageid }) => (
              <div key={id}>
                <div className="messageDivWrapper">
                  <div className={(uid === auth.currentUser.uid) ? 'myMessageDiv' : 'messageDiv'} id={uid == "eKxKl6uQESeOeXvcM9LVp4IG0ta2" ? 'modMessage' : 'messageDivId'} onClick={() => {
                    this.getMessageInfo(messageid)
                    this.setRightSideNav(true)
                  }}>
                    <img src={dummypfp} alt="Failed to load" />
                    <p className="messageText">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={this.scroll} className="autoScrollDiv" id="autoScrollDiv"></div>

          {/* Send message */}
          <div className="messageInputDiv">
            <form class="messageInputForm" action={() => { return false }} onSubmit={this.sendMessage}>
              <input value={this.state.msg} onChange={(e) => this.setState({ msg: e.target.value })} type="text" className="messageInput" id="messageInput" placeholder="Message..." autoComplete="off" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat