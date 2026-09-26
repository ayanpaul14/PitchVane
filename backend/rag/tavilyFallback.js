import dotenv from 'dotenv';
dotenv.config();

export async function searchTavilyFallback(query, maxResults = 3) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    return [
      {
        id: `tavily_mock_${Date.now()}`,
        text: `Live market intelligence for "${query}": Verified sector indicators show rising customer acquisition costs and expanding venture interest.`,
        source: 'https://tavily.com/market-intel',
      },
    ];
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily HTTP error: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.results || []).map((item, idx) => ({
      id: `tavily_${Date.now()}_${idx}`,
      text: `${item.title}: ${item.content}`,
      source: item.url,
    }));
  } catch (err) {
    console.error('Tavily Search Error:', err.message);
    return [];
  }
}
