import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/src/server/supabase';
import { v4 as uuidv4 } from 'uuid';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        console.log('Original file details:', file.name, file.type, file.size);

        if (!isAllowedFileType(file)) {
            return NextResponse.json({ error: 'Image files are not allowed' }, { status: 400 });
        }

        const sanitizedFileName = sanitizeFilename(file.name);
        console.log('Sanitized file name:', sanitizedFileName);

        const fileName = `${Date.now()}_${sanitizedFileName}`;
        console.log('Final file name for upload:', fileName);

        const fileBuffer = await file.arrayBuffer();

        const { data, error } = await supabase.storage
            .from('StudyData')
            .upload(fileName, fileBuffer);

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: `Failed to upload file: ${error.message}` }, { status: 500 });
        }

        console.log('Upload successful:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Unhandled error in upload:', error);
        return NextResponse.json({ error: 'An unknown error occurred during file upload' }, { status: 500 });
    }
}

function isAllowedFileType(file: File): boolean {
    const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff'
    ];
    return !imageTypes.includes(file.type);
}

function sanitizeFilename(filename: string): string {
    const parts = filename.split('.');
    const ext = parts.pop();
    const name = parts.join('.');
    const sanitized = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${sanitized}_${uuidv4()}.${ext}`;
}
