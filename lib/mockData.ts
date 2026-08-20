export interface MockQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface MockQuiz {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  questions: MockQuestion[];
}

export interface TopicCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge: string;
  popular?: boolean;
}

export const FEATURED_CATEGORIES: TopicCategory[] = [
  {
    id: 'technology',
    name: 'Teknologi & Coding',
    description: 'JavaScript, AI, Web Architecture, & Cloud Computing',
    icon: 'Code2',
    badge: 'Popular',
    popular: true,
  },
  {
    id: 'science',
    name: 'Sains & Alam Semesta',
    description: 'Fisika Kuantum, Astronomi, Kimia, & Biologi Molekuler',
    icon: 'Atom',
    badge: 'Trending',
    popular: true,
  },
  {
    id: 'history',
    name: 'Sejarah & Peradaban',
    description: 'Peradaban Kuno, Perang Dunia, & Sejarah Dunia Modern',
    icon: 'Landmark',
    badge: 'Classic',
  },
  {
    id: 'geography',
    name: 'Geografi & Dunia',
    description: 'Ibukota, Bentang Alam, Batas Negara, & Fenomena Bumi',
    icon: 'Globe2',
    badge: 'Explore',
  },
  {
    id: 'popculture',
    name: 'Pop Culture & Film',
    description: 'Bioskop, Musik Global, Gaming, & Budaya Populer',
    icon: 'Film',
    badge: 'Fun',
  },
  {
    id: 'general',
    name: 'Pengetahuan Umum',
    description: 'Fakta Unik Dunia, Logika, & Wawasan Luas',
    icon: 'BrainCircuit',
    badge: 'Versatile',
  },
];

