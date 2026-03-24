Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { model, max_tokens, messages, system } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Missing messages array' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return Response.json({ error: 'API key not configured' }, {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const payload: Record<string, unknown> = {
      model: model || 'claude-sonnet-4-20250514',
      max_tokens: max_tokens || 1000,
      messages,
    };

    if (system) payload.system = system;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    return Response.json({ error: error.message }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
});
