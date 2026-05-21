const Section = require('../src/models/Section.models');

describe('Section Model Test', () => {
    it('should create a section successfully', async () => {
        const sectionData = {
            actCode: 'IPC',
            actName: 'Indian Penal Code',
            actYear: 1860,
            sectionNumber: '1',
            sectionTitle: 'Title',
            sectionDesc: 'Description'
        };
        const validSection = new Section(sectionData);
        const err = validSection.validateSync();
        expect(err).toBeUndefined();
    });

    it('should fail if actCode is invalid', async () => {
        const sectionData = {
            actCode: 'INVALID',
            actName: 'Indian Penal Code',
            sectionNumber: '1',
            sectionTitle: 'Title',
            sectionDesc: 'Description'
        };
        const invalidSection = new Section(sectionData);
        const err = invalidSection.validateSync();
        expect(err.errors.actCode).toBeDefined();
    });

    it('should fail if required fields are missing', async () => {
        const sectionData = {
            actCode: 'IPC'
        };
        const invalidSection = new Section(sectionData);
        const err = invalidSection.validateSync();
        expect(err.errors.sectionNumber).toBeDefined();
        expect(err.errors.sectionTitle).toBeDefined();
        expect(err.errors.sectionDesc).toBeDefined();
    });
});
