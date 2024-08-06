import { createClient } from "@supabase/supabase-js";
import { log } from "console";
import { v4 as uuidv4 } from 'uuid'

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;


const generateUniqueId = () => {
    return uuidv4();
};

export async function UploadFile(file: File) {
    const filePath = `uploads/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
        .from('Study_Data')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading file:', error);
        throw error;
    }

    return data;
}


async function downloadFromSupabase(bucket: string, path: string) {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .download(path);

    if (error) {
        throw error;
    }

    return await data.text();
}
