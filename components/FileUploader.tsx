'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UploadFileAction } from "@/action/UploadFileAction"

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }
    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) {
            alert('Please select a file first')
            return
        }
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/file', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log('Upload result:', result)
            alert('File uploaded successfully!')
        } catch (error) {
            console.error('Error uploading file:', error)
            alert(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    return (
        <form onSubmit={handleUpload}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Upload PDF</Label>
                <Input id="picture" type="file" onChange={handleFileChange} />
                <Button type="submit" disabled={!file}>Upload</Button>
            </div>
        </form>
    )
}
