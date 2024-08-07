import { NextApiRequest, NextApiResponse } from 'next';
import OpenAIManager from '@/src/server/openai';

const bucketName = "StudyData";
const path = "go.pdf";
const openAIManager = new OpenAIManager(bucketName, path);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ success: false, message: 'Question is required' });
    }

    try {
        const answer = await openAIManager.queryDocument(question);
        res.status(200).json({ success: true, answer });
    } catch (error) {
        console.error('Error querying document:', error);
        res.status(500).json({ success: false, message: 'Failed to query document' });
    }
}
