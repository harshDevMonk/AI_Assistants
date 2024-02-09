import { useState, useEffect } from 'react';
import { createNewThread, fetchThread } from "../services/api";
import { runFinishedStates } from "./constants";
import { useRecoilValue } from 'recoil';
import { assistantIdState } from '../atoms';

export const useThread = (run, setRun) => {
    const assistantID = useRecoilValue(assistantIdState)
    const [threadId, setThreadId] = useState(undefined);
    const [thread, setThread] = useState(undefined);
    const [actionMessages, setActionMessages] = useState([]);
    const [messages, setMessages] = useState([]);

    // This hook is responsible for creating a new thread if one doesn't exist
    useEffect(() => {
        const localThreadId = localStorage.getItem(`${assistantID}_thread_id`);
        if (localThreadId) {
            // localStorage.clear();
            console.log(`Resuming thread ${localThreadId}`);
            const localRunString = localStorage.getItem(`${assistantID}_run`);
            const localRun = JSON.parse(localRunString); // Parse the string to get the object
            setThreadId(localThreadId);
            setRun(localRun);
            localStorage.setItem(`${assistantID}_runId`, localRun.run_id); // Store the object as a string

            console.log("localRun ", localRun); // Now localRun will be an object
            fetchThread(localThreadId, assistantID).then(setThread);
        } else {
            console.log("Creating new thread");
            createNewThread(assistantID).then((data) => {
                setRun(data);
                setThreadId(data.thread_id);
                localStorage.setItem(`${assistantID}_thread_id`, data.thread_id);
                localStorage.setItem(`${assistantID}_run`, JSON.stringify(data)); // Store the object as a string
                localStorage.setItem(`${assistantID}_runId`, data.run_id); // Store the object as a string
                console.log(`Created new thread ${data.thread_id}`);
                console.log("`${assistantID}_run` " + JSON.stringify(data));
            });
        }
    }, [assistantID, threadId, setThreadId, setThread, setRun]);


    // This hook is responsible for fetching the thread when the run is finished
    useEffect(() => {
        if (!run || !runFinishedStates.includes(run.status)) {
            return;
        }

        console.log(`Retrieving thread ${run.thread_id}`);
        fetchThread(run.thread_id, assistantID)
            .then((threadData) => {
                setThread(threadData);
            });
    }, [run, runFinishedStates, setThread]);

    // This hook is responsible for transforming the thread into a list of messages
    useEffect(() => {
        if (!thread) {
            return;
        }
        console.log(`Transforming thread into messages`);

        let newMessages = [...thread.messages, ...actionMessages]
            .sort((a, b) => a.created_at - b.created_at)
            .filter((message) => message.hidden !== true)
        setMessages(newMessages);
    }, [thread, actionMessages, setMessages]);

    const clearThread = () => {
        // localStorage.removeItem("thread_id");

        setThreadId(undefined);
        setThread(undefined);
        setRun(undefined);
        setMessages([]);
        setActionMessages([]);
        localStorage.removeItem(`${assistantID}_thread_id`);
        localStorage.removeItem(`${assistantID}_runId`);
    }

    return {
        threadId,
        messages,
        actionMessages,
        setActionMessages,
        clearThread
    };
};