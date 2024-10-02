// conversationChain.js
require("dotenv").config()
const { ConversationChain } = require("langchain/chains");
const { OpenAI } = require("langchain/llms/openai");
const { BufferMemory } = require("langchain/memory");
const fetch = require('node-fetch')
const { LLM_AUTH_TOKEN, GENAIAPI, OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
    model: "text-davinci-003",
    temperature: 0,
    max_tokens: 150,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
});

const memory = new BufferMemory();
const chain = new ConversationChain({
    llm: openai,
    memory: memory,
});

const createChain = () => {
    return chain;
};


const getResult = async (messages,model) => {
    console.log("Model****", model)
    let GptApiKey= model.includes('Gpt')? OPENAI_API_KEY : ''
    let requestURL = model.includes('Gpt')? 'gpt-3.5-turbo/chat' : 'Mistral-7B-Instruct-v0.3_t2t/chat'
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json; charset=utf-8',
            'X-Request-ID': 'rqt-cpg9arl9a9ic73886190',
            'Process-Mode': 'sync',
            'Authorization': `Basic ${LLM_AUTH_TOKEN}`,
            'Content-Type': 'application/json; charset=utf-8',
            'X-Api-Key': GptApiKey
        },
        body: JSON.stringify({
            prompts: messages,
            doSample: true,
            maxTokens: 1024,
            numBeams: 1,
            repPenalty: 1.2,
            temperature: 0.7,
            topK: 10,
            topP: 0.6
        })
    };

    try {
        console.log(`${GENAIAPI}${requestURL}`)
        console.log(options)
        const response = await fetch(`${GENAIAPI}${requestURL}`, options);
        const result = await response.json();
        console.log(result)
        let description = result.payload.data.text;
        return description;
    } catch (error) {
        console.error('Error:', error);
        return ""
    }
}

module.exports = {
    createChain,
    getResult
};
