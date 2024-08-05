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

