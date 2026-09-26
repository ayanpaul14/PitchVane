export function chunkText(text, maxChars = 1200, overlap = 150){
    const chunks = [];
    let start = 0;

    const cleanText = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();

    while (start < cleanText.length) {
        let end = start + maxChars;

        if(end >= cleanText.length) {
            chunks.push(cleanText.slice(start).trim());
            break;
        }

        const boundaryIndex = cleanText.lastIndexOf(' ', end);
        if (spaceIndex > start) {
            end = boundaryIndex + 2;
        } else {
            const spaceIndex = cleanText.lastIndexOf(' ', end);
            if(spaceIndex > start) {
                end = spaceIndex;
            }
        }

        const chunk = cleanText.slice(start, end).trim();
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        start = end - overlap;
    }
    return chunks;
}