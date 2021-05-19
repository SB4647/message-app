import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDJGvGadbC39ts7iIYZiuIlD0ya4tHBMzs",
    authDomain: "message-app-a2548.firebaseapp.com",
    projectId: "message-app-a2548",
    storageBucket: "message-app-a2548.appspot.com",
    messagingSenderId: "550965648748",
    appId: "1:550965648748:web:528862ab064d0c60296749",
    measurementId: "G-ZE3NQW21ZP",
});

const db = firebaseApp.firestore();

export default db;