export const MOCK_QUESTION_BANK: Record<string, MockQuestion[]> = {
  technology: [
    {
      id: 101,
      question: 'Apa fungsi utama dari hook useEffect di React?',
      options: [
        'Menangani efek samping seperti fetching data atau subscription',
        'Menggantikan fungsi component lifecycle class secara total tanpa batas',
        'Membuat routing halaman otomatis di Next.js',
        'Menyimpan state global tanpa perlu Context API',
      ],
      correct: 0,
      explanation: 'useEffect digunakan untuk mengeksekusi side effects (pengambilan data, manipulasi DOM langsung, timer) setelah komponen dirender.',
    },
    {
      id: 102,
      question: 'Manakah arsitektur CSS di Next.js yang memproses utilitas saat build time?',
      options: ['Tailwind CSS', 'Sass Runtime', 'CSS-in-JS dengan styled-components klasik', 'Inline Style Object'],
      correct: 0,
      explanation: 'Tailwind CSS adalah utility-first CSS framework yang melakukan scanning kode dan men-generate class saat build time (AOT compilation).',
    },
    {
      id: 103,
      question: 'Apa kepanjangan dari HTTP status code 404?',
      options: ['Forbidden', 'Internal Server Error', 'Not Found', 'Unauthorized'],
      correct: 2,
      explanation: 'HTTP 404 Not Found menunjukkan bahwa server tidak dapat menemukan resource yang diminta oleh client.',
    },
    {
      id: 104,
      question: 'Dalam JavaScript, apa perbedaan utama antara let dan const?',
      options: [
        'let bersifat immutable, sedangkan const mutable',
        'const tidak dapat di-reassign setelah dideklarasikan, sedangkan let bisa',
        'let hanya bisa digunakan di dalam loop function',
        'const memiliki scope global sedangkan let block scoped',
      ],
      correct: 1,
      explanation: 'Variabel yang dideklarasikan dengan const tidak bisa di-reassign nilai referensinya, sedangkan let mengizinkan reassignment.',
    },
    {
      id: 105,
      question: 'Apa kepanjangan dari SQL dalam manajemen database?',
      options: [
        'Structured Query Language',
        'Sequential Quality Language',
        'Simple Query Logic',
        'Standard Question List',
      ],
      correct: 0,
      explanation: 'SQL (Structured Query Language) adalah bahasa standar domain-specific untuk mengelola dan memanipulasi data pada Relational DBMS.',
    },
    {
      id: 106,
      question: 'Struktur data apa yang menggunakan prinsip LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
      correct: 1,
      explanation: 'Stack (Tumpukan) memproses data dengan prinsip LIFO, di mana elemen yang terakhir masuk adalah yang pertama keluar.',
    },
    {
      id: 107,
      question: 'Manakah format data standar yang berbasis pasangan kunci-nilai teks ringan untuk pertukaran API?',
      options: ['XML', 'JSON', 'YAML', 'Protobuf'],
      correct: 1,
      explanation: 'JSON (JavaScript Object Notation) adalah format pertukaran data ringan berbasis teks yang paling umum digunakan dalam web API.',
    },
    {
      id: 108,
      question: 'Algoritma pencarian mana yang memiliki kompleksitas waktu O(log n) pada array terurut?',
      options: ['Linear Search', 'Binary Search', 'Bubble Search', 'Depth First Search'],
      correct: 1,
      explanation: 'Binary search membagi rentang pencarian menjadi dua pada setiap langkah, menghasilkan performa efisien O(log n).',
    },
  ],
  science: [
    {
      id: 201,
      question: 'Apa simbol kimia untuk emas?',
      options: ['Au', 'Ag', 'Fe', 'Cu'],
      correct: 0,
      explanation: 'Emas memiliki simbol kimia Au yang berasal dari bahasa Latin "aurum" (berkilau).',
    },
    {
      id: 202,
      question: 'Planet mana dalam tata surya kita yang dijuluki sebagai "Planet Merah"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturnus'],
      correct: 1,
      explanation: 'Mars disebut Planet Merah karena permukaannya mengandung konsentrasi tinggi oksida besi (karat).',
    },
    {
      id: 203,
      question: 'Organel sel mana yang dikenal sebagai "powerhouse" atau pembangkit energi sel?',
      options: ['Nukleus', 'Mitokondria', 'Ribosom', 'Aparatus Golgi'],
      correct: 1,
      explanation: 'Mitokondria bertanggung jawab memproduksi molekul ATP melalui respirasi seluler.',
    },
    {
      id: 204,
      question: 'Berapa perkiraan kecepatan cahaya dalam ruang hampa udara?',
      options: ['300.000 km/detik', '150.000 km/detik', '3.000.000 km/detik', '30.000 km/detik'],
      correct: 0,
      explanation: 'Kecepatan cahaya (c) adalah sekitar 299.792 km/detik, umumnya dibulatkan menjadi 300.000 km/detik (3 × 10⁸ m/s).',
    },
    {
      id: 205,
      question: 'Gas apa yang paling melimpah di atmosfer Bumi?',
      options: ['Oksigen (O₂)', 'Nitrogen (N₂)', 'Karbon Dioksida (CO₂)', 'Argon (Ar)'],
      correct: 1,
      explanation: 'Nitrogen membentuk sekitar 78% dari total volume atmosfer Bumi, diikuti oleh oksigen sekitar 21%.',
    },
    {
      id: 206,
      question: 'Gaya tarik alami yang menarik benda bermassa ke arah pusat bumi disebut?',
      options: ['Gaya Magnetik', 'Gaya Gravitasi', 'Gaya Sentrifugal', 'Gaya Gesek'],
      correct: 1,
      explanation: 'Gravitasi adalah fenomena alam di mana semua benda dengan massa atau energi saling tarik-menarik.',
    },
  ],
  history: [
    {
      id: 301,
      question: 'Pada tahun berapakah Proklamasi Kemerdekaan Republik Indonesia dibacakan?',
      options: ['1942', '1945', '1948', '1950'],
      correct: 1,
      explanation: 'Proklamasi Kemerdekaan Indonesia dibacakan oleh Ir. Soekarno pada hari Jumat, 17 Agustus 1945 di Jalan Pegangsaan Timur No. 56, Jakarta.',
    },
    {
      id: 302,
      question: 'Siapakah tokoh yang memimpin pelayaran pertama mengelilingi dunia dari Spanyol?',
      options: ['Christopher Columbus', 'Ferdinand Magellan', 'Vasco da Gama', 'Marco Polo'],
      correct: 1,
      explanation: 'Ekspedisi Ferdinand Magellan (1519–1522) adalah pelayaran pertama yang berhasil mengelilingi bola bumi.',
    },
    {
      id: 303,
      question: 'Peradaban manakah yang membangun piramida Giza Sphinx yang terkenal?',
      options: ['Mesopotamia', 'Mesir Kuno', 'Yunani Kuno', 'Kekaisaran Romawi'],
      correct: 1,
      explanation: 'Kompleks Piramida Giza dan Great Sphinx dibangun oleh dinasti kerajaan Mesir Kuno sekitar 2500 SM.',
    },
    {
      id: 304,
      question: 'Peristiwa runtuhnya Tembok Berlin yang menjadi simbol berakhirnya Perang Dingin terjadi pada tahun?',
      options: ['1975', '1989', '1991', '1995'],
      correct: 1,
      explanation: 'Tembok Berlin diruntuhkan pada 9 November 1989, membuka jalan bagi unifikasi Jerman dan keruntuhan Tirai Besi.',
    },
  ],
  geography: [
    {
      id: 401,
      question: 'Apa ibukota negara Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      correct: 2,
      explanation: 'Canberra adalah ibukota resmi federal Australia yang dirancang khusus sebagai kompromi antara Sydney dan Melbourne.',
    },
    {
      id: 402,
      question: 'Manakah sungai terpanjang di benua Afrika dan di dunia?',
      options: ['Sungai Amazon', 'Sungai Nil', 'Sungai Yangtze', 'Sungai Mississippi'],
      correct: 1,
      explanation: 'Sungai Nil di Afrika memiliki panjang sekitar 6.650 km, menjadikannya salah satu sungai terpanjang di dunia.',
    },
    {
      id: 403,
      question: 'Negara manakah yang memiliki jumlah pulau terbanyak di dunia?',
      options: ['Indonesia', 'Swedia', 'Filipina', 'Norwegia'],
      correct: 1,
      explanation: 'Swedia memiliki lebih dari 267.000 pulau, menjadikannya negara dengan pulau terbanyak di dunia.',
    },
  ],
  popculture: [
    {
      id: 501,
      question: 'Siapakah sutradara film epik fiksi ilmiah "Interstellar" dan "Oppenheimer"?',
      options: ['Steven Spielberg', 'Christopher Nolan', 'Denis Villeneuve', 'James Cameron'],
      correct: 1,
      explanation: 'Christopher Nolan adalah sutradara visioner di balik karya masterpiece seperti Inception, Interstellar, The Dark Knight, dan Oppenheimer.',
    },
    {
      id: 502,
      question: 'Game legendaris "Minecraft" pertama kali dikembangkan oleh programmer bernama?',
      options: ['Gabe Newell', 'Markus Persson (Notch)', 'Hideo Kojima', 'Shigeru Miyamoto'],
      correct: 1,
      explanation: 'Minecraft diciptakan oleh programmer asal Swedia, Markus Persson (dikenal sebagai "Notch") pada tahun 2009.',
    },
  ],
  general: [
    {
      id: 601,
      question: 'Berapa jumlah warna primer dalam teori pencampuran pigmen warna (RYB)?',
      options: ['2 (Hitam & Putih)', '3 (Merah, Kuning, Biru)', '4 (CMYK)', '7 (Pelangi)'],
      correct: 1,
      explanation: 'Dalam model warna pigmen tradisional RYB, warna primer terdiri dari 3 warna dasar: Merah, Kuning, dan Biru.',
    },
    {
      id: 602,
      question: 'Mamalia darat manakah yang memiliki masa kehamilan terlama (sekitar 22 bulan)?',
      options: ['Paus Biru', 'Gajah Afrika', 'Badak Jawa', 'Jerapah'],
      correct: 1,
      explanation: 'Gajah Afrika memiliki periode gestasi terpanjang di antara semua hewan darat, yaitu hampir 22 bulan.',
    },
  ],
};

