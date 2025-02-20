import { NextResponse } from 'next/server';
import { directus } from '@/services/directus';
import { createItems } from '@directus/sdk';

export async function POST(request) {
  try {
    const api = directus(process.env.DIRECTUS_TOKEN);
    const { email="", responses } = await request.json();

    if (!responses?.length) {
      return NextResponse.json(
        { error: 'Responses are required' },
        { status: 400 }
      );
    }

    const responses_array = responses.map(response => ({
      submitted_by: email,
      prompt: response.promptId,
      prompt_text: response.promptText,
      response: response.response
    }));

    const submission = await api.request(
      createItems('tarot_submissions', {
        submitted_by: email,
        responses: responses_array
      })
    );

    return NextResponse.json({ 
      message: 'Responses submitted successfully',
      submission 
    });

  } catch (error) {
    console.error('Error submitting tarot responses:', error);
    return NextResponse.json(
      { error: 'Failed to submit responses' },
      { status: 500 }
    );
  }
} 