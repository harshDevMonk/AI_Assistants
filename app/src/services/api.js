// const assistant_id = 'asst_XDtFo3J5Q7v6h63W7qojjM9J'
export const createNewThread = async (assistant_id) => {
    try {
        let response = await fetch(`http://localhost:5000/api/new/${assistant_id}`, {
            method: "POST"
        })
        return response.json()
    } catch (err) {
        console.log(err.message)
    }
}

export const fetchThread = async (threadId, assistant_id) => {
    try {
        let response = await fetch(`http://localhost:5000/api/threads/${threadId}/${assistant_id}`)
        return response.json()
    } catch (err) {
        console.log(err.message)
    }
}

export const fetchRun = async (threadId, runId, assistant_id) => {
    try {
        let response = await fetch(`http://localhost:5000/api/threads/${threadId}/runs/${runId}/${assistant_id}`)
        return response.json()
    } catch (err) {
        console.log(err.message)
    }
}

export const postMessage = async (threadId, message, assistant_id) => {
    try {
        let response = await fetch(`http://localhost:5000/api/threads/${threadId}/${assistant_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: message })
        })
        console.log("postmessages = " + JSON.stringify(message));
        return response.json()
    } catch (err) {
        console.log(err.message)
    }
}

export const postToolResponse = async (threadId, runId, toolResponses, assistant_id) => {
    try {
        let response = await fetch(`http://localhost:5000/api/threads/${threadId}/runs/${runId}/tool/${assistant_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toolResponses)
        })
        return response.json()
    } catch (err) {
        console.log(err.message)
    }
}