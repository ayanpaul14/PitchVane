import { ChromaClient } from 'chromadb';
import { loadSeedDocs } from './loadDocs.js';
import { chunkText } from './chunk.js';

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

export async function pushSeedData() {
  console.log('--- Initializing Chroma Vector Store Ingestion ---');
  try {
    const collection = await chroma.getOrCreateCollection({
      name: 'pitchvane_knowledge',
    });

    const docs = loadSeedDocs();
    let totalChunks = 0;

    for (const doc of docs) {
      const chunks = chunkText(doc.content);
      const ids = [];
      const documents = [];
      const metadatas = [];

      chunks.forEach((chunk, index) => {
        const chunkId = `chunk_${doc.category}_${Date.now()}_${index}`;
        ids.push(chunkId);
        documents.push(chunk);
        metadatas.push({
          source: doc.source,
          category: doc.category,
          chunkIndex: index,
        });
      });

      if (ids.length > 0) {
        await collection.add({
          ids,
          documents,
          metadatas,
        });
        totalChunks += ids.length;
        console.log(`✓ Ingested ${ids.length} chunks for source: ${doc.source} (${doc.category})`);
      }
    }

    console.log(`✅ Ingestion Complete! Total Chunks in Store: ${totalChunks}`);
  } catch (error) {
    console.error('❌ Chroma Ingestion Error:', error);
  }
}

// Execute if run directly
if (process.argv[1].endsWith('pushToChroma.js')) {
  pushSeedData();
}
