/**
 * vehicleData.js — Fordonsbok fordonsdata
 *
 * Innehåller fordonstyper, märken per typ och modeller per märke
 * för den europeiska marknaden.
 *
 * Export:
 *   VEHICLE_TYPES       – array med fordonstypsobjekt
 *   MAKES_BY_TYPE       – märken per fordonstypsid
 *   MODELS_BY_MAKE      – modeller per märke
 *   getTypeIcon(typeId) – returnerar emoji för fordonstyp
 *   getTypeLabel(typeId)– returnerar label för fordonstyp
 */

// ─── Fordonstyper ─────────────────────────────────────────────────────────────
export const VEHICLE_TYPES = [
    { id: 'car',        icon: '🚗', label: 'Personbil'           },
    { id: 'suv',        icon: '🚙', label: 'SUV / Crossover'     },
    { id: 'van',        icon: '🚐', label: 'Skåpbil / Minibuss'  },
    { id: 'truck',      icon: '🚛', label: 'Lastbil'             },
    { id: 'mc',         icon: '🏍️', label: 'MC / Motorcykel'     },
    { id: 'moped',      icon: '🛵', label: 'Moped / Scooter'     },
    { id: 'atv',        icon: '🏎️', label: 'ATV / Fyrhjuling'    },
    { id: 'snowmobile', icon: '🛷', label: 'Snöskoter'           },
    { id: 'boat',       icon: '🚤', label: 'Båt / Vattenskoter'  },
    { id: 'caravan',    icon: '🏕️', label: 'Husvagn'             },
    { id: 'motorhome',  icon: '🚌', label: 'Husbil'              },
    { id: 'trailer',    icon: '🔧', label: 'Släpkärra / Trailer' },
    { id: 'tractor',    icon: '🚜', label: 'Traktor / Arbetsfordon' },
    { id: 'other',      icon: '❓', label: 'Annat'               },
];

export function getTypeIcon(typeId) {
    return VEHICLE_TYPES.find(t => t.id === typeId)?.icon || '🚗';
}

export function getTypeLabel(typeId) {
    return VEHICLE_TYPES.find(t => t.id === typeId)?.label || 'Okänd typ';
}

