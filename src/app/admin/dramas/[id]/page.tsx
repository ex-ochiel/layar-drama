import DramaForm from "@/components/admin/DramaForm";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";

export default async function EditDramaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch existing data
    const { data: drama, error } = await supabase
        .from('dramas')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !drama) {
        notFound();
    }

    async function updateDrama(formData: FormData) {
        "use server";

        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const thumbnail = formData.get("poster") as string;
        const description = formData.get("synopsis") as string;
        const year = formData.get("year") as string;
        const status = formData.get("status") as string;
        const country = formData.get("country") as string;
        const rating = formData.get("rating") as string;

        const supabase = await createClient();

        const { error } = await supabase.from('dramas').update({
            title,
            thumbnail,
            description,
            year: parseInt(year),
            status,
            country,
            rating: parseFloat(rating)
        }).eq('id', id);

        if (error) {
            throw new Error("Failed to update drama: " + error.message);
        }

        redirect('/admin/dramas');
    }

    return (
        <div>
            <DramaForm initialData={drama} action={updateDrama} isEdit />
        </div>
    );
}
