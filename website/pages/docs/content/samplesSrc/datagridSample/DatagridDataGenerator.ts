import { Id } from '@silevis/reactgrid';

export type RandomDataTypes = string | number | Date | undefined;

export class DatagridDataGenerator {

    static nextId: number = 0;
    static data: any = {
        name: ['Jacob', 'Tom', 'John', 'Allie', 'Zoe', 'Ashe', 'Fred', 'Rob', 'Alison', 'Arcady', 'Tom', 'Jerry', '   '],
        surname: ['Hudson', 'Perkins', 'Mason', 'Armstrong', 'King', 'Collins', 'Bush', 'Maddison', 'Del Rey', 'Goletz', 'Ferrer', '   '],
        country: ['fr', 'hu', 'lb', 'ml', 'de', 'pl', 'pr', 'mx', 'gb', 'cg', 'au', 'br', '   '],
        city: ['Pekin', 'Newark', 'Acapulco', 'El Paso', 'Warsaw', 'Athens', 'Moscow', 'Mexico', 'Toronto', 'Los Angeles', '   '],
        position: ['Director', 'Manager', 'Software Dev', 'QA', 'Automated Tester', 'Unemployed', 'Scrum Master', 'Project owner', '   '],
        email: ['j.sandberg@gmail.com', 'mr.asgo@gmail.com', 'e.hudson@gmail.com', 'l.aaker@gmail.com', 'o.abtahi@gmail.com', 'j.adams@gmail.com', 'j.balasko@gmail.com', 's.bianchetti@gmail.com', '   '],
        'birth-date': ['e', 'm', 'a Dev', 'i',],
        'is-active': ['false', 'true'],
        skills: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '   '],
        sex: ['male', 'female', '---'],
        phone: ['645654654', '654234987', '305732948', '94740349', '4028343', '543929348', '58473532', '120954368', '432875483', '54385439', '   '],
        street: ['Jizhou Qu', 'Calle Oriente', 'Via Blanca', 'Dr. Ricardo Gutiérrez', 'Essex', 'Agar St', 'Boulevard Alexis-Nihon', '   '],
        registered: ['10.10.2020'],
    }
    static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getDataAttrByKey(key: Id): RandomDataTypes {
        const selectedDataArray = DatagridDataGenerator.data[key];
        if (selectedDataArray !== undefined)
            return selectedDataArray[DatagridDataGenerator.getRandomInt(0, selectedDataArray.length)];
        return undefined;
    }

    getRandomName(): string {
        const names = DatagridDataGenerator.data.name;
        return names[DatagridDataGenerator.getRandomInt(0, names.length)];
    }

    getRandomEmail(): string {
        const names = DatagridDataGenerator.data.name;
        const surnames = DatagridDataGenerator.data.surname;
        return `${names[DatagridDataGenerator.getRandomInt(0, names.length)][0].toLowerCase()}.${names[DatagridDataGenerator.getRandomInt(0, surnames.length)].toLowerCase()}@gmail.com`
    }

    getRandomSurname(): string {
        const surnames = DatagridDataGenerator.data.surname;
        return surnames[DatagridDataGenerator.getRandomInt(0, surnames.length)];
    }

    getRandomCountry(): string {
        const countries = DatagridDataGenerator.data.country;
        return countries[DatagridDataGenerator.getRandomInt(0, countries.length)];
    }

    getRandomAge(min: number = 10, max: number = 70): number {
        return DatagridDataGenerator.getRandomInt(min, max)
    }

    getRandomDate(start = new Date(1955, 0, 1), end = new Date(1990, 0, 1)): Date {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    getRandomPosition(): any {
        const positions = DatagridDataGenerator.data.position;
        return { name: positions[DatagridDataGenerator.getRandomInt(0, positions.length)], depth: 1 };
    }

    getRandomBoolean(): boolean {
        return Math.random() < .5;
    }

}