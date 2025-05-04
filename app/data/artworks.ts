import { Artwork } from '@/app/models/types';

// Функция для генерации ID
const generateId = (index: number): string => {
  return `artwork-${index + 1}`;
};

// Функция для генерации Unsplash URL на основе ID
const getUnsplashUrl = (photoId: string): string => {
  // Преобразуем photoId в стабильный Unsplash URL
  // Вместо привязки к photoId, используем набор конкретных фото-ID для разных категорий
  
  // Набор ID для пейзажей
  const landscapePhotos = [
    'photo-1470770841072-f978cf4d019e', // горы
    'photo-1506744038136-46273834b3fb', // горная река
    'photo-1501785888041-af3ef285b470', // горы с туманом
    'photo-1441974231531-c6227db76b6e', // лес
    'photo-1520962880247-cfaf541c8724', // поле
    'photo-1476362555312-ab9e108a0b7e', // осенний лес
    'photo-1604537466158-719b1972feb8', // река
  ];

  // Набор ID для портретов
  const portraitPhotos = [
    'photo-1578926288207-a90a5366759d', // женский портрет
    'photo-1522075469751-3a6694fb2f61', // мужской портрет
    'photo-1531746020798-e6953c6e8e04', // пожилой человек 
    'photo-1531123897727-8f129e1688ce', // девушка
    'photo-1539571696357-5a69c17a67c6', // мужчина
    'photo-1494790108377-be9c29b29330', // женщина улыбается
  ];

  // Набор ID для абстрактного искусства
  const abstractPhotos = [
    'photo-1536924940846-227afb31e2a5', // абстрактная живопись
    'photo-1489549132488-d00b7eee80f1', // краски
    'photo-1618005182384-a83a8bd57fbe', // абстрактный узор (замена)
    'photo-1543857778-c4a1a3e0b2eb', // арт-инсталляция
    'photo-1484589065579-248aad0d8b13', // яркие краски
    'photo-1528459801416-a9e53bbf4e17', // геометрическая абстракция
  ];

  // Набор ID для натюрмортов
  const stillLifePhotos = [
    'photo-1562157974-a606c8c0d827', // цветы (замена)
    'photo-1525310072745-f49212b5ac6d', // фрукты
    'photo-1482012792084-a0c3725f289f', // чашка
    'photo-1563897539040-8c41586326a0', // еда (замена)
    'photo-1513519245088-0e12902e5a38', // цветочная композиция
  ];

  // Выбираем фото из соответствующей категории на основе числового ID
  const numId = parseInt(photoId.replace(/\D/g, '') || '1', 10);
  
  if (numId % 4 === 0) {
    return `https://images.unsplash.com/${portraitPhotos[numId % portraitPhotos.length]}?w=800&h=800&fit=crop`;
  } else if (numId % 4 === 1) {
    return `https://images.unsplash.com/${landscapePhotos[numId % landscapePhotos.length]}?w=800&h=800&fit=crop`;
  } else if (numId % 4 === 2) {
    return `https://images.unsplash.com/${abstractPhotos[numId % abstractPhotos.length]}?w=800&h=800&fit=crop`;
  } else {
    return `https://images.unsplash.com/${stillLifePhotos[numId % stillLifePhotos.length]}?w=800&h=800&fit=crop`;
  }
};

// Базовые данные художников для работ
const ARTISTS = [
  {
    id: '1',
    name: 'Марина Иванова',
    avatar: 'https://i.pravatar.cc/150?img=36',
  },
  {
    id: '2',
    name: 'Алексей Петров',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '3',
    name: 'Елена Смирнова',
    avatar: 'https://i.pravatar.cc/150?img=25',
  },
  {
    id: '4',
    name: 'Михаил Лебедев',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  },
  {
    id: '5',
    name: 'Анна Соколова',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  },
  {
    id: '6',
    name: 'Алексей Иванов',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
  },
  {
    id: '7',
    name: 'Светлана Морозова',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '8',
    name: 'Дмитрий Волков',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: '9',
    name: 'Ольга Кузнецова',
    avatar: 'https://i.pravatar.cc/150?img=57',
  },
  {
    id: '10',
    name: 'Игорь Соколов',
    avatar: 'https://i.pravatar.cc/150?img=52',
  },
];

