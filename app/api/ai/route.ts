import OpenAI from "openai";

// Assign API key to variable
const apiKey = process.env.OPEN_AI_KEY;
// Initialise OpenAI API
const openai = new OpenAI({ apiKey: apiKey });


export async function POST(req: Request) {
    const { question } = await req.json();
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content:
                    "당신은 지금부터 영어교육을 도와주는 영문법 강사입니다",
            },
            {
                role: "user",
                content: question,
            },
        ],
        // We choose the model we want to use for our chatbot
        model: "gpt-3.5-turbo",
        // We add a value for max_tokens to ensure the response won't exceed 300 tokens
        // This is to make sure the responses aren't too long
        max_tokens: 300,
    });
    // Then we return the response we receive from OpenAI
    // Note: This will only work once we set up our frontend logic
    return new Response(JSON.stringify(response));
}

