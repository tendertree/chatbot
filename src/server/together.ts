import Together from 'together-ai';
import { TogetherLLM, Settings, Document, VectorStoreIndex } from "llamaindex";
import supabase from './supabase';

interface TogetherChatCompletion {
    choices: {
        message: {
            content: string;
        };
    }[];
}

export class TogetherManager {
    private together: Together;
    private llm: TogetherLLM;
    private _VectorStoreIndex!: VectorStoreIndex;
    constructor(apiKey: string) {
        this.together = new Together({ apiKey: process.env['TOGETHERKEY'], });
        this.llm = new TogetherLLM({
            apiKey: process.env.TOGETHER_KEY
        });
        Settings.llm = this.llm;
    }

    async getSinglePrompt(query: string): Promise<string> {
        const response = await this.together.chat.completions.create({
            model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
            messages: [
                { "role": "system", "content": "You are a helpful travel guide." },
                { "role": "assistant", "content": "You could go to the Empire State Building!" },
                { "role": 'user', content: query },
            ],
        }) as TogetherChatCompletion;
        return response.choices[0].message.content;
    }

    async* streamResponse(prompt: string) {
        const stream = await this.together.chat.completions.create({
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
    async createIndex(bucketName: string, documentPath: string): Promise<void> {
        try {
            const fileContent = await this.downloadFromSupabase(bucketName, documentPath);
            const document = new Document({ text: fileContent, id_: documentPath });
            this._VectorStoreIndex = await VectorStoreIndex.fromDocuments([document]);
            console.log("Index created successfully");
        } catch (error) {
            console.error("Error creating index:", error);
            throw error; // 에러를 던져서 호출자가 처리할 수 있게 함
        }
    }


    async queryDocument(question: string): Promise<{ response: string }> {
        if (!this._VectorStoreIndex) {
            throw new Error("Index not created. Please call createIndex first.");
        }

        try {
            const queryEngine = this._VectorStoreIndex.asQueryEngine();
            const response = await queryEngine.query({
                query: question,
            });
            return response;
        } catch (error) {
            console.error("Error querying document:", error);
            throw error; // 에러를 던져서 호출자가 처리할 수 있게 함
        }
    }

    //통합본 
    async askForDocument(bucketName: string, documentPath: string): Promise<void> {
        try {
            const fileContent = await this.downloadFromSupabase(bucketName, documentPath);
            const document = new Document({ text: fileContent, id_: documentPath });
            const index = await VectorStoreIndex.fromDocuments([document]);
            const retriever = index.asRetriever();
            const queryEngine = index.asQueryEngine({
                retriever,
            });


            const { response } = await queryEngine.query({
                query: "What did the author do in college?",
            });
            console.log("Response:", response);
        } catch (error) {
            console.error("Error:", error);
        }

    }

    private async downloadFromSupabase(bucket: string, path: string): Promise<string> {
        const { data, error } = await supabase
            .storage
            .from(bucket)
            .download(path);
        if (error) {
            throw error;
        }
        return await data.text();
    }
}

// 사용 예시
const apiKey = process.env.TOGETHER_KEY;
if (!apiKey) {
    throw new Error("TOGETHER_KEY is not set in environment variables");
}

const togetherManager = new TogetherManager(apiKey);


