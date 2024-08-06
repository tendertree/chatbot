import { OpenAI, Document, VectorStoreIndex, SimpleDirectoryReader, QueryEngine, Settings, HuggingFaceEmbedding, OpenAIEmbedding } from "llamaindex";
import supabase from './supabase';

export default class OpenAIManager {
    private queryEngine: QueryEngine | null = null;
    private STORAGE_CACHE_DIR = './storage_cache';
    private STORAGE_DIR = './temp_storage';
    private bucketName: string;
    private documentPath: string;


    constructor(bucket: string, path: string) {
        // OpenAI 설정
        Settings.llm = new OpenAI({
            model: "gpt-3.5-turbo",
            temperature: 0,
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
        });
        // Settings.embedModel = new HuggingFaceEmbedding({
        //     modelType: "BAAI/bge-small-en-v1.5",
        //     quantized: false,
        // });

        Settings.embedModel = new OpenAIEmbedding();
        this.bucketName = bucket;
        this.documentPath = path;
        console.log("OpenAI manager constructed");
    }




    async queryDocument(question: string): Promise<string> {
        try {
            const fileContent = await this.downloadFromSupabase(this.bucketName, this.documentPath);
            const document = new Document({ text: fileContent, id_: this.documentPath });
            const index = await VectorStoreIndex.fromDocuments([document]);
            this.queryEngine = index.asQueryEngine();
            console.log("Index created successfully");
        } catch (error) {
            console.error("Error creating index:", error);
            throw error;
        }
        if (!this.queryEngine) {
            throw new Error("Index not created. Please call createIndex first.");
        }
        try {
            const response = await this.queryEngine.query({
                query: question,
            });
            return response.response;
        } catch (error) {
            console.error("Error querying document:", error);
            throw error;
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
