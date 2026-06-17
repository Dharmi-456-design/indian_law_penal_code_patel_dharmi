const fs = require('fs');
const path = require('path');
const Section = require('../models/Section.models');

const dataDir = path.join(__dirname, '../../data');

const actFiles = {
    'IPC': 'ipc.json',
    'CrPC': 'crpc.json',
    'CPC': 'cpc.json',
    'HMA': 'hma.json',
    'IDA': 'ida.json',
    'IEA': 'iea.json',
    'NIA': 'nia.json',
    'MVA': 'MVA.json'
};

const actsMetadata = {
    'IPC': { name: 'Indian Penal Code', year: 1860 },
    'CrPC': { name: 'Code of Criminal Procedure', year: 1973 },
    'CPC': { name: 'Civil Procedure Code', year: 1908 },
    'HMA': { name: 'Hindu Marriage Act', year: 1955 },
    'IDA': { name: 'Indian Divorce Act', year: 1869 },
    'IEA': { name: 'Indian Evidence Act', year: 1872 },
    'NIA': { name: 'Negotiable Instruments Act', year: 1881 },
    'MVA': { name: 'Motor Vehicles Act', year: 1988 }
};

const normalizeSection = (entry, actCode) => {
    let normalized = {
        actCode: actCode,
        actName: actsMetadata[actCode].name,
        actYear: actsMetadata[actCode].year
    };

    // Special handling for HMA malformed structure
    if (actCode === 'HMA') {
        const key = Object.keys(entry)[0];
        const value = entry[key];
        
        if (!value || value.trim() === '') return null;

        // The key is "chapter,section,section_title,section_desc"
        // The value is something like "1,1,Short title and extent,\"This Act may be called..."
        const parts = value.split(',');
        if (parts.length < 3) return null;

        normalized.chapter = parseInt(parts[0]) || null;
        normalized.sectionNumber = parts[1].trim();
        normalized.sectionTitle = parts[2].replace(/^"|"$/g, '').trim();
        normalized.sectionDesc = parts.slice(3).join(',').replace(/^"|"$/g, '').trim();
        
        if (!normalized.sectionNumber || !normalized.sectionTitle) return null;
        return normalized;
    }

    // Standard mapping
    normalized.sectionNumber = (entry.Section || entry.section || entry.section_no || '').toString().trim();
    normalized.sectionTitle = (entry.section_title || entry.title || entry.Section_Title || '').trim();
    normalized.sectionDesc = (entry.section_desc || entry.description || entry.Section_Description || '').trim();
    normalized.chapter = entry.chapter ? parseInt(entry.chapter) : null;
    normalized.chapterTitle = (entry.chapter_title || entry.Chapter_Title || null);

    if (!normalized.sectionNumber || !normalized.sectionTitle || !normalized.sectionDesc) {
        return null;
    }

    return normalized;
};

const seedLaws = async () => {
    try {
        console.log('Starting sections seeding...');

        for (const [actCode, fileName] of Object.entries(actFiles)) {
            const filePath = path.join(dataDir, fileName);
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${fileName}, skipping...`);
                continue;
            }

            console.log(`Processing ${actCode} (${fileName})...`);
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);

            const operations = [];
            let count = 0;

            for (const entry of data) {
                const normalized = normalizeSection(entry, actCode);
                if (normalized) {
                    operations.push({
                        updateOne: {
                            filter: { actCode: normalized.actCode, sectionNumber: normalized.sectionNumber },
                            update: { $set: normalized },
                            upsert: true
                        }
                    });
                    count++;
                }
            }

            if (operations.length > 0) {
                // Execute in chunks to avoid memory issues with very large datasets
                const chunkSize = 500;
                for (let i = 0; i < operations.length; i += chunkSize) {
                    const chunk = operations.slice(i, i + chunkSize);
                    await Section.bulkWrite(chunk);
                }
                console.log(`Successfully processed ${count} sections for ${actCode}.`);
            }
        }

        console.log('All sections seeded successfully.');
    } catch (error) {
        console.error('Error seeding sections:', error);
        throw error;
    }
};

module.exports = seedLaws;
