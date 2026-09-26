import fs from 'fs';
import path from 'path';
import { fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function loadSeedDocs(){
    const dataDir = path.join(__dirname, 'data');
    const categories = ['market', 'competitor', 'financial', 'risk'];
    const documents = [];

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });

        categories.forEach((cat) => {
            const sampleFile = path.join(dataDir, `${cat}_sample.txt`);
            if(!fs.existsSync(sampleFile)) {
                fs.writeFileSync(
                    sampleFile,
                    `Initial benchmark report for ${cat} evaluation in early-stage tech ventures.`,
                    'utf-8'
                );
            }
        });
    }

    const files = fs.readdirSync(dataDir);
    for(const file of files) {
        const filePath = path.join(dataDir, file);
        if(fs.stateSync(filePath).isFile()) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lower = file.toLowerCase();
            let category = 'general';
            if (lower.includes('market')) category = 'market';
            else if(lower.includes('competitor') || lower.includes('comp')) category = 'competitor';
            else if (lower.includes('financial') || lower.includes('fin')) category = 'financial';
            else if (lower.includes('risk')) category = 'risk';

            documents.push({
                source: file,
                category,
                content,
            });
        }
    }
    return documents;
}