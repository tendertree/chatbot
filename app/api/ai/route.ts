import OpenAI from "openai";

const apiKey = process.env.OPEN_AI_KEY;
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
        model: "gpt-3.5-turbo",
        max_tokens: 300,
    });
    return new Response(JSON.stringify(response));
}