// Функция для случайного выбора элемента из массива
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Функция для генерации случайной даты в заданном диапазоне
const getRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Создаем фиксированные работы (чтобы избежать несоответствий)
const fixedArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Закат в горах',
    description: 'Акварельная живопись вечернего заката в горах. Работа выполнена на бумаге высокого качества с использованием профессиональных акварельных красок.',
    images: ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=800&fit=crop',
    artistId: '1',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Живопись'],
    tags: ['пейзаж', 'закат', 'горы'],
    medium: 'Акварель',
    dimensions: '40x30 см',
    createdYear: 2023,
    likes: 450,
    views: 1230,
    comments: 28,
    isForSale: true,
    price: 15000,
    currency: 'RUB',
    createdAt: '2023-05-12'
  },
  {
    id: '8',
    title: 'Фантастический мир',
    description: 'Цифровая иллюстрация фантастического мира с летающими островами и необычными существами.',
    images: ['https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&h=800&fit=crop',
    artistId: '1',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Цифровое искусство'],
    tags: ['фэнтези', 'иллюстрация', 'цифровое'],
    medium: 'Цифровая иллюстрация',
    dimensions: '4000x2500 px',
    createdYear: 2023,
    likes: 520,
    views: 1800,
    comments: 43,
    isForSale: true,
    price: 20000,
    currency: 'RUB',
    createdAt: '2023-07-18'
  }
];

// Генерируем работы для категории "Живопись", начиная с ID 9 (чтобы не перекрывать фиксированные)
const paintingArtworks: Artwork[] = Array.from({ length: 26 }, (_, index) => {
  const artist = getRandomItem(ARTISTS);
  const id = generateId(index + 8); // Сдвигаем индекс, чтобы не пересекаться с фиксированными
  const likes = Math.floor(Math.random() * 500) + 50;
  const views = likes * (Math.floor(Math.random() * 5) + 3);
  const comments = Math.floor(likes / (Math.floor(Math.random() * 5) + 2));
  const isForSale = Math.random() > 0.3;
  const price = isForSale ? Math.floor(Math.random() * 30000) + 5000 : undefined;
  
  const paintings = [
    { title: 'Закат на море', imageId: '1029' },
    { title: 'Горный пейзаж', imageId: '1036' },
    { title: 'Осенний лес', imageId: '1043' },
    { title: 'Цветочная поляна', imageId: '1055' },
    { title: 'Утренний туман', imageId: '1067' },
    { title: 'Зимний вечер', imageId: '1074' },
    { title: 'Городская улица', imageId: '149' },
    { title: 'Старый мост', imageId: '165' },
    { title: 'Лодки на озере', imageId: '188' },
    { title: 'Натюрморт с фруктами', imageId: '206' },
    { title: 'Летний сад', imageId: '237' },
    { title: 'Портрет девушки', imageId: '256' },
    { title: 'Морской берег', imageId: '292' },
    { title: 'Закат в поле', imageId: '334' },
    { title: 'Яблоневый сад', imageId: '338' },
    { title: 'Деревенский пейзаж', imageId: '353' },
    { title: 'Ночной город', imageId: '364' },
    { title: 'Портрет пожилого человека', imageId: '375' },
    { title: 'Весенний парк', imageId: '386' },
    { title: 'Горная река', imageId: '429' },
    { title: 'Лесная тропа', imageId: '433' },
    { title: 'Цветы в вазе', imageId: '464' },
    { title: 'Морской пейзаж', imageId: '48' },
    { title: 'Старый дом', imageId: '582' },
    { title: 'Портрет мужчины', imageId: '599' },
    { title: 'Туманное утро', imageId: '633' },
    { title: 'Осенний парк', imageId: '645' },
    { title: 'Летний день', imageId: '655' },
  ];
  
  const paintingData = paintings[index % paintings.length];
  const imageUrl = getUnsplashUrl(paintingData.imageId);
  
  const mediums = ['Масло', 'Акрил', 'Темпера', 'Гуашь'];
  const tags = ['пейзаж', 'природа', 'живопись', 'классика', 'цвет', 'искусство', 'холст'];
  
  return {
    id,
    title: paintingData.title,
    description: `Картина "${paintingData.title}" выполнена в технике ${getRandomItem(mediums).toLowerCase()} на холсте. Работа отражает красоту природы и мастерство художника в передаче цвета и света.`,
    images: [imageUrl],
    thumbnailUrl: imageUrl,
    artistId: artist.id,
    artistName: artist.name,
    artistAvatar: artist.avatar,
    categories: ['Живопись'],
    tags: Array.from({ length: 3 }, () => getRandomItem(tags)),
    medium: getRandomItem(mediums),
    dimensions: `${40 + Math.floor(Math.random() * 60)}x${30 + Math.floor(Math.random() * 40)} см`,
    createdYear: 2020 + Math.floor(Math.random() * 4),
    likes,
    views,
    comments,
    isForSale,
    price,
    currency: 'RUB',
    createdAt: getRandomDate(new Date(2022, 0, 1), new Date())
  };
});

