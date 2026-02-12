export interface Project {
    id: string;
    title: string;
    colorClass: string;
    images: string[];
}

export const photoProjects: Project[] = [
    {
        id: 'newzealand',
        title: 'NEW ZEALAND',
        colorClass: 'bg-sage',
        images: [
            '/newz/218 - 90 - KUM_0010.jpg',
            '/newz/215 - 87 - KUM_0139.jpg',
            '/newz/205 - 78 - KUM_0204.jpg',
            '/newz/210 - 83 - KUM_0205.jpg',
            '/newz/204 - 77 - KUM_0228.jpg',
            '/newz/188 - 69 - KUM_0229.jpg',
            '/newz/230 - 94 - KUM_0230.jpg',
            '/newz/203 - 76 - KUM_0233-2.jpg',
            '/newz/216 - 88 - KUM_0235.jpg',
            '/newz/200 - 75 - KUM_0254.jpg',
            '/newz/208 - 81 - KUM_0306.jpg'
        ]
    },
    {
        id: 'formula1',
        title: 'FORMULA 1',
        colorClass: 'bg-terracotta',
        images: [
            '/f1/133 - 51 - mclaren1.jpg',
            '/f1/127 - 49 - OGF_0411.jpg',
            '/f1/068 - 15 - OGF_0983.jpg',
            '/f1/071 - 17 - ferrari2.jpg',
            '/f1/085 - 23 - OGF_0276.jpg',
            '/f1/111 - 39 - OGF_0409.jpg',
            '/f1/120 - 43 - OGF_0690.jpg',
            '/f1/116 - 41 - OGF_0275.jpg',
            '/f1/097 - 31 - OGF_0985.jpg',
            '/f1/088 - 25 - OGF_0186.jpg'
        ]
    },
    {
        id: 'mexico',
        title: 'MEXICO',
        colorClass: 'bg-ochre',
        images: [
            '/mexico/130 - Nathan001577-R1-012-4A.jpg',
            '/mexico/156 - Nathan001575-R1-054-25A.jpg',
            '/mexico/039 - Nathan001577-R1-070-33A.jpg',
            '/mexico/052 - Nathan001576-R1-026-11A.jpg',
            '/mexico/223 - CEINE3857.JPG',
            '/mexico/012 - Nathan001577-R1-002-00A.jpg',
            '/mexico/025 - IYIAE9054.JPG',
            '/mexico/043 - CMITE3346.JPG',
            '/mexico/048 - CSPQE3442.JPG',
            '/mexico/055 - Nathan001577-R1-006-1A.jpg',
            '/mexico/064 - Nathan001578-R1-069-33.jpg',
            '/mexico/110 - RWUVE2849.JPG',
            '/mexico/112 - BJFNE5011.JPG',
            '/mexico/150 - Nathan001577-R1-038-17A.jpg',
            '/mexico/152 - Nathan001578-R1-057-27.jpg',
            '/mexico/158 - AYASE7537.JPG',
            '/mexico/234 - EHTBE7503.JPG'
        ]
    },
    {
        id: 'filmfavorites',
        title: 'FILM FAVORITES',
        colorClass: 'bg-dusty-blue',
        images: [
            '/seattle/025 - IYIAE9054.JPG',
            '/seattle/052 - Nathan001576-R1-026-11A.jpg',
            '/seattle/108 - 38 - OGF_0520.jpg',
            '/seattle/150 - Nathan001577-R1-038-17A.jpg',
            '/seattle/165 - Nathan001577-R1-028-12A.jpg'
        ]
    }
];
