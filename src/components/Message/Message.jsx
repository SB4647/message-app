import React, { forwardRef } from "react";
import { Card, CardContent, Typography, Box } from "@material-ui/core";
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
                    <Typography variant="p" component="p" fontSize="1rem">
                        <Box fontWeight="fontWeightBold" display="inline">
                            {!isUser &&
                                `${message.username || "Unknown User"}: `}
                        </Box>
                        {message.message}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
});

export default Message;