export function getMockQuiz(
  topic: string,
  difficulty: string,
  questionCount: number
): MockQuiz {
  const normalizedKey = topic.toLowerCase().trim();
  let bank: MockQuestion[] = [];

  // Match existing category or combine all
  if (MOCK_QUESTION_BANK[normalizedKey]) {
    bank = MOCK_QUESTION_BANK[normalizedKey];
  } else {
    // Check partial matches or fallback to broad selection
    const matchedKey = Object.keys(MOCK_QUESTION_BANK).find((k) =>
      normalizedKey.includes(k) || k.includes(normalizedKey)
    );

    if (matchedKey) {
      bank = MOCK_QUESTION_BANK[matchedKey];
    } else {
      // Aggregate across banks
      bank = Object.values(MOCK_QUESTION_BANK).flat();
    }
  }

  // Shuffle questions
  const shuffled = [...bank].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

  // If question count requested is larger than available questions, duplicate with modified IDs
  while (selectedQuestions.length < questionCount) {
    const item = { ...shuffled[selectedQuestions.length % shuffled.length] };
    item.id = item.id + 1000 + selectedQuestions.length;
    selectedQuestions.push(item);
  }

  return {
    id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    difficulty: (difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
    questionCount: selectedQuestions.length,
    questions: selectedQuestions,
  };
}