import React, { forwardRef } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import styles from "./Message.module.scss";

const Message = forwardRef(({ message, username }, ref) => {
    const isUser = username === message.username;
    return (
        <div
            ref={ref}
            className={`${styles.message} ${isUser && styles.message__user}`}
        >
            <Card
                className={
                    isUser
                        ? styles.message__userCard
                        : styles.message__guestCard
                }
            >
                <CardContent>
                    <Typography
                        color="white"
                        variant="p"
                        component="p"
                        fontSize="1rem"
                    >
                        {!isUser && `${message.username || "Unknown User"}: `}
                        {message.message}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
});

export default Message;
