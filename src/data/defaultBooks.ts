import { Book } from '../types';

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'book-the-prophet',
    title: 'The Prophet',
    titleAr: 'النبي',
    author: 'Kahlil Gibran',
    authorAr: 'جبران خليل جبران',
    fileType: 'pdf',
    coverUrl: '/src/assets/images/book_the_prophet_1793928000970.jpg',
    importedDate: '2026-10-15',
    totalPages: 4,
    currentPage: 1,
    currentSectionIndex: 0,
    currentParagraphIndex: 0,
    progressPercent: 32,
    lastOpenedTimestamp: Date.now() - 3600000 * 2,
    language: 'ar',
    content: [
      {
        pageNumber: 1,
        text: `المصطفى، المختار الحبيب، الذي كان فجر أيامه في مدينة أورفليس، انتظر اثنتي عشرة سنة في تلك المدينة حتى ترسو سفينته لتعود به إلى الجزيرة التي وُلد فيها. وفي السنة الثانية عشرة، في اليوم السابع من شهر أيلول، صعد إلى التل خارج أسوار المدينة وتطلع نحو البحر؛ فرأى سفينته تقبل مع الضباب.
حينئذ فُتحت أبواب قلبه، وطارت فرحته بعيداً فوق اليم، فأغمض عينيه وصلى في سكون روحه. ولكن، وهو ينحدر عن التل، اعتراه حزنٌ عميق، وفكّر في قلبه قائلاً: كيف أمضي بسلام ودون حزن؟ لا، لن أغادر هذه المدينة دون جرح في الروح.`,
        paragraphs: [
          'المصطفى، المختار الحبيب، الذي كان فجر أيامه في مدينة أورفليس، انتظر اثنتي عشرة سنة في تلك المدينة حتى ترسو سفينته لتعود به إلى الجزيرة التي وُلد فيها.',
          'وفي السنة الثانية عشرة، في اليوم السابع من شهر أيلول، صعد إلى التل خارج أسوار المدينة وتطلع نحو البحر؛ فرأى سفينته تقبل مع الضباب.',
          'حينئذ فُتحت أبواب قلبه، وطارت فرحته بعيداً فوق اليم، فأغمض عينيه وصلى في سكون روحه.',
          'ولكن، وهو ينحدر عن التل، اعتراه حزنٌ عميق، وفكّر في قلبه قائلاً: كيف أمضي بسلام ودون حزن؟ لا، لن أغادر هذه المدينة دون جرح في الروح.'
        ]
      },
      {
        pageNumber: 2,
        text: `ثم قالت له المطرة: حدّثنا عن الحب. فرفع رأسه ونظر إلى الجمع، وكان الصمت قد غشيهم، فقال بصوت جهير:
إذا أشار إليكم الحب فاتبعوه، وإن كانت مسالكه وعرة وشائكة. وإذا ضمكم بجناحيه فاستسلموا له، وإن جرحكم السيف المستور بين قوادمه.
وإذا خاطبكم فصدقوه، وإن بدّد صوته أحلامكم كما تعصف ريح الشمال بزهور البستان. فالحب كما يُتوجكم فهو يصلبكم، وكما يعمل على نموكم كذلك يُشذبكم.
يصعد إلى أعلى قممكم ويداعب أغصانكم الرقيقة المرتعشة في الشمس، ثم يهبط إلى جذوركم ويهزها في التصاقها بالأرض.`,
        paragraphs: [
          'ثم قالت له المطرة: حدّثنا عن الحب. فرفع رأسه ونظر إلى الجمع، وكان الصمت قد غشيهم، فقال بصوت جهير:',
          'إذا أشار إليكم الحب فاتبعوه، وإن كانت مسالكه وعرة وشائكة. وإذا ضمكم بجناحيه فاستسلموا له، وإن جرحكم السيف المستور بين قوادمه.',
          'وإذا خاطبكم فصدقوه، وإن بدّد صوته أحلامكم كما تعصف ريح الشمال بزهور البستان. فالحب كما يُتوجكم فهو يصلبكم، وكما يعمل على نموكم كذلك يُشذبكم.',
          'يصعد إلى أعلى قممكم ويداعب أغصانكم الرقيقة المرتعشة في الشمس، ثم يهبط إلى جذوركم ويهزها في التصاقها بالأرض.'
        ]
      },
      {
        pageNumber: 3,
        text: `ثم تقدمت امرأة وقالت: حدّثنا عن الأولاد. فقال:
أولادكم ليسوا لكم، إنهم أبناء وبنات الحياة المشتاقة إلى نفسها.
بكم يأتون إلى العالم ولكن ليس منكم، ومع أنهم يعيشون معكم فهم ليسوا ملكاً لكم.
تستطيعون أن تمنحوهم محبتكم ولكن ليس أفكاركم، لأن لهم أفكارهم الخاصة.
أنتم الأقواس وأولادكم سهام حية أطلقتها أيديكم، والرامي يرى الهدف على درب اللانهاية فيحنيكم بقوته حتى تنطلق سهامه سريعة وبعيدة.`,
        paragraphs: [
          'ثم تقدمت امرأة وقالت: حدّثنا عن الأولاد. فقال:',
          'أولادكم ليسوا لكم، إنهم أبناء وبنات الحياة المشتاقة إلى نفسها.',
          'بكم يأتون إلى العالم ولكن ليس منكم، ومع أنهم يعيشون معكم فهم ليسوا ملكاً لكم.',
          'تستطيعون أن تمنحوهم محبتكم ولكن ليس أفكاركم، لأن لهم أفكارهم الخاصة.',
          'أنتم الأقواس وأولادكم سهام حية أطلقتها أيديكم، والرامي يرى الهدف على درب اللانهاية فيحنيكم بقوته حتى تنطلق سهامه سريعة وبعيدة.'
        ]
      },
      {
        pageNumber: 4,
        text: `ثم قال رجل فلاح: حدّثنا عن العمل. فأجاب قائلاً:
أنتم تعملون لكي تسايروا الأرض ونفس الأرض. لأن التكاسل عن العمل يغربكم عن مواسم الزمان، ويحيد بكم عن موكب الحياة المتقدم بجلال وخضوع إلى اللانهاية.
إذا عملتم فإنكم تحققون جزءاً من حلم الأرض الأبدي، جُعل لكم عند ولادة ذلك الحلم.
وإذا أحببتم عملكم فإنكم تكونون قد اتصلتم بالحياة في أعماق أسرارها، لأن العمل المحفوف بالمحبة يربطكم ببعضكم البعض وبالله.`,
        paragraphs: [
          'ثم قال رجل فلاح: حدّثنا عن العمل. فأجاب قائلاً:',
          'أنتم تعملون لكي تسايروا الأرض ونفس الأرض. لأن التكاسل عن العمل يغربكم عن مواسم الزمان، ويحيد بكم عن موكب الحياة المتقدم بجلال وخضوع إلى اللانهاية.',
          'إذا عملتم فإنكم تحققون جزءاً من حلم الأرض الأبدي، جُعل لكم عند ولادة ذلك الحلم.',
          'وإذا أحببتم عملكم فإنكم تكونون قد اتصلتم بالحياة في أعماق أسرارها، لأن العمل المحفوف بالمحبة يربطكم ببعضكم البعض وبالله.'
        ]
      }
    ]
  },
  {
    id: 'book-arabian-nights',
    title: 'One Thousand and One Nights',
    titleAr: 'ألف ليلة وليلة',
    author: 'Traditional Heritage',
    authorAr: 'التراث الشعبي العربي',
    fileType: 'pdf',
    coverUrl: '/src/assets/images/book_arabian_nights_1793928001056.jpg',
    importedDate: '2026-10-22',
    totalPages: 3,
    currentPage: 1,
    currentSectionIndex: 0,
    currentParagraphIndex: 0,
    progressPercent: 15,
    lastOpenedTimestamp: Date.now() - 3600000 * 24,
    language: 'ar',
    content: [
      {
        pageNumber: 1,
        text: `قال الراوي: بلغني أيها الملك السعيد، ذو الرأي الرشيد، أنه كان في قديم الزمان وسالف العصر والأوان، ملك عظيم من ملوك ساسان، بجزائر الهند والصين، صاحب جند وأعوان وحشم وخدم. وكان له ولدان كلاهما فارس بطل، غير أن الكبير منهما كان أفرس من الصغير. وملك البلاد وحكم بالعدل بين العباد، وكان اسمه الملك شهريار، وكان أخوه الصغير اسمه الملك شاه زمان، وكان ملك سمرقند العجم.
وكان الملك شهريار قد أضمر غضباً شديداً وقرر أن يتزوج كل ليلة بفتاة، ثم يأمر بقتلها عند الصباح حتى لا تغدر به الأيام. وضاقت بالناس حيلهم، وفرت العائلات ببناتها حتى كادت المدينة تخلو من الفتيات.`,
        paragraphs: [
          'قال الراوي: بلغني أيها الملك السعيد، ذو الرأي الرشيد، أنه كان في قديم الزمان وسالف العصر والأوان، ملك عظيم من ملوك ساسان، بجزائر الهند والصين، صاحب جند وأعوان وحشم وخدم.',
          'وكان له ولدان كلاهما فارس بطل، غير أن الكبير منهما كان أفرس من الصغير. وملك البلاد وحكم بالعدل بين العباد، وكان اسمه الملك شهريار، وكان أخوه الصغير اسمه الملك شاه زمان، وكان ملك سمرقند العجم.',
          'وكان الملك شهريار قد أضمر غضباً شديداً وقرر أن يتزوج كل ليلة بفتاة، ثم يأمر بقتلها عند الصباح حتى لا تغدر به الأيام. وضاقت بالناس حيلهم، وفرت العائلات ببناتها حتى كادت المدينة تخلو من الفتيات.'
        ]
      },
      {
        pageNumber: 2,
        text: `وكان للوزير ابنتان، الكبرى اسمها شهرزاد والصغرى اسمها دنيازاد. وكانت شهرزاد قد قرأت الكتب والمصنفات وتواريخ الأمم السالفة، وقيل إنها جمعت ألف كتاب من كتب التواريخ وأشعار الشعراء.
فقالت لأبيها يوماً: يا أبتِ، إني أريد أن تزوجني بالملك شهريار، فإما أن أكون سبباً في نجاة بنات المسلمين وإما أن أهلك كما هلك غيري.
فخاف الوزير عليها خوفاً شديداً ونصحها، لكنها كانت ذات حكمة وعزيمة لا تلين، فعزم وتوكل على الله وأدخلها على الملك.`,
        paragraphs: [
          'وكان للوزير ابنتان، الكبرى اسمها شهرزاد والصغرى اسمها دنيازاد. وكانت شهرزاد قد قرأت الكتب والمصنفات وتواريخ الأمم السالفة، وقيل إنها جمعت ألف كتاب من كتب التواريخ وأشعار الشعراء.',
          'فقالت لأبيها يوماً: يا أبتِ، إني أريد أن تزوجني بالملك شهريار، فإما أن أكون سبباً في نجاة بنات المسلمين وإما أن أهلك كما هلك غيري.',
          'فخاف الوزير عليها خوفاً شديداً ونصحها، لكنها كانت ذات حكمة وعزيمة لا تلين، فعزم وتوكل على الله وأدخلها على الملك.'
        ]
      },
      {
        pageNumber: 3,
        text: `فلما دخلت عليه بكت وطلبت أن تحضر أختها دنيازاد لتودعها. فلما حضرت وجلست بقرب السرير قالت: يا أختي، إن كان الملك يسمح فحدثينا حديثاً نقضي به سهر ليلتنا.
فالتفتت شهرزاد إلى الملك وقالت: أتأذن لي يا مولاي؟ فقال: تحدثي.
فبدأت تسرد حكاية التاجر مع العفريت ببيان ساحر وصوت عذب رخيم، حتى إذا بلغت منتصف القصة في أشد مواضعها تشويقاً، أدرك شهرزاد الصباح، فسكتت عن الكلام المباح!`,
        paragraphs: [
          'فلما دخلت عليه بكت وطلبت أن تحضر أختها دنيازاد لتودعها. فلما حضرت وجلست بقرب السرير قالت: يا أختي، إن كان الملك يسمح فحدثينا حديثاً نقضي به سهر ليلتنا.',
          'فالتفتت شهرزاد إلى الملك وقالت: أتأذن لي يا مولاي؟ فقال: تحدثي.',
          'فبدأت تسرد حكاية التاجر مع العفريت ببيان ساحر وصوت عذب رخيم، حتى إذا بلغت منتصف القصة في أشد مواضعها تشويقاً، أدرك شهرزاد الصباح، فسكتت عن الكلام المباح!'
        ]
      }
    ]
  },
  {
    id: 'book-future-horizons',
    title: 'Future Horizons: The Mind and Cosmos',
    titleAr: 'آفاق المستقبل: العقل والكون',
    author: 'Elara Vance',
    authorAr: 'إيلارا فانس',
    fileType: 'pdf',
    coverUrl: '/src/assets/images/book_future_horizons_1793928001214.jpg',
    importedDate: '2026-10-30',
    totalPages: 3,
    currentPage: 1,
    currentSectionIndex: 0,
    currentParagraphIndex: 0,
    progressPercent: 48,
    lastOpenedTimestamp: Date.now() - 3600000 * 5,
    language: 'en',
    content: [
      {
        pageNumber: 1,
        text: `In the quiet expanse between stars, humanity discovered not silence, but resonance. Every signal pulsed with historical echoes of ancient civilizations reaching across light-years.
The great station hovering at the edge of the Kuiper Belt observed the cosmic microwave background not as background static, but as a symphony of early universe architecture. Dr. Noah Al-Mansoor adjusted the spectral receiver, marveling at how sound frequencies could mirror quantum states.`,
        paragraphs: [
          'In the quiet expanse between stars, humanity discovered not silence, but resonance. Every signal pulsed with historical echoes of ancient civilizations reaching across light-years.',
          'The great station hovering at the edge of the Kuiper Belt observed the cosmic microwave background not as background static, but as a symphony of early universe architecture.',
          'Dr. Noah Al-Mansoor adjusted the spectral receiver, marveling at how sound frequencies could mirror quantum states.'
        ]
      },
      {
        pageNumber: 2,
        text: `To listen is to invite understanding. In the ancient desert observatories, astronomers tracked constellations through the chill of twilight, charting the motions of worlds with precision and patience.
Today, autonomous probes venture into interstellar clouds, translating gravitational waves into audible harmonics. Each wave tells the dramatic story of collapsing neutron stars and black hole mergers occurring billions of years ago.`,
        paragraphs: [
          'To listen is to invite understanding. In the ancient desert observatories, astronomers tracked constellations through the chill of twilight, charting the motions of worlds with precision and patience.',
          'Today, autonomous probes venture into interstellar clouds, translating gravitational waves into audible harmonics.',
          'Each wave tells the dramatic story of collapsing neutron stars and black hole mergers occurring billions of years ago.'
        ]
      },
      {
        pageNumber: 3,
        text: `As civilization advances toward the twenty-second century, synthetic intelligence and human consciousness converge. The spoken word remains our oldest and most poignant bridge across technology.
Through speech synthesis, forgotten manuscripts find new voices, allowing generations to experience literature through natural, expressive narration wherever their journey leads.`,
        paragraphs: [
          'As civilization advances toward the twenty-second century, synthetic intelligence and human consciousness converge. The spoken word remains our oldest and most poignant bridge across technology.',
          'Through speech synthesis, forgotten manuscripts find new voices, allowing generations to experience literature through natural, expressive narration wherever their journey leads.'
        ]
      }
    ]
  },
  {
    id: 'book-mind-wisdom',
    title: 'Mindfulness & Wisdom',
    titleAr: 'اليقظة الذهنية والحكمة',
    author: 'Tariq Al-Hakim',
    authorAr: 'طارق الحكيم',
    fileType: 'txt',
    coverUrl: '/src/assets/images/book_mind_and_clarity_1793928000978.jpg',
    importedDate: '2026-11-01',
    totalPages: 2,
    currentPage: 1,
    currentSectionIndex: 0,
    currentParagraphIndex: 0,
    progressPercent: 70,
    lastOpenedTimestamp: Date.now() - 3600000 * 12,
    language: 'ar',
    content: [
      {
        pageNumber: 1,
        text: `السكينة ليست غياب العواصف من حولك، بل هي ذلك الهدوء العميق المتجذر في أعماق قلبك مهما اشتدت الرياح.
حين تجلس وتستمع إلى أنفاسك، تكتشف أن اللحظة الحاضرة هي الملاذ الحقيقي والوحيد الذي نملكه بالفعل.
الماضي فكرة استقرت في الذاكرة، والمستقبل أملٌ يترقبه الخيال، أما الحاضر فهو نبض الوجود الذي نحياه الآن.`,
        paragraphs: [
          'السكينة ليست غياب العواصف من حولك، بل هي ذلك الهدوء العميق المتجذر في أعماق قلبك مهما اشتدت الرياح.',
          'حين تجلس وتستمع إلى أنفاسك، تكتشف أن اللحظة الحاضرة هي الملاذ الحقيقي والوحيد الذي نملكه بالفعل.',
          'الماضي فكرة استقرت في الذاكرة، والمستقبل أملٌ يترقبه الخيال، أما الحاضر فهو نبض الوجود الذي نحياه الآن.'
        ]
      },
      {
        pageNumber: 2,
        text: `اقرأ بروحك قبل عينيك، واستمع للأصوات التي تحيط بك كأنها همسات الطبيعة التي ترشدك نحو الصفاء.
كل كتاب تفتحه نافذة جديدة على عوالم لم تكن تعرفها، وكل كلمة تستمع إليها بوعي تسكب في نفسك نضجاً وهدوءاً.
كن رفيقاً لنفسك في هذه الرحلة، واجعل القراءة والاستماع طقساً يومياً يغذي فكرك ويرتقي بوجدانك.`,
        paragraphs: [
          'اقرأ بروحك قبل عينيك، واستمع للأصوات التي تحيط بك كأنها همسات الطبيعة التي ترشدك نحو الصفاء.',
          'كل كتاب تفتحه نافذة جديدة على عوالم لم تكن تعرفها، وكل كلمة تستمع إليها بوعي تسكب في نفسك نضجاً وهدوءاً.',
          'كن رفيقاً لنفسك في هذه الرحلة، واجعل القراءة والاستماع طقساً يومياً يغذي فكرك ويرتقي بوجدانك.'
        ]
      }
    ]
  }
];
