import { revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    const { tag } = await request.json();

    if (!tag) {
      return new Response(JSON.stringify({ error: 'Missing tag parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Revalidate the tag
    revalidateTag(tag);

    return new Response(
      JSON.stringify({ revalidated: true, tag }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return new Response(
      JSON.stringify({ error: 'Revalidation failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
