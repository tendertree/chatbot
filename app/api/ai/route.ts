import supabase from "@/src/server/supabase";
import { TogetherManager } from "@/src/server/together";

const TestbucketName = "StudyData"
const TestdocumentName = "go.pdf"

const apiKey = process.env.TOGETHER_KEY;
if (!apiKey) {
    throw new Error('TOGETHER_KEY is not set in environment variables');
}
const togetherManager = new TogetherManager(apiKey);

export async function GET(request: Request) {

    const bucketName = TestbucketName;
    const documentPath = TestdocumentName;

    await togetherManager.createIndex(bucketName, documentPath);
    const question = "현대 철학자 메야수는 무엇을 주장했어?";

    const response = await togetherManager.queryDocument(question);

    return Response.json(response.response);
}
