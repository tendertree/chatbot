'use server'

import supabase from '@/src/server/supabase'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
export async function UploadFileAction(formData: FormData) {

    console.log('UploadFileAction started')
    try {
        const file = formData.get('file') as File
        if (!file) {
            console.error('No file provided in formData')
            throw new Error('No file provided')
        }
        console.log('Original file details:', file.name, file.type, file.size)

        if (!isAllowedFileType(file)) {
            throw new Error('Image files are not allowed')
        }
        const sanitizedFileName = sanitizeFilename(file.name)
        console.log('Sanitized file name:', sanitizedFileName)

        const fileName = `${Date.now()}_${sanitizedFileName}`
        console.log('Final file name for upload:', fileName)

        const { data, error } = await supabase.storage
            .from('StudyData')
            .upload(fileName, file)

        if (error) {
            console.error('Supabase upload error:', error)
            throw new Error(`Failed to upload file: ${error.message}`)
        }

        console.log('Upload successful:', data)
        return data
    } catch (error) {
        console.error('Unhandled error in UploadFileAction:', error)
        if (error instanceof Error) {
            throw new Error(`Failed to upload file: ${error.message}`)
        } else {
            throw new Error('An unknown error occurred during file upload')
        }
    }

    function checkFilename(originalName: string): string {
        // 한글 감지를 위한 정규표현식
        const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/

        if (koreanRegex.test(originalName)) {
            // 한글이 포함된 경우, UUID를 사용하여 새 이름 생성
            const fileExtension = originalName.split('.').pop()
            return `${uuidv4()}.${fileExtension}`
        } else {
            // 한글이 포함되지 않은 경우, 원래 이름 사용
            return originalName
        }
    }

    function isAllowedFileType(file: File): boolean {
        // 이미지 파일 MIME 타입 목록
        const imageTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'image/bmp',
            'image/tiff'
        ]

        // 파일 타입이 이미지가 아닌 경우에만 true 반환
        return !imageTypes.includes(file.type)
    }

    function sanitizeFilename(filename: string): string {
        // 파일 확장자 추출
        const parts = filename.split('.')
        const ext = parts.pop()
        const name = parts.join('.')

        // 파일 이름에서 허용되지 않는 문자 제거 및 영문/숫자로 변환
        const sanitized = name.replace(/[^a-z0-9]/gi, '_').toLowerCase()

        // UUID를 추가하여 고유성 보장
        return `${sanitized}_${uuidv4()}.${ext}`
    }
}
