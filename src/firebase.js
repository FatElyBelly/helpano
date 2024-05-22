import firebase from "firebase/app";

import "firebase/auth";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCollOLeLRq0dXXDrf8KhO7Vb_ST8kvm6w",
  authDomain: "helpano.firebaseapp.com",
  projectId: "helpano",
  storageBucket: "helpano.appspot.com",
  messagingSenderId: "799789009587",
  appId: "1:799789009587:web:7dda3a66f93c4784f87ec6",
  measurementId: "G-D5384JS0KG"
})

const db = firebase.firestore()
const auth = firebase.auth()

export {auth, db}