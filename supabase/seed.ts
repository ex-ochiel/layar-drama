
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { mockDramas } from '../src/lib/mockData';
import { mockActors } from '../src/lib/mockActors';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding data...');

    // 1. Insert Actors
    console.log(`Inserting ${mockActors.length} actors...`);
    // Map mock actors to DB structure (handling any field mismatches if necessary)
    // Our schema matches fairly well, but let's be explicit.
    const actorsData = mockActors.map(actor => ({
        // We let Supabase generate UUIDs, so we don't use actor.id from mock data (which are "1", "2")
        // UNLESS we want to preserve relationships. 
        // The mock data relationships are based on "1", "2". 
        // So we MUST Map them.
        // Strategy: Insert actors, store their NEW UUIDs mapped to their OLD IDs.
        old_id: actor.id,
        name: actor.name,
        slug: actor.slug,
        photo: actor.photo,
        birth_date: actor.birthDate,
        birth_place: actor.birthPlace,
        biography: actor.biography
    }));

    // We can't insert 'old_id' into the actors table unless we add a temporary column or just track it in memory.
    // We'll track in memory. We insert one by one or upsert?
    // Upsert on slug is safer to avoid duplicates if run multiple times.

    const actorIdMap = new Map<string, string>(); // old_id -> new_uuid

    for (const actor of actorsData) {
        const { old_id, ...data } = actor;
        const { data: inserted, error } = await supabase
            .from('actors')
            .upsert(data, { onConflict: 'slug' })
            .select('id, slug') // need ID
            .single();

        if (error) {
            console.error(`Error inserting actor ${actor.name}:`, error);
        } else if (inserted) {
            actorIdMap.set(old_id, inserted.id);
        }
    }

    // 2. Insert Dramas
    console.log(`Inserting ${mockDramas.length} dramas...`);
    const dramaIdMap = new Map<string, string>(); // old_id -> new_uuid

    for (const drama of mockDramas) {
        const { id, endpoint, ...rest } = drama;
        const dramaData = {
            title: drama.title,
            slug: drama.endpoint, // mapping endpoint to slug
            thumbnail: drama.thumbnail,
            rating: parseFloat(drama.rating), // convert string to numeric
            year: parseInt(drama.year),
            status: drama.status,
            country: drama.country,
            description: drama.description,
            genres: drama.genres
        };

        const { data: inserted, error } = await supabase
            .from('dramas')
            .upsert(dramaData, { onConflict: 'slug' })
            .select('id')
            .single();

        if (error) {
            console.error(`Error inserting drama ${drama.title}:`, error);
        } else if (inserted) {
            dramaIdMap.set(drama.id, inserted.id);
        }
    }

    // 3. Insert Drama-Actors Relations
    // The mock data for actors has 'knownFor' which is an array of drama IDs.
    // So we iterate actors again.
    console.log('Linking actors to dramas...');

    for (const actor of mockActors) {
        const actorUuid = actorIdMap.get(actor.id);
        if (!actorUuid) continue;

        if (actor.knownFor && actor.knownFor.length > 0) {
            for (const dramaMockId of actor.knownFor) {
                const dramaUuid = dramaIdMap.get(dramaMockId);
                if (dramaUuid) {
                    const { error } = await supabase
                        .from('drama_actors')
                        .upsert({ drama_id: dramaUuid, actor_id: actorUuid });

                    if (error) {
                        console.error(`Error linking actor ${actor.name} to drama ${dramaMockId}:`, error);
                    }
                }
            }
        }
    }

    console.log('Seeding complete!');
}

seed().catch(err => console.error(err));
