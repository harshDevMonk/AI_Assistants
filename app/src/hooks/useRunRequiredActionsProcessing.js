import { useEffect } from 'react';
import { postToolResponse } from "../services/api";
import { useRecoilValue } from 'recoil';
import { assistantIdState } from '../atoms';

export const useRunRequiredActionsProcessing = (setRun, setActionMessages) => {
    const assistantID = useRecoilValue(assistantIdState)
    const run = localStorage.getItem(`${assistantID}_run`);

    useEffect(() => {
        if (run?.status === "requires_action") {
            let response = [];
            let actionMessages = [];
            for (const tool_call of run.required_action.submit_tool_outputs.tool_calls) {
                if (tool_call.function.name === "embed_youtube_video") {
                    response.push({
                        tool_call_id: tool_call.id,
                        output: "{'success': true}"
                    });

                    const url = JSON.parse(tool_call.function.arguments).url;
                    actionMessages.push({
                        id: `video_embedding_${url}_${Date.now()}`,
                        content: url,
                        role: "video_embedding",
                        created_at: Math.floor(Date.now() / 1000)
                    });
                }
            }
            setActionMessages(actionMessages);
            postToolResponse(run.thread_id, run.run_id, response, assistantID).then(setRun);
        }
    }, [run, setRun, assistantID]);
};