// Генерируем работы для категории "Графика"
const graphicsArtworks: Artwork[] = Array.from({ length: 25 }, (_, index) => {
  const artist = getRandomItem(ARTISTS);
  const id = generateId(100 + index);
  const likes = Math.floor(Math.random() * 400) + 30;
  const views = likes * (Math.floor(Math.random() * 5) + 3);
  const comments = Math.floor(likes / (Math.floor(Math.random() * 5) + 2));
  const isForSale = Math.random() > 0.4;
  const price = isForSale ? Math.floor(Math.random() * 15000) + 3000 : undefined;
  
  const graphics = [
    { title: 'Линейный портрет', imageId: '822' },
    { title: 'Городской скетч', imageId: '827' },
    { title: 'Абстрактная композиция', imageId: '835' },
    { title: 'Анатомический рисунок', imageId: '841' },
    { title: 'Геометрические формы', imageId: '856' },
    { title: 'Зарисовки природы', imageId: '866' },
    { title: 'Портрет тушью', imageId: '874' },
    { title: 'Иллюстрация к сказке', imageId: '881' },
    { title: 'Игра теней', imageId: '883' },
    { title: 'Архитектурный скетч', imageId: '889' },
    { title: 'Рисунок животного', imageId: '113' },
    { title: 'Ботаническая зарисовка', imageId: '122' },
    { title: 'Портрет углем', imageId: '320' },
    { title: 'Натюрморт карандашом', imageId: '331' },
    { title: 'Пейзажный эскиз', imageId: '453' },
    { title: 'Иллюстрация персонажа', imageId: '456' },
    { title: 'Работа с точками', imageId: '461' },
    { title: 'Графический орнамент', imageId: '477' },
    { title: 'Модный эскиз', imageId: '488' },
    { title: 'Динамическая фигура', imageId: '493' },
    { title: 'Объемные формы', imageId: '499' },
    { title: 'Линейная перспектива', imageId: '505' },
    { title: 'Штриховой портрет', imageId: '542' },
    { title: 'Зарисовки улицы', imageId: '548' },
    { title: 'Характерный персонаж', imageId: '550' },
  ];
  
  const graphicData = graphics[index % graphics.length];
  const imageUrl = getUnsplashUrl(graphicData.imageId);
  
  const mediums = ['Карандаш', 'Уголь', 'Тушь', 'Пастель', 'Маркер'];
  const tags = ['графика', 'рисунок', 'скетч', 'линии', 'штриховка', 'набросок', 'иллюстрация'];
  
  return {
    id,
    title: graphicData.title,
    description: `"${graphicData.title}" — графическая работа, выполненная в технике ${getRandomItem(mediums).toLowerCase()}. Художник демонстрирует мастерство работы с линией и формой.`,
    images: [imageUrl],
    thumbnailUrl: imageUrl,
    artistId: artist.id,
    artistName: artist.name,
    artistAvatar: artist.avatar,
    categories: ['Графика'],
    tags: Array.from({ length: 3 }, () => getRandomItem(tags)),
    medium: getRandomItem(mediums),
    dimensions: `${20 + Math.floor(Math.random() * 30)}x${15 + Math.floor(Math.random() * 25)} см`,
    createdYear: 2020 + Math.floor(Math.random() * 4),
    likes,
    views,
    comments,
    isForSale,
    price,
    currency: 'RUB',
    createdAt: getRandomDate(new Date(2022, 0, 1), new Date())
  };
});

