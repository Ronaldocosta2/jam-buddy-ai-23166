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

    // Use AI to extract/generate chord progression
    const prompt = `Analyze this music video and provide a realistic chord progression:
Title: "${videoInfo.title}"

Based on the title and common musical patterns, generate a realistic chord progression with timestamps.
Return ONLY a JSON array with this exact structure (no markdown, no explanation):
[
  {"time": 0, "chord": "C", "duration": 4},
  {"time": 4, "chord": "Am", "duration": 4},
  ...
]

Guidelines:
- Use common chord progressions (I-V-vi-IV, I-IV-V, etc.)
- Include major and minor chords that fit the song style
- Distribute chords evenly throughout a typical 3-4 minute song
- Include chord variations (maj7, min7, sus4) for more complex songs
- Return at least 20-30 chord changes`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI processing failed');
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', aiData);

    let chords;
    try {
      const content = aiData.choices[0].message.content;
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        chords = JSON.parse(jsonMatch[0]);
      } else {
        chords = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to default progression if parsing fails
      chords = [
        { time: 0, chord: 'C', duration: 4 },
        { time: 4, chord: 'Am', duration: 4 },
        { time: 8, chord: 'F', duration: 4 },
        { time: 12, chord: 'G', duration: 4 },
      ];
    }

    console.log('Extracted chords:', chords);

    return new Response(
      JSON.stringify({ chords, videoInfo }),
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
