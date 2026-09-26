import { ChromaClient } from 'chromadb';

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

export async function retrieveChunks(query, category, topK = 3) {
  try {
    const collection = await chroma.getCollection({ name: 'pitchvane_knowledge' });
    const results = await collection.query({
      queryTexts: [query],
      nResults: topK,
      where: category ? { category: { $eq: category } } : undefined,
    });

    if (!results || !results.documents || results.documents[0].length === 0) {
      return { chunks: [], averageDistance: 1.0 };
    }

    const chunks = results.documents[0].map((doc, idx) => ({
      id: results.ids[0][idx],
      text: doc,
      metadata: results.metadatas[0][idx],
      distance: results.distances ? results.distances[0][idx] : 0.5,
    }));

    const avgDist =
      chunks.reduce((acc, c) => acc + (c.distance || 0.5), 0) / (chunks.length || 1);

    return { chunks, averageDistance: avgDist };
  } catch (error) {
    // Return empty array gracefully if Chroma is offline, enabling fallback
    return { chunks: [], averageDistance: 1.0, error: error.message };
  }
}
