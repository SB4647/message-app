import { useState, useEffect, useRef } from "react";
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
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");

    const messagesEndRef = useRef(null);

    const addBotReply = () => {
        //add bot reply message to firestore database with timestamp
        db.collection("message").add({
            message: "Thank you. Feel free to send another message.",
            username: "Bot",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    };

    useEffect(() => {
        //clear all messages in database when app first loads
        (async () => {
            const response = await db.collection("message").get();
            await response.forEach((element) => {
                element.ref.delete();
            });

            //add intro message to database and firestore snapshot listener after all messages cleared from firestore database
            if (await response) {
                db.collection("message").add({
                    message:
                        "Hey there! To test this application, type a message at the bottom of page and press the send button. All messages are stored in a firebase database until the clear button is clicked or the application is restarted",
                    username: "Bot",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });

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

                //ask user for user name using a prompt
                setUsername(prompt("Please enter your name"));
            }
        })();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        //add user input message to firestore database with timestamp
        db.collection("message").add({
            message: input,
            username: username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        //add bot reply message
        addBotReply();
        //reset input state
        setInput("");
    };

    const clearMessages = async () => {
        const response = await db.collection("message").get();
        await response.forEach((element) => {
            element.ref.delete();
        });
    };

    return (
        <div className={styles.App}>
            <div className={styles.app__header}>
                <div className={styles.app__clearButton}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={clearMessages}
                    >
                        Clear Messages
                    </Button>
                </div>

                <h1 className={styles.app__heading}>Message App</h1>
                <h2
                    className={styles.app__subHeading}
                >{`Welcome ${username}!`}</h2>
            </div>

            <div className={styles.app__messages}>
                <FlipMove>
                    {messages.map(({ id, message }, index) => (
                        <Message
                            key={id}
                            username={username}
                            message={message}
                        />
                    ))}
                </FlipMove>
                <div ref={messagesEndRef} />
            </div>

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
        </div>
    );
};

export default App;