// ─── Märken per fordonstyp ────────────────────────────────────────────────────
export const MAKES_BY_TYPE = {

    car: [
        'Alfa Romeo','Aston Martin','Audi','Bentley','BMW','BYD','Cadillac',
        'Chevrolet','Citroën','Cupra','Dacia','DS Automobiles','Ferrari',
        'Fiat','Ford','Genesis','Honda','Hyundai','Infiniti','Jaguar',
        'Jeep','Kia','Lamborghini','Lancia','Land Rover','Leapmotor','Lexus',
        'Lotus','Lynk & Co','Maserati','Mazda','McLaren','Mercedes-Benz',
        'MG','MINI','Mitsubishi','Nio','Nissan','Omoda','Opel','Peugeot',
        'Polestar','Porsche','Renault','Rolls-Royce','Saab','SEAT','Škoda',
        'Smart','Subaru','Suzuki','Tesla','Toyota','Volkswagen','Volvo',
        'Xpeng','Zeekr','Annat'
    ],

    suv: [
        'Alfa Romeo','Audi','BMW','BYD','Citroën','Cupra','Dacia','DS Automobiles',
        'Ford','Honda','Hyundai','Jaguar','Jeep','Kia','Land Rover','Leapmotor',
        'Lexus','Lynk & Co','Maserati','Mazda','Mercedes-Benz','MG','MINI',
        'Mitsubishi','Nio','Nissan','Omoda','Opel','Peugeot','Polestar',
        'Porsche','Renault','SEAT','Škoda','Subaru','Suzuki','Tesla',
        'Toyota','Volkswagen','Volvo','Xpeng','Zeekr','Annat'
    ],

    van: [
        'Citroën','Fiat','Ford','Mercedes-Benz','Nissan','Opel','Peugeot',
        'Renault','Toyota','Volkswagen','Volvo','Annat'
    ],

    truck: [
        'DAF','Ford','Iveco','MAN','Mercedes-Benz','Renault Trucks',
        'Scania','Toyota','Volvo Trucks','Annat'
    ],

    mc: [
        'Aprilia','BMW Motorrad','Brixton','Ducati','Harley-Davidson',
        'Honda','Husqvarna','Indian','Kawasaki','KTM','Moto Guzzi',
        'Norton','Royal Enfield','Suzuki','Triumph','Ural',
        'Yamaha','Zontes','Annat'
    ],

    moped: [
        'Aprilia','Derbi','Honda','Husqvarna','Kawasaki','Kymco',
        'Peugeot Scooters','Piaggio','Rieju','Suzuki','SYM',
        'Vespa','Yamaha','Annat'
    ],

    atv: [
        'Arctic Cat','BRP Can-Am','CF Moto','Honda','Kawasaki',
        'Kymco','Linhai','Polaris','Suzuki','TGB','Yamaha','Annat'
    ],

    snowmobile: [
        'Arctic Cat / Textron','BRP Ski-Doo','Lynx','Polaris','Yamaha','Annat'
    ],

    boat: [
        'Bayliner','BRP Sea-Doo','Chris-Craft','Cobalt','Formula',
        'Grady-White','Hallberg-Rassy','Jeanneau','Nimbus','Ryds',
        'Sealine','Sunseeker','Yamaha WaveRunner','Zodiac','Annat'
    ],

    caravan: [
        'Adria','Cabby','Dethleffs','Eifelland','Eriba','Fendt',
        'Hobby','Hymer','Kabe','Knaus','LMC','Polar','Sterling',
        'Sunlight','T@B','Tabbert','Weinsberg','Wilk','Annat'
    ],

    motorhome: [
        'Adria','Autocruise','Auto-Trail','Benimar','Bürstner',
        'Carado','Chausson','Concorde','Dethleffs','Eura Mobil',
        'Frankia','Globecar','Hymer','Kabe','Knaus','Laika',
        'LMC','Niesmann+Bischoff','Pilote','Rapido','Roller Team',
        'Sunlight','Swift','Trigano','Weinsberg','Annat'
    ],

    trailer: [
        'Böckmann','Brian James','Eduard','Fogelsta','Franc','Ifor Williams',
        'Indespension','Kuljetusässy','Neptun','Palmse','Pronar',
        'Respo','Ryterna','Scanvogn','Selandia','Stema','Variant','Anssems',
        'Humbaur','Tema','Annat'
    ],

    tractor: [
        'Case IH','Claas','Deutz-Fahr','Fendt','Ford/New Holland',
        'John Deere','Kubota','Landini','Massey Ferguson','McCormick',
        'New Holland','Same','Valtra','Zetor','Annat'
    ],

    other: ['Annat'],
};

