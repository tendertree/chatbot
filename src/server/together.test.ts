/**
 * @server-side
 */
import { describe, test, expect, beforeAll } from 'vitest';
import { TogetherManager } from './together';

const TestbucketName = "StudyData"
const TestdocumentName = "go.pdf"

describe('TogetherManager', () => {
    let togetherManager: TogetherManager;

    beforeAll(() => {
        const apiKey = process.env.TOGETHER_KEY;
        if (!apiKey) {
            throw new Error('TOGETHER_KEY is not set in environment variables');
        }
        togetherManager = new TogetherManager(apiKey);
    });

    test('should create index and query document successfully', async () => {
        // 테스트에 사용할 버킷 이름과 문서 경로
        const bucketName = TestbucketName;
        const documentPath = TestdocumentName;

        try {
            // 인덱스 생성
            await togetherManager.createIndex(bucketName, documentPath);

            // 질문 생성
            const question = "현대 철학자 메야수는 무엇을 주장했어?";

            // 문서 쿼리
            const { response, sourceNodes } = await togetherManager.queryDocument(question);

            // 응답 출력
            console.log('Question:', question);
            console.log('Response:', response);
            console.log('Source Nodes:', sourceNodes);

            // 응답이 비어있지 않은지 확인
            expect(response).toBeTruthy();
            expect(typeof response).toBe('string');
            expect(response.length).toBeGreaterThan(0);

            // sourceNodes가 배열이고 비어있지 않은지 확인
            expect(Array.isArray(sourceNodes)).toBe(true);
            expect(sourceNodes.length).toBeGreaterThan(0);

        } catch (error) {
            console.error('Test failed with error:', error);
            throw error; // 테스트 실패
        }
    }, { timeout: 30000 }); // 타임아웃을 30초로 설정 (필요에 따라 조정)
});