// Генерируем работы для категории "Цифровое искусство"
const digitalArtworks: Artwork[] = Array.from({ length: 33 }, (_, index) => {
  const artist = getRandomItem(ARTISTS);
  const id = generateId(200 + index);
  const likes = Math.floor(Math.random() * 600) + 100;
  const views = likes * (Math.floor(Math.random() * 6) + 4);
  const comments = Math.floor(likes / (Math.floor(Math.random() * 4) + 2));
  const isForSale = Math.random() > 0.5;
  const price = isForSale ? Math.floor(Math.random() * 20000) + 5000 : undefined;
  
  const digitalArts = [
    { title: 'Киберпанк город', imageId: '1010' },
    { title: 'Фантастический пейзаж', imageId: '1024' },
    { title: 'Цифровой портрет', imageId: '1026' },
    { title: 'Космическая сцена', imageId: '1039' },
    { title: 'Футуристический интерьер', imageId: '104' },
    { title: 'Мистический лес', imageId: '106' },
    { title: 'Концепт-арт персонажа', imageId: '177' },
    { title: 'Неоновые улицы', imageId: '200' },
    { title: 'Абстрактная композиция', imageId: '219' },
    { title: 'Фэнтези существо', imageId: '230' },
    { title: 'Научно-фантастический корабль', imageId: '248' },
    { title: 'Городской киберпанк', imageId: '257' },
    { title: 'Фантастический замок', imageId: '25' },
    { title: 'Портрет в неоновых тонах', imageId: '268' },
    { title: 'Мир будущего', imageId: '28' },
    { title: 'Волшебный пейзаж', imageId: '287' },
    { title: 'Роботизированный персонаж', imageId: '342' },
    { title: 'Цифровой пейзаж', imageId: '349' },
    { title: 'Космический пейзаж', imageId: '360' },
    { title: 'Сюрреалистическая сцена', imageId: '372' },
    { title: 'Фантастическое существо', imageId: '40' },
    { title: 'Магический портал', imageId: '425' },
    { title: 'Киберпанк персонаж', imageId: '431' },
    { title: 'Футуристический город', imageId: '628' },
    { title: 'Цифровая абстракция', imageId: '660' },
    { title: 'Фэнтези герой', imageId: '669' },
    { title: 'Научно-фантастический мир', imageId: '674' },
    { title: 'Сказочная сцена', imageId: '678' },
    { title: 'Постапокалиптический пейзаж', imageId: '685' },
    { title: 'Киберпанк портрет', imageId: '695' },
    { title: 'Фантастическая архитектура', imageId: '703' },
    { title: 'Цифровой концепт-арт', imageId: '306' },
    { title: 'Фэнтези мир', imageId: '314' },
  ];
  
  const digitalArtData = digitalArts[index % digitalArts.length];
  const imageUrl = getUnsplashUrl(digitalArtData.imageId);
  
  const mediums = ['Цифровая иллюстрация', '3D моделирование', 'Фотоманипуляция', 'Векторная графика', 'Пиксель-арт'];
  const software = ['Photoshop', 'Procreate', 'Blender', 'Illustrator', 'ZBrush', 'Clip Studio Paint'];
  const tags = ['цифровое искусство', 'иллюстрация', 'концепт-арт', 'фэнтези', 'sci-fi', 'диджитал', 'арт'];
  
  return {
    id,
    title: digitalArtData.title,
    description: `"${digitalArtData.title}" — цифровая работа, созданная в программе ${getRandomItem(software)}. Автор использует ${getRandomItem(mediums).toLowerCase()} для создания уникального визуального опыта.`,
    images: [imageUrl],
    thumbnailUrl: imageUrl,
    artistId: artist.id,
    artistName: artist.name,
    artistAvatar: artist.avatar,
    categories: ['Цифровое искусство'],
    tags: Array.from({ length: 3 }, () => getRandomItem(tags)),
    medium: getRandomItem(mediums),
    dimensions: `${1920 + Math.floor(Math.random() * 2000)}x${1080 + Math.floor(Math.random() * 1200)} px`,
    createdYear: 2020 + Math.floor(Math.random() * 4),
    likes,
    views,
    comments,
    isForSale,
    price,
    currency: 'RUB',
    createdAt: getRandomDate(new Date(2022, 0, 1), new Date())
  };
});

