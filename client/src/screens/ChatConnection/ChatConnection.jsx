import React from 'react';
import { useParams } from 'react-router-dom';

const ChatConnection = () => {
    const { id } = useParams();

    return (
        <div className="chat-connection">
            <h2>You connected with Shreya</h2>
            <p>Message Shreya to make plans with your potential roommate.</p>
            <div className="chat-input">
                <input type="text" placeholder="Type a message" />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatConnection;
