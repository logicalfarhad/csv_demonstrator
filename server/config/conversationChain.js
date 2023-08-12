// conversationChain.js
require("dotenv").config()
const { ConversationChain } = require("langchain/chains");
const { OpenAI } = require("langchain/llms/openai");
const { BufferMemory } = require("langchain/memory");

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

module.exports = createChain;
