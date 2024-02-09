import React, { useEffect, useState } from 'react';
import './App.css';
import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import ChatVideoEmbedding from "./components/ChatVideoEmbedding";
import ChatStatusIndicator from "./components/ChatStatusIndicator";
import Loading from "./components/Loading";
import { useThread } from './hooks/useThread';
import { useRunPolling } from './hooks/useRunPolling';
import { useRunRequiredActionsProcessing } from './hooks/useRunRequiredActionsProcessing';
import { useRunStatus } from './hooks/useRunStatus';
import { postMessage } from "./services/api";
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { assistantIdState, routeTitleState } from './atoms';

function App() {
    const [run, setRun] = useState(undefined);
    const { threadId, messages, setActionMessages, clearThread } = useThread(run, setRun);
    useRunPolling(threadId, run, setRun);
    useRunRequiredActionsProcessing(run, setRun, setActionMessages);
    const { status, processing } = useRunStatus(run);
    const location = useLocation()
    const [title, setTitle] = useRecoilState(routeTitleState);
    const [assistantID, setAssistantID] = useRecoilState(assistantIdState);

    useEffect(() => {
        if (location.pathname === '/interview-prep-assistant') {
            setTitle('Interview Prep Assistant');
            setAssistantID('asst_XDtFo3J5Q7v6h63W7qojjM9J')
        }
        else if (location.pathname === '/cv-cover-letter-assistant') {
            setTitle('CV & Cover Letter Assistant');
            setAssistantID('asst_WH2evt3U80YHKn7fmlBWls0i')
        }
        else if (location.pathname === '/email-assistant') {
            setTitle('Email Assistant');
            setAssistantID('asst_ssU4hlyQkeamTeFpGi9a16zy')
        }
    }, [location.pathname, setTitle, setAssistantID]);


    // useEffect(() => {
    //     // Check if it's the initial render
    //     localStorage.clear();
    //     localStorage.setItem('hasClearedLocalStorage', 'true');
    //     console.log("clear");
    //     if (localStorage.getItem('hasClearedLocalStorage') !== 'true') {
    //         localStorage.clear();
    //         localStorage.setItem('hasClearedLocalStorage', 'true');
    //     }
    // }, []);


    let messageList = messages
        .toReversed()
        .filter((message) => message.hidden !== true)
        .map((message) => {
            if (message.role === "video_embedding") {
                return <ChatVideoEmbedding
                    url={message.content}
                    key={message.id}
                />
            } else {
                return <ChatMessage
                    message={message.content}
                    role={message.role}
                    key={message.id}
                />
            }
        })

    return (
        <div className="md:container md:mx-auto lg:px-32 h-screen bg-white-700 flex flex-col">
            <Header
                onNewChat={clearThread}
            />
            <div className="flex flex-col-reverse grow overflow-scroll">
                {status !== undefined && (
                    <ChatStatusIndicator
                        status={status}
                    />
                )}
                {processing && <Loading />}
                {messageList}
            </div>
            <div className="my-4">
                <ChatInput
                    onSend={(message) => {
                        postMessage(threadId, message, assistantID).then(setRun);
                        console.log("SetRun = " + JSON.stringify(run));
                    }}
                    disabled={processing}
                />
            </div>
        </div>
    )
}

export default App;
