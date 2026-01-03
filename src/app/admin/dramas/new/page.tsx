import DramaForm from "@/components/admin/DramaForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewDramaPage() {

    async function createDrama(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const thumbnail = formData.get("poster") as string;
        const description = formData.get("synopsis") as string;
        const year = formData.get("year") as string;
        const status = formData.get("status") as string;
        const country = formData.get("country") as string;
        const rating = formData.get("rating") as string;

        // Generate slug
        const endpoint = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const supabase = await createClient();

        const { error } = await supabase.from('dramas').insert({
            title,
            thumbnail,
            description,
            year: parseInt(year),
            status,
            country,
            rating: parseFloat(rating),
            endpoint
        });

        if (error) {
            throw new Error("Failed to create drama: " + error.message);
        }

        redirect('/admin/dramas');
    }

    return (
        <div>
            <DramaForm action={createDrama} />
        </div>
    );
}
