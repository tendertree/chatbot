import Together from 'together-ai';

const together = new Together({
    apiKey: process.env['TOGETHER_KEY'],
});

interface TogetherChatCompletion {
    choices: {
        message: {
            content: string;
        };
    }[];
}

export async function GetSinglePrompt(query: string) {

    const response = await together.chat.completions.create({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages: [
            { "role": "system", "content": "You are a helpful travel guide." },
            { "role": "assistant", "content": "You could go to the Empire State Building!" },
            { "role": 'user', content: query },
        ],

    }) as TogetherChatCompletion;
    return (response.choices[0].message.content)
}

async function* streamResponse(client: Together, prompt: string) {
    const stream = await client.chat.completions.create({
        model: "meta-llama/Llama-3-8b-chat-hf",
        messages: [{ role: "user", content: prompt }],
        stream: true,
    });

    for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
            yield chunk.choices[0].delta.content;
        }
    }
}
