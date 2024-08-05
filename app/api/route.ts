import supabase from "@/src/server/supabase";

export async function GET(request: Request) {
    const { data: node, error } = await supabase
        .from('node')
        .select('id')

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(node);
}
