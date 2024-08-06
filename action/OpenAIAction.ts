// app/actions/openaiActions.ts

'use server'

import OpenAIManager from '@/src/server/openai';

const bucketName = "StudyData";
const path = "go.pdf"

const openAIManager = new OpenAIManager(bucketName, path);



export async function queryDocument(question: string) {
    try {
        const answer = await openAIManager.queryDocument(question);
        return { success: true, answer };
    } catch (error) {
        console.error('Error querying document:', error);
        return { success: false, message: 'Failed to query document' };
    }
}

