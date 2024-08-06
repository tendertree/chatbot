import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000'; // 개발 서버 주소

interface NodeData {
    id: number;
}

function isNodeDataArray(data: unknown): data is NodeData[] {
    return Array.isArray(data) && data.every(item =>
        typeof item === 'object' && item !== null && 'id' in item
    );
}

describe('GET /api/node API Route', () => {
    it('should return node data from actual API endpoint', async () => {
        const response = await fetch(`${API_URL}/api/`);
        const data = await response.json();

        expect(response.status).toBe(200);
        if (!isNodeDataArray(data)) {
            throw new Error('Unexpected data format');
        }

        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0]).toHaveProperty('id');
    });
});


