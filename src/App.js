import { useState, useEffect } from "react";
import {
    Button,
    FormControl,
    InputLabel,
    Input,
    IconButton,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import Message from "./components/Message";
import styles from "./App.module.scss";
import db from "./firebase";
import firebase from "firebase";
import FlipMove from "react-flip-move";

const App = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { username: "Stephen", message: "Hey" },
        { username: "Tom", message: "Sup" },
    ]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        //add firestore listener which updates "messages" state when a new document is added to firestore database.
        //messages in database are ordered by timestamp
        db.collection("message")
            .orderBy("timestamp")
            .onSnapshot((snapshot) => {
                setMessages(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        message: doc.data(),
                    }))
                );
            });
    }, []);

    useEffect(() => {
        setUsername(prompt("Please enter your name"));
    }, []);

    console.log(input);
    console.log(messages);

    const sendMessage = (event) => {
        event.preventDefault();

        db.collection("message").add({
            message: input,
            username: username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setMessages([...messages, { username: username, message: input }]);
        setInput("");
    };

    return (
        <div className={styles.App}>
            <h1>Message App</h1>
            <h2>Welcome {username}</h2>
            <form className={styles.app__form}>
                <FormControl className={styles.app_formControl}>
                    <InputLabel>Enter a message...</InputLabel>
                    <Input
                        className={styles.app__input}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                    />
                    <IconButton
                        className={styles.app__iconButton}
                        disabled={!input}
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={sendMessage}
                    >
                        <SendIcon />
                    </IconButton>
                </FormControl>
            </form>

            <FlipMove>
                {messages.map(({ id, message }) => (
                    <Message key={id} username={username} message={message} />
                ))}
            </FlipMove>
        </div>
    );
};

export default App;
