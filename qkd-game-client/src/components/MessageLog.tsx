import { useEffect, useRef, useState } from 'react';

interface IProps {
    messages: string[];
}

function MessageLog(props: IProps) {
    const [prevScrollTop, setPrevScrollTop] = useState(0);
    const messageLogRef = useRef<HTMLDivElement>(null);

    // After a new message is added scroll to the bottom.
    useEffect(() => {
        scrollToBottom();
    }, [props.messages]);

    // TODO fix so it only scrolls to bottom when you already are at the bottom.
    function scrollToBottom() {
        const messageLog = messageLogRef.current;
        if (messageLog) {
            const curScrollTop = messageLog.scrollTop;
            if (prevScrollTop === curScrollTop) {
                const scroll =
                    messageLog.scrollHeight - messageLog.clientHeight;
                messageLog.scrollTo(0, scroll);
                setPrevScrollTop(messageLog.scrollTop);
            }
        }
    }

    function getMessages() {
        const messages: JSX.Element[] = [];

        for (let i = 0; i < props.messages.length; i++) {
            const message = props.messages[i];
            messages.push(
                <div className="my-2" key={i}>
                    {message}
                </div>
            );
        }

        return messages;
    }

    return (
        <div
            ref={messageLogRef}
            className="flex flex-col border-2 overflow-y-scroll w-full h-72"
        >
            {getMessages()}
        </div>
    );
}

export default MessageLog;
