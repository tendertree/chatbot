"use client"
import FileUpload from "@/components/FileUploader";
import { useEffect, useState } from "react";
export default function Home() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div>Simple web pages!</div>
            <FileUpload />
        </main>)
}
