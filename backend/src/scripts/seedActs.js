const Act = require('../models/Act.models');

const actsMetadata = [
    {
        actCode: 'IPC',
        actName: 'Indian Penal Code',
        actYear: 1860,
        actNo: '45 of 1860',
        description: 'The official criminal code of India covering all substantive aspects of criminal law.'
    },
    {
        actCode: 'CrPC',
        actName: 'Code of Criminal Procedure',
        actYear: 1973,
        actNo: '2 of 1974',
        description: 'The main legislation on procedure for administration of substantive criminal law in India.'
    },
    {
        actCode: 'CPC',
        actName: 'Civil Procedure Code',
        actYear: 1908,
        actNo: '5 of 1908',
        description: 'The procedural law in India that governs the administration of civil proceedings.'
    },
    {
        actCode: 'HMA',
        actName: 'Hindu Marriage Act',
        actYear: 1955,
        actNo: '25 of 1955',
        description: 'An Act of the Parliament of India enacted in 1955 to amend and codify the law relating to marriage among Hindus.'
    },
    {
        actCode: 'IDA',
        actName: 'Indian Divorce Act',
        actYear: 1869,
        actNo: '4 of 1869',
        description: 'An Act to amend the law relating to the divorce of persons professing the Christian religion.'
    },
    {
        actCode: 'IEA',
        actName: 'Indian Evidence Act',
        actYear: 1872,
        actNo: '1 of 1872',
        description: 'A set of rules and allied issues governing admissibility of evidence in the Indian courts of law.'
    },
    {
        actCode: 'NIA',
        actName: 'Negotiable Instruments Act',
        actYear: 1881,
        actNo: '26 of 1881',
        description: 'An Act that governs negotiable instruments like promissory notes, bills of exchange, and cheques.'
    },
    {
        actCode: 'MVA',
        actName: 'Motor Vehicles Act',
        actYear: 1988,
        actNo: '59 of 1988',
        description: 'An Act to consolidate and amend the law relating to motor vehicles.'
    }
];

const seedActs = async () => {
    try {
        console.log('Seeding Acts metadata...');
        
        for (const actData of actsMetadata) {
            await Act.findOneAndUpdate(
                { actCode: actData.actCode },
                actData,
                { upsert: true, new: true }
            );
        }
        
        console.log('Acts metadata seeded successfully.');
    } catch (error) {
        console.error('Error seeding Acts metadata:', error);
        throw error;
    }
};

module.exports = seedActs;
