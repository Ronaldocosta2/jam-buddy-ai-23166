import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();
    console.log('Extracting chords for video:', videoId);

    if (!videoId) {
      throw new Error('Video ID is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get video information from YouTube API
    const videoInfoResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    
    if (!videoInfoResponse.ok) {
      throw new Error('Failed to fetch video information');
    }

    const videoInfo = await videoInfoResponse.json();
    console.log('Video info:', videoInfo);

    // Try to get YouTube transcript/captions
    let lyrics = '';
    try {
      const transcriptUrl = `https://www.youtube.com/watch?v=${videoId}`;
      console.log('Attempting to fetch transcript for:', transcriptUrl);
      
      // Since we can't directly access YouTube transcripts without additional libraries,
      // we'll inform the user that lyrics need to be added manually or use a third-party service
      lyrics = `Letras não disponíveis automaticamente.\n\nPara visualizar as letras desta música:\n• Busque por "${videoInfo.title}" no Google\n• Acesse sites como Letras.mus.br ou Vagalume\n• Copie e cole as letras aqui`;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      lyrics = 'Não foi possível carregar as letras desta música.';
    }

    // Extract chords with strumming patterns
    const chordsPrompt = `Analyze this music video and provide a realistic chord progression:
Title: "${videoInfo.title}"

Based on the title and common musical patterns, generate a realistic chord progression with timestamps and strumming patterns.
Return ONLY a JSON array with this exact structure (no markdown, no explanation):
[
  {"time": 0, "chord": "C", "duration": 4, "strumPattern": "down"},
  {"time": 4, "chord": "Am", "duration": 4, "strumPattern": "down-up"},
  ...
]

Guidelines:
- Use common chord progressions (I-V-vi-IV, I-IV-V, etc.)
- Include major and minor chords that fit the song style
- Distribute chords evenly throughout a typical 3-4 minute song
- Include chord variations (maj7, min7, sus4) for more complex songs
- Return at least 20-30 chord changes
- strumPattern can be: "down", "up", "down-up", "down-down-up"`;

    const chordsResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a music theory expert that analyzes songs and provides accurate chord progressions. Always return valid JSON arrays only.' 
          },
          { role: 'user', content: chordsPrompt }
        ],
      }),
    });


    if (!chordsResponse.ok) {
      const errorText = await chordsResponse.text();
      console.error('Chords AI API error:', chordsResponse.status, errorText);
      
      if (chordsResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (chordsResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI processing failed for chords');
    }

    const chordsData = await chordsResponse.json();
    console.log('Chords AI response:', chordsData);

    let chords;
    try {
      const content = chordsData.choices[0].message.content;
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        chords = JSON.parse(jsonMatch[0]);
      } else {
        chords = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse chords response:', parseError);
      // Fallback to default progression if parsing fails
      chords = [
        { time: 0, chord: 'C', duration: 4, strumPattern: 'down' },
        { time: 4, chord: 'Am', duration: 4, strumPattern: 'down-up' },
        { time: 8, chord: 'F', duration: 4, strumPattern: 'down' },
        { time: 12, chord: 'G', duration: 4, strumPattern: 'down-up' },
      ];
    }

    console.log('Extracted chords:', chords);

    const response = { chords, lyrics, videoInfo };
    console.log('Returning response with lyrics:', lyrics.substring(0, 100));

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-chords function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to extract chords from video'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