// ─── Modeller per märke ───────────────────────────────────────────────────────
export const MODELS_BY_MAKE = {

    // ── Personbilar / SUV ──────────────────────────────────────────────────────
    'Alfa Romeo': [
        'Giulia','Giulietta','Stelvio','Tonale','GTV','Spider',
        '147','156','159','166','MiTo','Brera','4C','Annat'
    ],
    'Aston Martin': [
        'DB9','DB11','DBS','Vantage','Rapide','Vanquish',
        'DBX','Valkyrie','Annat'
    ],
    'Audi': [
        'A1','A3','A4','A5','A6','A7','A8',
        'Q2','Q3','Q4 e-tron','Q5','Q7','Q8','Q8 e-tron',
        'e-tron GT','RS3','RS4','RS5','RS6','RS7','RS Q8',
        'S3','S4','S5','S6','S7','S8','SQ5','SQ7','SQ8',
        'TT','TT RS','R8','Allroad','Annat'
    ],
    'Bentley': [
        'Continental GT','Flying Spur','Bentayga','Mulsanne','Annat'
    ],
    'BMW': [
        '1-serien','2-serien','3-serien','4-serien','5-serien',
        '6-serien','7-serien','8-serien',
        'X1','X2','X3','X4','X5','X6','X7','XM',
        'Z3','Z4','M2','M3','M4','M5','M8',
        'i3','i4','i5','i7','iX','iX1','iX3',
        '2-serien Active Tourer','2-serien Gran Tourer','Annat'
    ],
    'BYD': [
        'Atto 3','Han','Tang','Seal','Dolphin','Seagull',
        'Song Plus','Yuan Plus','Sealion 6','Annat'
    ],
    'Cadillac': [
        'CT4','CT5','Escalade','XT4','XT5','XT6','Lyriq','Annat'
    ],
    'Chevrolet': [
        'Camaro','Corvette','Equinox','Malibu','Spark','Tahoe','Trax','Annat'
    ],
    'Citroën': [
        'C1','C3','C3 Aircross','C4','C4 X','C5 Aircross',
        'C5 X','Berlingo','ë-C3','ë-C4','Jumper','Jumpy',
        'SpaceTourer','DS3','DS4','DS5','DS7','Annat'
    ],
    'Cupra': [
        'Formentor','Leon','Born','Ateca','Terramar','Tavascan','Annat'
    ],
    'Dacia': [
        'Sandero','Sandero Stepway','Duster','Jogger','Spring',
        'Logan','Logan MCV','Lodgy','Bigster','Annat'
    ],
    'DS Automobiles': [
        'DS3 Crossback','DS4','DS7 Crossback','DS9','Annat'
    ],
    'Ferrari': [
        '296 GTB','296 GTS','812 Superfast','812 GTS','F8 Tributo',
        'Roma','Portofino','SF90 Stradale','Purosangue','Annat'
    ],
    'Fiat': [
        '500','500C','500X','500e','Panda','Tipo','Punto',
        'Bravo','Ducato','Doblò','Scudo','Talento','Altro'
    ],
    'Ford': [
        'Fiesta','Focus','Mondeo','Mustang','Mustang Mach-E',
        'Puma','Kuga','Explorer','Edge','EcoSport',
        'Ranger','Maverick','F-150','Transit','Transit Connect',
        'Transit Custom','Tourneo','Galaxy','S-MAX','B-MAX',
        'C-MAX','Ka','Ka+','Fusion','Annat'
    ],
    'Genesis': [
        'G70','G80','G90','GV70','GV80','GV60','Electrified G80','Annat'
    ],
    'Honda': [
        'Civic','Accord','CR-V','HR-V','Jazz','e','e:Ny1',
        'ZR-V','FR-V','Legend','Insight','NSX','Pilot','Ridgeline','Annat'
    ],
    'Hyundai': [
        'i10','i20','i20 N','i30','i30 N','i40',
        'Tucson','Kona','Santa Fe','Santa Cruz',
        'IONIQ','IONIQ 5','IONIQ 5 N','IONIQ 6',
        'Nexo','Veloster','Elantra','Sonata',
        'Staria','H-1','Annat'
    ],
    'Infiniti': [
        'Q30','Q50','Q60','Q70','QX30','QX50','QX60','QX70','QX80','Annat'
    ],
    'Jaguar': [
        'E-Pace','F-Pace','I-Pace','XE','XF','XJ','F-Type',
        'XK','S-Type','X-Type','Annat'
    ],
    'Jeep': [
        'Renegade','Compass','Cherokee','Grand Cherokee',
        'Wrangler','Gladiator','Avenger','Commander','Annat'
    ],
    'Kia': [
        'Picanto','Rio','Ceed','ProCeed','Stinger',
        'Sportage','Niro','Sorento','Telluride',
        'EV6','EV9','Soul','Xceed','Carnival','Stonic','Annat'
    ],
    'Lamborghini': [
        'Huracán','Urus','Revuelto','Sterrato','Sián','Altro'
    ],
    'Lancia': [
        'Ypsilon','Delta','Thema','Flavia','Fulvia','Stratos','Annat'
    ],
    'Land Rover': [
        'Defender 90','Defender 110','Defender 130',
        'Discovery','Discovery Sport',
        'Range Rover','Range Rover Sport',
        'Range Rover Evoque','Range Rover Velar',
        'Freelander','Annat'
    ],
    'Leapmotor': [
        'C10','T03','B10','Annat'
    ],
    'Lexus': [
        'CT 200h','IS','ES','GS','LS','NX','RX','UX',
        'LC','GX','LX','RZ','LBX','Annat'
    ],
    'Lotus': [
        'Elise','Exige','Evora','Emira','Eletre','Emeya','Annat'
    ],
    'Lynk & Co': [
        '01','02','03','05','09','Annat'
    ],
    'Maserati': [
        'Ghibli','Quattroporte','Levante','Grecale',
        'GranTurismo','GranCabrio','MC20','Annat'
    ],
    'Mazda': [
        '2','3','6','CX-3','CX-30','CX-5','CX-60','CX-80',
        'MX-5','MX-30','RX-8','CX-7','BT-50','Annat'
    ],
    'McLaren': [
        'Artura','GT','720S','765LT','Elva','Senna','Speedtail','Annat'
    ],
    'Mercedes-Benz': [
        'A-klass','B-klass','C-klass','E-klass','S-klass',
        'CLA','CLS','GLA','GLB','GLC','GLE','GLS',
        'EQA','EQB','EQC','EQE','EQE SUV','EQS','EQS SUV',
        'G-klass','AMG GT','SL','SLC',
        'V-klass','Citan','Sprinter','Vito',
        'A 35 AMG','C 43 AMG','C 63 AMG','E 53 AMG','Annat'
    ],
    'MG': [
        'MG3','MG4','MG5','MG ZS','HS','MG6','Cyberster','Marvel R','Annat'
    ],
    'MINI': [
        'Cooper','Cooper S','Cooper SE','Convertible',
        'Clubman','Countryman','Paceman','Coupe','Roadster',
        'John Cooper Works','Electric','Aceman','Annat'
    ],
    'Mitsubishi': [
        'Colt','Eclipse Cross','Outlander','ASX',
        'L200','Space Star','Pajero','Galant','Annat'
    ],
    'Nio': [
        'ET5','ET5 Touring','ET7','EL6','EL7','EL8','ES8','EC6','EP9','Annat'
    ],
    'Nissan': [
        'Micra','Juke','Qashqai','X-Trail','Leaf','Ariya',
        'Navara','Pathfinder','Murano','350Z','370Z',
        'GT-R','Note','Pulsar','Almera','Primera','Annat'
    ],
    'Omoda': [
        'Omoda 5','Omoda 5 EV','Omoda 7','Annat'
    ],
    'Opel': [
        'Corsa','Astra','Insignia','Grandland','Mokka',
        'Combo','Zafira','Meriva','Antara',
        'Vectra','Omega','Signum','Adam','Karl','Crossland','Annat'
    ],
    'Peugeot': [
        '108','208','308','408','508',
        '2008','3008','4008','5008',
        'e-208','e-2008','e-308','e-3008',
        'Partner','Rifter','Traveller','Boxer','Expert','Annat'
    ],
    'Polestar': [
        'Polestar 1','Polestar 2','Polestar 3','Polestar 4','Polestar 5','Annat'
    ],
    'Porsche': [
        '911','911 Carrera','911 Targa','911 Turbo',
        'Taycan','Taycan Cross Turismo','Taycan Sport Turismo',
        'Panamera','Cayenne','Macan',
        'Boxster','Cayman','918 Spyder','Annat'
    ],
    'Renault': [
        'Clio','Captur','Mégane','Mégane E-Tech','Austral',
        'Kadjar','Koleos','Arkana','Symbioz',
        'Zoe','Twingo','Laguna','Vel Satis',
        'Talisman','Espace','Scénic','Fluence','Latitude',
        'Kangoo','Trafic','Master','Altra'
    ],
    'Rolls-Royce': [
        'Phantom','Ghost','Wraith','Dawn','Cullinan','Spectre','Annat'
    ],
    'Saab': [
        '9-3','9-3 Cabrio','9-5','9-5 SportCombi',
        '900','9000','9-7X','Annat'
    ],
    'SEAT': [
        'Ibiza','Leon','Leon ST','Arona','Ateca','Tarraco',
        'Alhambra','Toledo','Exeo','Mii','Altra'
    ],
    'Škoda': [
        'Fabia','Scala','Octavia','Octavia Scout','Superb',
        'Kamiq','Karoq','Kodiaq','Enyaq','Enyaq Coupé',
        'Rapid','Citigo','Yeti','Roomster','Annat'
    ],
    'Smart': [
        'ForTwo','ForFour','#1','#3','Roadster','Annat'
    ],
    'Subaru': [
        'Impreza','XV','Crosstrek','Forester','Outback','Levorg',
        'Legacy','BRZ','WRX','WRX STI','Tribeca','Solterra','Annat'
    ],
    'Suzuki': [
        'Swift','Ignis','Vitara','S-Cross','Across','Jimny',
        'Baleno','Celerio','Alto','Splash','SX4','Liana','Wagon R+','Annat'
    ],
    'Tesla': [
        'Model 3','Model 3 Highland','Model S','Model S Plaid',
        'Model X','Model X Plaid','Model Y','Cybertruck','Roadster','Annat'
    ],
    'Toyota': [
        'Aygo','Aygo X','Yaris','Yaris Cross',
        'Corolla','Corolla Cross','Camry',
        'RAV4','C-HR','GR Yaris','GR86',
        'Highlander','Land Cruiser','Land Cruiser Prado',
        'bZ4X','Prius','Prius+','Auris','Avensis',
        'Hilux','Proace','Proace City','Verso','Supra','Annat'
    ],
    'Volkswagen': [
        'Up!','Polo','Golf','Golf GTI','Golf R','Golf Plus',
        'Passat','Arteon','Arteon Shooting Brake',
        'Tiguan','T-Roc','T-Cross','Touareg','Touran',
        'ID.2','ID.3','ID.4','ID.5','ID.7','ID.Buzz',
        'Caddy','Transporter','Caravelle','Multivan','Crafter',
        'Phaeton','Sharan','Scirocco','Beetle','Annat'
    ],
    'Volvo': [
        'V40','V40 Cross Country',
        'V60','V60 Cross Country',
        'V70','V90','V90 Cross Country',
        'S40','S60','S80','S90',
        'XC40','XC60','XC70','XC90',
        'C30','C40 Recharge',
        'EX30','EX40','EX90',
        'EC40','Annat'
    ],
    'Xpeng': [
        'P7','P5','G3','G6','G9','X9','Annat'
    ],
    'Zeekr': [
        '001','007','009','X','Mix','Annat'
    ],

    // ── Skåpbilar ──────────────────────────────────────────────────────────────
    'Nissan (van)': [
        'NV200','NV300','NV400','Primastar','Interstar','Annat'
    ],

    // ── Lastbilar ──────────────────────────────────────────────────────────────
    'DAF': ['CF','LF','XF','XG','XG+','Annat'],
    'Iveco': ['Daily','Eurocargo','Stralis','S-Way','Trakker','Annat'],
    'MAN': ['TGE','TGL','TGM','TGS','TGX','Annat'],
    'Renault Trucks': ['Master','Trafic','D','T','C','K','Annat'],
    'Scania': ['L','P','G','R','S','XT','Annat'],
    'Volvo Trucks': ['FL','FE','FM','FH','FH16','VNL','Annat'],

    // ── MC ────────────────────────────────────────────────────────────────────
    'Aprilia': [
        'RS 125','RS 250','RS 660','RS4 125','Tuono 660','Tuono V4',
        'Shiver 900','Dorsoduro','Caponord','RSV4','Mana','Scarabeo','Annat'
    ],
    'BMW Motorrad': [
        'R 1250 GS','R 1250 GS Adventure','R 1250 R','R 1250 RS','R 1250 RT',
        'R nineT','R nineT Scrambler','R nineT Urban G/S',
        'F 750 GS','F 850 GS','F 900 R','F 900 XR',
        'S 1000 RR','S 1000 R','S 1000 XR',
        'M 1000 RR','CE 04','G 310 R','G 310 GS',
        'K 1600 GT','K 1600 GTL','Annat'
    ],
    'Brixton': [
        'Cromwell 250','Crossfire 500','Rayburn 125','Sunray 125','Annat'
    ],
    'Ducati': [
        'Panigale V2','Panigale V4','Streetfighter V2','Streetfighter V4',
        'Monster','Monster SP','Hypermotard 950','Multistrada V2',
        'Multistrada V4','DesertX','Scrambler Icon','Scrambler Nightshift',
        'Diavel V4','SuperSport 950','XDiavel','Annat'
    ],
    'Harley-Davidson': [
        'Sportster','Iron 883','Iron 1200','Forty-Eight',
        'Street 500','Street 750','Street Rod',
        'Softail','Fat Boy','Heritage Classic','Slim','Street Bob',
        'Touring','Road King','Road Glide','Street Glide','Electra Glide',
        'CVO','LiveWire','Pan America','Bronx','Nightster','Annat'
    ],
    'Honda (MC)': [
        'CB125R','CB300R','CB500F','CB500X','CB650R','CB750 Hornet',
        'CB1000R','CBR500R','CBR600RR','CBR650R','CBR1000RR Fireblade',
        'CRF250L','CRF300L','CRF1100L Africa Twin',
        'NC750X','NC750S','NT1100',
        'PCX 125','PCX 150','SH125','SH350',
        'Forza 125','Forza 350','Forza 750',
        'Gold Wing','CMX500 Rebel','CMX1100 Rebel','Monkey','Dax','Annat'
    ],
    'Husqvarna (MC)': [
        'Svartpilen 125','Svartpilen 401','Svartpilen 701',
        'Vitpilen 401','Vitpilen 701',
        'Norden 901','701 Supermoto','701 Enduro','Annat'
    ],
    'Indian': [
        'Scout','Scout Bobber','Scout Rogue','Chief','Chieftain',
        'Springfield','Challenger','Pursuit','FTR','FTR Sport','Annat'
    ],
    'Kawasaki': [
        'Z125 Pro','Z400','Z650','Z900','Z900RS','Z900RS Café',
        'Z1000','Z1000SX','ZX-4R','ZX-6R','ZX-10R','ZX-10RR','ZX-25R',
        'Ninja 400','Ninja 650','Ninja 1000SX',
        'Versys 300X','Versys 650','Versys 1000',
        'Vulcan S','W800','H2','H2R','Z H2',
        'KLX 300','KX 450','Altro'
    ],
    'KTM': [
        '125 Duke','200 Duke','250 Duke','390 Duke','490 Duke',
        '790 Duke','890 Duke','1290 Super Duke R',
        '125 RC','390 RC','790 Adventure','890 Adventure',
        '1090 Adventure','1190 Adventure','1290 Super Adventure',
        '500 EXC-F','300 EXC','450 EXC-F','Freeride E-XC','Annat'
    ],
    'Moto Guzzi': [
        'V7','V85 TT','V9 Bobber','V9 Roamer','V100 Mandello',
        'Stelvio','Griso','Breva','Eldorado','Audace','Annat'
    ],
    'Norton': [
        'Commando 961','V4CR','V4SV','Atlas Nomad','Atlas Ranger','Annat'
    ],
    'Royal Enfield': [
        'Bullet 350','Classic 350','Meteor 350','Hunter 350',
        'Thunderbird 350','Himalayan','Scram 411',
        'Interceptor 650','Continental GT 650','Super Meteor 650','Annat'
    ],
    'Suzuki (MC)': [
        'GSX-R125','GSX-R600','GSX-R750','GSX-R1000',
        'GSX-S125','GSX-S750','GSX-S950','GSX-S1000',
        'SV650','SV650X','V-Strom 650','V-Strom 1050',
        'Burgman 125','Burgman 200','Burgman 400','Burgman 650',
        'DR650','Hayabusa','Katana','Intruder','Annat'
    ],
    'Triumph': [
        'Street Triple','Daytona','Speed Triple','Tiger 660','Tiger 900',
        'Tiger 1200','Bonneville T100','Bonneville T120','Scrambler 400X',
        'Scrambler 900','Scrambler 1200','Thruxton','Thunderbird',
        'Rocket 3','Speed Twin','Trident 660','Tiger Sport 660','Annat'
    ],
    'Ural': ['Gear Up','CT','Tourist','Retro','Wolf','Patrol','Annat'],
    'Yamaha (MC)': [
        'MT-03','MT-07','MT-09','MT-10',
        'R3','R7','YZF-R1','YZF-R1M',
        'Ténéré 700','Ténéré 700 Rally','XSR700','XSR900',
        'NMAX 125','XMAX 125','XMAX 300','XMAX 400',
        'TMAX 560','Tracer 7','Tracer 9','FJR1300',
        'VMAX','Bolt','V-Star','WR450F','Annat'
    ],
    'Zontes': ['310T','310X','350T','350X','350R','Annat'],

    // ── Moped / Scooter ───────────────────────────────────────────────────────
    'Vespa': [
        'Primavera 50','Primavera 125','Sprint 50','Sprint 125',
        'GTS 125','GTS 300','GTV','946','Elettrica','Annat'
    ],
    'Piaggio': [
        'Liberty 50','Liberty 125','Liberty 150','Medley 125',
        'Medley 150','MP3 300','MP3 500','Typhoon 50','Typhoon 125','Annat'
    ],
    'Kymco': [
        'Like 50','Like 125','Like 150','People S 125','People S 300',
        'Downtown 125','Downtown 350','AK 550','K-Pipe','Agility','Annat'
    ],

    // ── ATV ───────────────────────────────────────────────────────────────────
    'BRP Can-Am': [
        'Outlander 450','Outlander 650','Outlander 850','Outlander 1000',
        'Renegade 570','Renegade 1000','Maverick X3','Defender','Spyder','Ryker','Annat'
    ],
    'Polaris': [
        'Sportsman 450','Sportsman 570','Sportsman 850','Sportsman 1000',
        'Scrambler XP 1000','RZR XP 1000','Ranger 570','Ranger 1000',
        'General 1000','ACE 570','Annat'
    ],
    'CF Moto': [
        'CForce 450','CForce 520','CForce 600','CForce 800','CForce 1000',
        'UForce 600','UForce 1000','ZForce 800','ZForce 1000','Annat'
    ],
    'Yamaha (ATV)': [
        'YFM 90R','YFM 450F','YFM 700R Raptor','Grizzly 700',
        'Kodiak 450','Kodiak 700','Viking 700','Wolverine X2','Annat'
    ],
    'Honda (ATV)': [
        'TRX90X','TRX250X','TRX420','TRX450R','TRX500','FourTrax Foreman',
        'FourTrax Rancher','FourTrax Recon','Talon 1000','Pioneer 1000','Annat'
    ],
    'Kawasaki (ATV)': [
        'KFX 50','KFX 90','KFX 450R','Brute Force 300',
        'Brute Force 750','Teryx','Mule PRO','Annat'
    ],
    'Arctic Cat': [
        'TRV 500','TRV 700','Alterra 300','Alterra 450','Alterra 570',
        'Alterra 700','Prowler 500','Wildcat Sport','Wildcat Trail','Annat'
    ],

    // ── Snöskoter ─────────────────────────────────────────────────────────────
    'BRP Ski-Doo': [
        'Summit','Freeride','Renegade','Backcountry','MXZ',
        'Skandic','Expedition','Tundra','Expedition Sport','Annat'
    ],
    'Lynx': [
        'Rave','Commander','Xterrain RE','BoonDocker','Annat'
    ],
    'Polaris (snöskoter)': [
        'Indy','Indy XC','Switchback','AXYS RMK','Matryx','Khaos','Patriot','Annat'
    ],
    'Yamaha (snöskoter)': [
        'Sidewinder','SR Viper','SRX','Phazer','VK Professional','Altro'
    ],
    'Arctic Cat / Textron': [
        'ZR','ZR Thundercat','XF','M','Riot','Blast','Bearcat','Pantera','Annat'
    ],

    // ── Båt / Vattenskoter ────────────────────────────────────────────────────
    'BRP Sea-Doo': [
        'Spark','Spark Trixx','GTI 90','GTI 130','GTI SE',
        'GTR 230','GTX 300','GTX Limited','RXT-X 300',
        'Wake Pro 230','Fish Pro Scout','Fish Pro Trophy','Annat'
    ],
    'Yamaha WaveRunner': [
        'VX','VX Cruiser','VXR','VXS','FX HO','FX Cruiser HO',
        'FX SVHO','FX Cruiser SVHO','GP1800R SVHO','Annat'
    ],
    'Nimbus': ['T11 R','T11 RS','C9 R','M3 Coupe','Annat'],
    'Ryds': ['46','50','52','56','62','64','68','70','Annat'],
    'Hallberg-Rassy': ['310','340','370','400','412','440','57','64','Annat'],
    'Jeanneau': [
        'Sun Fast','Sun Odyssey','Merry Fisher','Leader','Cap Camarat','Altro'
    ],

    // ── Husvagnar ─────────────────────────────────────────────────────────────
    'Adria': [
        'Altea','Adora','Aviva','Alpina','Action','Astella','Annat'
    ],
    'Cabby': ['540 UL','560 UL','600 UL','Annat'],
    'Dethleffs': [
        'Camper','Beduin','Nomad','Coco','Nordland','Fulda','Troll','Annat'
    ],
    'Eriba': [
        'Touring 310','Touring 430','Touring 540','Touring 640',
        'Exciting 510','Feeling 410','Feeling 510','Annat'
    ],
    'Hobby': [
        'De Luxe','Premium','Excellent Edition','Prestige','Vantage','Optima','Annat'
    ],
    'Hymer (husvagn)': [
        'Eriba Touring','Nova','Vision','Troll','Classic','Venture','Altro'
    ],
    'Kabe': [
        'Royal 470','Royal 520','Royal 560','Royal 600',
        'Classic 470','Classic 520','Travel Master 600',
        'Smålänningen','Ametyst','Safir','Topaz','Caravan','Annat'
    ],
    'Knaus': [
        'Sport','Sudwind','Eurostar','Starclass','Travelino',
        'Azur','Skandinavian','Deseo','Annat'
    ],
    'Polar': [
        'Malibu','Malibu 2','Crown','Crown 1','Silver','Silver 2','Aquila','Annat'
    ],
    'Tabbert': [
        'Da Vinci','Rossini','Cellini','Vivaldi','Puccini','Otro'
    ],
    'Weinsberg': [
        'CaraOne','CaraTwo','CaraPlus','CaraCompact','Annat'
    ],

    // ── Husbilar ──────────────────────────────────────────────────────────────
    'Bürstner': [
        'Ixeo','Lyseo','Lyseo TD','Travel Van','Harmony',
        'Campeo','City Car','Premio','Travato','Altro'
    ],
    'Carado': [
        'T 337','T 447','T 448','V 337','V 600','A 361','A 461','Annat'
    ],
    'Chausson': [
        'Flash','Titanium','Welcome','VIP','Anniversary','Spec Line','Altro'
    ],
    'Hymer': [
        'B-Klasse','BMC','ML-T','T-Klasse','Grand Canyon S',
        'Free 600 S','Duocar S','Eriba Nova','Exsis-i','Starline','Annat'
    ],
    'Kabe (husbil)': [
        'TM 600','TM 700','TM 780','TM 900','Imperial 600','Annat'
    ],
    'Knaus (husbil)': [
        'Sky Ti','Sky Wave','Van I','Boxdrive','Sun TI','Sun Wave','Andet'
    ],
    'Laika': [
        'Ecovip','Kosmo','Kreos','Rexosline','Altro'
    ],
    'Sunlight': [
        'T 60','T 65','T 68','V 65','V 68','R 69','A 70','Annat'
    ],
    'Weinsberg (husbil)': [
        'CaraCompact','CaraBus','CaraMobil','CaraHome','Annat'
    ],

    // ── Släpkärror ────────────────────────────────────────────────────────────
    'Fogelsta': [
        'EP 250','EP 350','EP 500','EP 750','EPF 750',
        'VS 250','VS 350','VS 500','CS 750','CS 1000',
        'Båttrailer','Hästtrailer','Annat'
    ],
    'Ifor Williams': [
        'P6E','P7E','LM105G','LM126G','HB510','HB610','TB5114',
        'GH126','GH146','GD126','Flatbed','Tipper','Annat'
    ],
    'Humbaur': [
        'HUK 132513','HUK 152515','HT 152515','HU 132314',
        'Pullman','STAR','MULTI','Andet'
    ],
    'Brian James': [
        'A4 Transporter','Cargo Connect','Cargo Flatbed',
        'C4 Competition','Argocat Trailer','Enclosed Car Transporter','Annat'
    ],
    'Anssems': [
        'BSX 750','BSX 1350','MSX 750','MSX 1350',
        'Bagagewagen','Flatbed','Annat'
    ],
    'Tema': [
        '1000 kg','1300 kg','1500 kg','2000 kg','Bantam','Bantam XL','Annat'
    ],
    'Variant': [
        'Classic','XL','Jumbo','Max','Mono','Duo','Trio','Andet'
    ],

    // ── Traktorer ─────────────────────────────────────────────────────────────
    'John Deere': [
        '3E','3R','4M','4R','5M','5R','6M','6R','7R','8R','8RT',
        '9R','9RT','9RX','Gator','Annat'
    ],
    'Fendt': [
        '200 Vario','300 Vario','500 Vario','700 Vario',
        '800 Vario','900 Vario','1000 Vario','Annat'
    ],
    'New Holland': [
        'T4','T5','T6','T7','T8','T9','TH','TK','FR','CR','Annat'
    ],
    'Case IH': [
        'Farmall A','Farmall B','Farmall C','Farmall U',
        'Maxxum','Puma','Optum','Steiger','Axial-Flow','Annat'
    ],
    'Massey Ferguson': [
        'MF 3700','MF 4700','MF 5700','MF 6700','MF 7700',
        'MF 8700','MF 9505','MF Activa','Annat'
    ],
    'Claas': [
        'Elios','Nexos','Arion','Axion','Xerion',
        'Lexion','Trion','Dominator','Liner','Rollant','Annat'
    ],
    'Valtra': [
        'A','N','T','S','Q-serien','Annat'
    ],
    'Kubota': [
        'B-serien','L-serien','M-serien','MX-serien',
        'BX-serien','KX-serien (grävare)','Annat'
    ],
    'Deutz-Fahr': [
        '3D','4D','5D','6D','7D','5G','6G','7G',
        'Agrotron','Fahr Combine','Annat'
    ],
    'Zetor': [
        'Proxima','Forterra','Crystal','Major','Minor','Altro'
    ],

    // ── Generisk fallback ─────────────────────────────────────────────────────
    'Annat': ['Annat'],
};
