require('dotenv').config()
const express = require('express');
const { OpenAI } = require("openai");
const rootRouter = express.Router();
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});
// const assistant_id = "asst_XDtFo3J5Q7v6h63W7qojjM9J"
const run_finished_states = ["completed", "failed", "cancelled", "expired", "requires_action"];

function createRunStatus({ run_id, thread_id, status, required_action, last_error }) {
    return {
        run_id,
        thread_id,
        status,
        required_action,
        last_error
    };
}

function createThreadMessage({ content, role, hidden, id, created_at }) {
    return {
        content,
        role,
        hidden,
        id,
        created_at
    };
}

function createThread({ messages }) {
    return {
        messages
    };
}

function createCreateMessage({ content }) {
    return {
        content
    };
}


rootRouter.post('/new/:assistant_id', async (req, res) => {
    try {
        // Assuming you have an equivalent client object in your Node.js code
        const { assistant_id } = req.params;

        console.log("Creating thread ");
        const thread = await client.beta.threads.create();
        console.log("thread.id " + thread.id);
        await client.beta.threads.messages.create(thread.id, {
            content: 'Greet the user and tell it about yourself and ask it what it is looking for.',
            role: 'user',
            metadata: {
                type: 'hidden'
            }
        });

        const run = await client.beta.threads.runs.create(thread.id, {
            assistant_id: assistant_id
        });

        console.log("run id = " + run.id);

        const runStatus = createRunStatus({
            run_id: run.id,
            thread_id: thread.id,
            status: run.status,
            required_action: run.required_action,
            last_error: run.last_error
        });
        return res.json(runStatus);
    } catch (error) {
        // Handle error appropriately
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

rootRouter.get('/threads/:thread_id/runs/:run_id/:assistant_id', async (req, res) => {
    try {
        const { thread_id, run_id, assistant_id } = req.params;

        // Assuming you have an equivalent client object in your Node.js code
        const run = await client.beta.threads.runs.retrieve(
            thread_id,
            run_id
        );

        const runStatus = createRunStatus({
            run_id: run.id,
            thread_id: thread_id,
            status: run.status,
            required_action: run.required_action,
            last_error: run.last_error
        });

        return res.json(runStatus);
    } catch (error) {
        // Handle error appropriately
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

rootRouter.post('/threads/:thread_id/runs/:run_id/tool/:assistant_id', async (req, res) => {
    try {
        const { thread_id, run_id, assistant_id } = req.params;
        const { tool_outputs } = req.body;

        // Assuming you have an equivalent client object in your Node.js code
        const run = await client.beta.threads.runs.submit_tool_outputs({
            run_id: run_id,
            thread_id: thread_id,
            tool_outputs: tool_outputs
        });

        const runStatus = createRunStatus({
            run_id: run.id,
            thread_id: thread_id,
            status: run.status,
            required_action: run.required_action,
            last_error: run.last_error
        });

        return res.json(runStatus);
    } catch (error) {
        // Handle error appropriately
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

rootRouter.get('/threads/:thread_id/:assistant_id', async (req, res) => {
    try {
        const { thread_id, assistant_id } = req.params;

        // Assuming you have an equivalent client object in your Node.js code
        const messages = await client.beta.threads.messages.list(
            thread_id
        );

        const result = messages.data.map(message => {
            return createThreadMessage({
                content: message.content[0].text.value,
                role: message.role,
                hidden: "type" in message.metadata && message.metadata["type"] === "hidden",
                id: message.id,
                created_at: message.created_at
            });
        });

        const thread = createThread({
            messages: result
        });

        return res.json(thread);
    } catch (error) {
        // Handle error appropriately
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

rootRouter.post('/threads/:thread_id/:assistant_id', async (req, res) => {
    try {
        const { thread_id, assistant_id } = req.params;
        const { content } = req.body;

        // Assuming you have an equivalent client object in your Node.js code
        await client.beta.threads.messages.create(thread_id, {
            content: content,
            role: 'user'
        });

        const run = await client.beta.threads.runs.create(thread_id, {
            assistant_id: assistant_id
        });

        const runStatus = createRunStatus({
            run_id: run.id,
            thread_id: thread_id,
            status: run.status,
            required_action: run.required_action,
            last_error: run.last_error
        });

        return res.json(runStatus);
    } catch (error) {
        // Handle error appropriately
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = { rootRouter }