// Генерируем работы для других категорий (приводим только 1 пример, остальные будут иметь похожую структуру)
const sculptureArtworks: Artwork[] = Array.from({ length: 19 }, (_, index) => {
  const artist = getRandomItem(ARTISTS);
  const id = generateId(300 + index);
  const likes = Math.floor(Math.random() * 350) + 50;
  const views = likes * (Math.floor(Math.random() * 4) + 2);
  const comments = Math.floor(likes / (Math.floor(Math.random() * 5) + 2));
  const isForSale = Math.random() > 0.3;
  const price = isForSale ? Math.floor(Math.random() * 100000) + 15000 : undefined;
  
  const sculptures = [
    { title: 'Абстрактная форма', imageId: '157' },
    { title: 'Фигура человека', imageId: '169' },
    { title: 'Животное в движении', imageId: '529' },
    { title: 'Геометрическая композиция', imageId: '534' },
    { title: 'Текстурная скульптура', imageId: '538' },
    { title: 'Динамическая форма', imageId: '541' },
    { title: 'Минималистичная композиция', imageId: '679' },
    { title: 'Абстрактный портрет', imageId: '695' },
    { title: 'Органическая форма', imageId: '704' },
    { title: 'Скульптурная инсталляция', imageId: '715' },
    { title: 'Архитектурный элемент', imageId: '167' },
    { title: 'Фигуративная композиция', imageId: '183' },
    { title: 'Мифологический персонаж', imageId: '513' },
    { title: 'Современная форма', imageId: '809' },
    { title: 'Классический бюст', imageId: '816' },
    { title: 'Абстрактный объект', imageId: '823' },
    { title: 'Текстурная форма', imageId: '832' },
    { title: 'Скульптурный рельеф', imageId: '838' },
    { title: 'Минималистичный объект', imageId: '840' },
  ];
  
  const sculptureData = sculptures[index % sculptures.length];
  const imageUrl = getUnsplashUrl(sculptureData.imageId);
  
  const mediums = ['Бронза', 'Мрамор', 'Дерево', 'Глина', 'Металл', 'Гипс', 'Смешанная техника'];
  const tags = ['скульптура', 'объем', 'форма', '3D', 'пластика', 'композиция', 'искусство'];
  
  return {
    id,
    title: sculptureData.title,
    description: `Скульптура "${sculptureData.title}" выполнена из ${getRandomItem(mediums).toLowerCase()}. Автор исследует форму и объем, создавая выразительную трехмерную композицию.`,
    images: [imageUrl],
    thumbnailUrl: imageUrl,
    artistId: artist.id,
    artistName: artist.name,
    artistAvatar: artist.avatar,
    categories: ['Скульптура'],
    tags: Array.from({ length: 3 }, () => getRandomItem(tags)),
    medium: getRandomItem(mediums),
    dimensions: `${20 + Math.floor(Math.random() * 80)}x${15 + Math.floor(Math.random() * 60)}x${10 + Math.floor(Math.random() * 40)} см`,
    createdYear: 2020 + Math.floor(Math.random() * 4),
    likes,
    views,
    comments,
    isForSale,
    price,
    currency: 'RUB',
    createdAt: getRandomDate(new Date(2022, 0, 1), new Date())
  };
});

// Объединяем все работы в один массив, начиная с фиксированных работ
export const MOCK_ARTWORKS: Artwork[] = [
  ...fixedArtworks,
  ...paintingArtworks,
  ...graphicsArtworks,
  ...digitalArtworks,
  ...sculptureArtworks,
];

// Добавляем экспорт по умолчанию
export default { MOCK_ARTWORKS }; 