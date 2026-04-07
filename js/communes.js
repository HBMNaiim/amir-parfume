// ============================================================
//  ALGERIA — Wilayas & Communes Database
//  58 wilayas with their communes
// ============================================================

const COMMUNES_BY_WILAYA = {
  "01": {
    name: "Adrar",
    communes: ["Adrar","Reggane","Timimoun","In Salah","Aoulef","Tsabit","Tit","Fenoughil","Zaouiet Kounta","Tamest","Charouine","Ouled Ahmed Timmi","Bouda","Sali","Timokten","Tamentit","Deldoul","Metarfa","In Zghmir","Tamekten","Ksar Kaddour","Akabli","Bordj Badji Mokhtar","Timiaouine","Talmine","Aougrout","Sbaa"]
  },
  "02": {
    name: "Chlef",
    communes: ["Chlef","Ténès","El Karimia","Taougrite","Beni Haoua","Sobha","Harchoun","Ouled Fares","Sidi Akacha","Boukadir","Beni Rached","Oum Drou","Chettia","Sendjas","Zeboudja","Oued Fodda","Oued Sly","Ain Merane","El Hadjadj","Labiod Medjadja","El Marsa","Benairia","Abou El Hassan","Breira","Tadjena","Moussadek","El Dahra","Talassa","Hrenfa"]
  },
  "03": {
    name: "Laghouat",
    communes: ["Laghouat","Ksar El Hirane","Ben Nacer Ben Chohra","Sidi Makhlouf","Hassi Delaa","Hassi R'Mel","Ain Madhi","Tadjemout","Kheneg","Gueltat Sidi Saad","Ain Sidi Ali","Beidha","Brida","El Ghicha","Hadj Mechri","Sebgag","Tadjrouna","Aflou","El Assafia","Oued Morra","Oued M'Zi","El Haouaita"]
  },
  "04": {
    name: "Oum El Bouaghi",
    communes: ["Oum El Bouaghi","Ain Beida","Ain M'Lila","Ksar Sbahi","Sigus","El Amiria","Ain Babouche","Berriche","Ouled Hamla","Dhalaa","Ain Kercha","Hanchir Toumghani","El Belala","Ain Zitoun","Meskiana","Souk Naamane","Ouled Gacem","Fkirina","Rahia","Djeurf","El Fedjoudj","Zorg","Ain Fakroun","Bir Chouhada"]
  },
  "05": {
    name: "Batna",
    communes: ["Batna","Merouana","Arris","Ain Touta","Barika","N'Gaous","Tazoult","Seriana","Menaa","El Madher","Timgad","Ras El Aioun","Chemora","Oued Chaaba","Tkout","Ain Djasser","Ouled Si Slimane","Hidoussa","Ain Yagout","Ichemoul","Ouyoun El Assafir","Fesdis","Seggana","Djerma","Bouzina","Ghassira","Maafa","Teniet El Abed","Tigherghar","Oued El Ma","Bitam","Inoughissen","Larbaa","Taxlent","Gosbat","Ouled Ammar","Boumagueur","El Hassi","Talkhamt","Beni Foudhala El Hakania","Oued Taga","Rahbat","Lazrou","Djezzar","Boumaguer"]
  },
  "06": {
    name: "Béjaïa",
    communes: ["Béjaïa","Amizour","Kherrata","Sidi Aich","Akbou","El Kseur","Tichy","Aokas","Tazmalt","Seddouk","Darguina","Adekar","Souk El Tenine","Bordj Mira","Beni Maouche","Toudja","Barbacha","Feraoun","Chemini","Timezrit","Sidi Ali Ouboudaoud","Beni Djellil","Tamokra","Tifra","Ighil Ali","Bouhamza","Beni Ksila","Melbou","Ouzellaguen","Fenaia Il Maten","Taskriout","Kendira","Tibane","Tala Hamza"]
  },
  "07": {
    name: "Biskra",
    communes: ["Biskra","Tolga","Ouled Djellal","Sidi Okba","M'Chouneche","El Kantara","Djemorah","Sidi Khaled","Ourlal","Foughala","Lioua","El Hadjeb","Bordj Ben Azzouz","Zeribet El Oued","Ain Naga","Ain Zaatout","El Outaya","Lichana","Bouchagroun","Branis","El Feidh","Chetma","Oumache","Mekhadma","El Ghrous","Doucen"]
  },
  "08": {
    name: "Béchar",
    communes: ["Béchar","Kenadsa","Abadla","Beni Ounif","Taghit","Igli","Tabelbala","Meridja","Mogheul","Lahmar","Beni Abbes","El Ouata","Ouled Khodeir","Mougheul","Mechraa Houari","Erg Ferradj","Kerzaz"]
  },
  "09": {
    name: "Blida",
    communes: ["Blida","Boufarik","Mouzaia","El Affroun","Bougara","Soumaa","Ouled Yaich","Chréa","Bouinan","Oued El Alleug","Beni Mered","Guerrouaou","Beni Tamou","Chiffa","Hammam Melouane","Ain Romana","Larbaâ","Djebabra","Oued Djer","Meftah","Ben Khellil"]
  },
  "10": {
    name: "Bouira",
    communes: ["Bouira","Sour el-Ghozlane","Lakhdaria","M'Chedallah","Ain Bessem","El Hachimia","Bechloul","Bordj Okhriss","Haizer","Kadiria","El Asnam","Aghbalou","Taghzout","Chorfa","Bir Ghbalou","Ain Laloui","Ahl El Ksar","Aomar","Ridane","Maala","Hadjera Zerga","Ouled Rached","El Adjiba","Saharidj","Souk El Khemis","El Mokrani","Dirah","Ain El Hadjar","Ath Mansour","Taguedit","El Hakimia","Ain Turk","Mezdour","Oued El Berdi","Dechmia"]
  },
  "11": {
    name: "Tamanrasset",
    communes: ["Tamanrasset","In Salah","In Guezzam","Abalessa","Ideles","Tazrouk","Idles","In Amguel","Tin Zaouatine"]
  },
  "12": {
    name: "Tébessa",
    communes: ["Tébessa","Chéria","Bir El Ater","El Aouinet","Morsott","El Kouif","Ouenza","Bekkaria","Boulhaf Dyr","El Ma El Abiod","Hammamet","Negrine","Bir Mokkadem","El Ogla","Tlidjene","Stah Guentis","Safsaf El Ouesra","Ain Zerga","El Malabiod","Oum Ali","Ferkane","Boukhadra"]
  },
  "13": {
    name: "Tlemcen",
    communes: ["Tlemcen","Ghazaouet","Maghnia","Remchi","Hennaya","Sebdou","Mansourah","Nedroma","Chetouane","Ain Fezza","Ouled Mimoun","Beni Snous","Sidi Djillali","Ain Tallout","Bab El Assa","Marsa Ben M'Hidi","Honaine","El Aricha","Souahlia","Beni Boussaid","Ain Ghoraba","Fellaoucene","Sabra","Sidi Medjahed","Bouhlou","Bensekrane"]
  },
  "14": {
    name: "Tiaret",
    communes: ["Tiaret","Ksar Chellala","Frenda","Sougueur","Rahouia","Mahdia","Ain Deheb","Oued Lilli","Dahmouni","Hamadia","Medroussa","Ain Bouchekif","Ain Kermes","Mechraa Sfa","Tagdemt","Tousnina","Sidi Bakhti","Bougara","Mellakou","Djillali Ben Amar","Si Abdelghani","Sebt","Nadorah","Rechaiga","Tiaret Ville","Madna","Sidi Hosni","Sidi Ali Mellal","Zmalet El Emir Abdelkader"]
  },
  "15": {
    name: "Tizi Ouzou",
    communes: ["Tizi Ouzou","Azazga","Draâ El Mizan","Ain El Hammam","Larbaâ Nath Irathen","Draâ Ben Khedda","Boghni","Ouaguenoun","Maatkas","Beni Douala","Tigzirt","Azeffoun","Boudjima","Iferhounene","Mekla","Beni Yenni","Ouadhias","Bouzeguene","Iflissen","Irdjen","Tizi Gheniff","Ait Mahmoud","Tizi Rached","Ait Aissa Mimoun","Freha","Souk El Tenine","Ain Zaouia","Tadmait","Makouda","Timizart","Tirmitine","Bou Nouh","Ait Yahia Moussa","Idjeur","Ait Toudert","Zekri","Yakourene","M'Kira","Souama","Beni Zmenzer","Iloula Oumalou","Iboudrarene","Akerrou","Aghribs","Ait Boumahdi"]
  },
  "16": {
    name: "Alger",
    communes: ["Alger Centre","Sidi M'Hamed","El Madania","Hussein Dey","El Harrach","Baraki","Oued Smar","Bourouba","Dar El Beida","Bab Ezzouar","Ben Aknoun","Bouzareah","Birkhadem","El Biar","Kouba","Bachdjerrah","Bir Mourad Raïs","Bordj El Kiffan","Bab El Oued","Bologhine","Casbah","Oued Koriche","Mohammadia","Bordj El Bahri","El Mouradia","Hydra","Dély Ibrahim","El Achour","Draria","Douera","Baba Hassen","Khraicia","Saoula","Ain Benian","Staoueli","Zeralda","Mahelma","Rahmania","Souidania","Cheraga","Ouled Fayet","El Hammamet","Rouiba","Reghaia","Ain Taya","Heuraoua","Heraoua"]
  },
  "17": {
    name: "Djelfa",
    communes: ["Djelfa","Messaad","Ain Oussera","Hassi Bahbah","Charef","Sidi Ladjel","Birine","Bouira Lahdab","Faidh El Botma","Ain Maabed","Dar Chioukh","Had Sahary","Moudjebara","El Guedid","Benhar","Zaafrane","Hassi Fedoul","Douis","Ain El Ibel","Sed Rahal","El Idrissia","Selmana","Ain Chouhada","Ain Fekka","Amourah","Tadmit","Deldoul","Mliliha"]
  },
  "18": {
    name: "Jijel",
    communes: ["Jijel","Taher","El Milia","Sidi Maarouf","Ziama Mansouriah","Settara","Texenna","Kaous","Djimla","El Ancer","Chekfa","Sidi Abdelaziz","Bouraoui Belhadef","El Aouana","Oudjana","Eraguene","Selma Benziada","Boudria Beni Yadjis","El Kennar Nouchfi"]
  },
  "19": {
    name: "Sétif",
    communes: ["Sétif","El Eulma","Ain El Kebira","Ain Oulmene","Bougaa","Ain Arnat","Ain Azel","Amoucha","Beni Aziz","Djemila","El Ouricia","Guenzet","Hammam Guergour","Hammam Soukhna","Harbil","Maoklane","Mezloug","Ouled Tebben","Ras El Oued","Salah Bey","Serdj El Ghoul","Tala Ifacene","Tizi N'Bechar","Babor","Beni Ourtilane","Beni Fouda","Bouandas","Tachouda","Beni Chebana","Bir El Arch","Guellal","Ain Lahdjar","Beidha Bordj","Dehamcha","Bazer Sakhra","Oued El Bared","Belaa"]
  },
  "20": {
    name: "Saïda",
    communes: ["Saïda","Ain El Hadjar","Ouled Khaled","Youb","Hassasna","Sidi Ahmed","Doui Thabet","Moulay Larbi","Sidi Boubekeur","Ain Soltane","Sidi Amar","El Hassasna","Tircine","Hounet","Maamora","Ain Sekhouna"]
  },
  "21": {
    name: "Skikda",
    communes: ["Skikda","El Harrouch","Azzaba","Collo","Tamalous","Oued Zenati","Ramdane Djamel","Ben Azzouz","Ain Zouit","Sidi Mezghiche","Kerkera","Bekkouche Lakhdar","El Hadaiek","Ouled Attia","Bouchtata","Hammadi Krouma","Ain Kechra","Es Sebt","Filfila","Salah Bouchaour","Oum Toub","Beni Bechir","Zitouna","Khenag Mayoum","Bin El Ouiden"]
  },
  "22": {
    name: "Sidi Bel Abbès",
    communes: ["Sidi Bel Abbès","Telagh","Sfisef","Ain El Berd","Ben Badis","Tenira","Tessala","Mostefa Ben Brahim","Ras El Ma","Ain Thrid","Marhoum","Sidi Ali Benyoub","Lamtar","Sidi Ali Boussidi","Merine","Amarnas","Sidi Lahcene","Hassi Zahana","Makedra","Sidi Chaib","Tilmouni","Oued Sebaa","Boudjebaa El Bordj","Bir El Hmam","Sidi Khaled","Sidi Hamadouche"]
  },
  "23": {
    name: "Annaba",
    communes: ["Annaba","El Bouni","El Hadjar","Sidi Amar","Berrahal","Ain El Berda","Treat","Seraidi","Oued El Aneb","Chetaibi","El Eulma","Cheurfa"]
  },
  "24": {
    name: "Guelma",
    communes: ["Guelma","Bouchegouf","Oued Zenati","Héliopolis","Ain Makhlouf","Hammam Debagh","Ain Ben Beida","Nechmaya","Djebala Khemissi","Houari Boumediene","Belkheir","Ben Djerrah","Guelaat Bou Sbaa","Tamlouka","Hammam Nbaïls","Khezaras","Ras El Agba","Ain Sandal","Medjez Amar","Ain Larbi","Bouhamdane","Sellaoua Announa","Bouati Mahmoud","Dahouara","Ain Hessainia","Roknia"]
  },
  "25": {
    name: "Constantine",
    communes: ["Constantine","El Khroub","Ain Smara","Hamma Bouziane","Didouche Mourad","Zighoud Youcef","Ibn Ziad","Beni Hamidane","Ouled Rahmoune","Ain Abid","Ibn Badis","Messaoud Boudjeriou"]
  },
  "26": {
    name: "Médéa",
    communes: ["Médéa","Berrouaghia","Ksar El Boukhari","Tablat","Chahbounia","Ain Boucif","El Omaria","Ouzera","Beni Slimane","Aziz","Si Mahdjoub","Ouamri","Tamesguida","Ouled Antar","Seghouane","Souagui","Mihoub","Draa Essamar","Sidi Naamane","El Aissaouia","Cheniguel","Boghar","Meghraoua","Hannacha","Ouled Bouachra","Meftaha","Oued Harbil","Damiat","Baata","El Guelb El Kebir","Djouab","Sidi Zahar","Boughezoul","Ouled Maaref"]
  },
  "27": {
    name: "Mostaganem",
    communes: ["Mostaganem","Ain Tedeles","Hassi Mameche","Sidi Ali","Ain Nouissy","Bouguirat","Kheir Eddine","Sidi Lakhdar","Mesra","Mazagran","Achaacha","Sayada","Sirat","Abdelmalek Ramdane","El Hassiane","Fornaka","Sour","Mansourah","Stidia","Hadjadj","Oued El Kheir","Ain Boudinar","Nekmaria"]
  },
  "28": {
    name: "M'Sila",
    communes: ["M'Sila","Bou Saâda","Ain El Melh","Sidi Aissa","Hammam Dalaa","Magra","Berhoum","Ouled Derradj","Ben Srour","Khoubana","M'Cif","Chellal","Ain El Hadjel","Djebel Messaad","Medjedel","Ouanougha","Sidi Ameur","Maadid","Tarmount","Ain Errich","Ouled Addi Guebala","Ain Fares","Ain El Khadra","Belaiba","Ouled Sidi Brahim","Benzouh","Maarif","Khettouti Sed El Djir","Dehahna"]
  },
  "29": {
    name: "Mascara",
    communes: ["Mascara","Sig","Mohammadia","Tighennif","Bou Hanifia","Ain Fares","Ghriss","Hacine","Oggaz","El Bordj","Ain Fekan","Froha","Ain Fares","Oued Taria","Ain Ferah","Oued El Abtal","Sidi Abdelmoumene","Maoussa","Chorfa","El Guettana","Tizi","Bouhenni","Zahana","Ras Ain Amirouche","Ferraguig","Sidi Kada","Nesmoth","Ain Frass","Gharrous","Sedjerara","Oued El Abtal","El Menaouer","Benian","Bou Hanifia","Hachem","El Keurt","Ain Fekan","Matemore"]
  },
  "30": {
    name: "Ouargla",
    communes: ["Ouargla","Touggourt","Hassi Messaoud","Ghardaia","Temacine","Rouissat","N'Goussa","Ain Beida","Megarine","Sidi Khouiled","El Hadjira","El Alia","Taibet","Nezla","Blidet Amor","El Borma","Hassi Ben Abdellah"]
  },
  "31": {
    name: "Oran",
    communes: ["Oran","Bir El Djir","Es Senia","Ain El Turk","Arzew","Bethioua","Gdyel","Boutlelis","Oued Tlélat","Ain El Bia","Bousfer","El Braya","Hassi Bounif","Ben Freha","Hassi Ben Okba","Sidi Chami","El Kerma","Mers El Kébir","Bou Tlélis","Misserghin","Sidi Chahmi"]
  },
  "32": {
    name: "El Bayadh",
    communes: ["El Bayadh","Bougtob","El Abiodh Sidi Cheikh","Ain El Orak","Brezina","Chellala","Sidi Tifour","Stitten","Bou Semghoun","Rogassa","Ghassoul","Kef El Ahmar","Boualem","Ain Ben Khelil","Sidi Slimane","Bchar Djedid","Tousmouline","Krakda","Arbaouat","Cheguig"]
  },
  "33": {
    name: "Illizi",
    communes: ["Illizi","Djanet","In Amenas","Bordj Omar Driss","Debdeb","Bordj El Haouass"]
  },
  "34": {
    name: "Bordj Bou Arreridj",
    communes: ["Bordj Bou Arreridj","Ras El Oued","Medjana","El Achir","Mansourah","Bordj Ghedir","Bordj Zemoura","Ain Taghrout","Djaafra","El Hamadia","Hasnaoua","Teniet En Nasr","Ouled Brahem","Khelil","Bir Kasd Ali","Ghilassa","Belimour","El Main","Sidi Embarek","Ouled Dahmane","Taglait","Haraza","Ras El Oued","Colla","Tassameurt","El Ach","Ouled Sidi Brahim","Ben Daoud"]
  },
  "35": {
    name: "Boumerdès",
    communes: ["Boumerdès","Hammadi","Tidjelabine","Chabet El Ameur","Thénia","Isser","Boudouaou","Bordj Menaiel","Naciria","Dellys","Baghlia","Si Mustapha","Ouled Moussa","Khemis El Khechna","Rouiba","Ain Taya","Beni Amrane","Souk El Had","Larbatache","Ouled Heddadj","Ammal","Corso","Ouled Aissa","Zemmouri","Djinet","Keddara","Afir","Bouzegza Keddara","Timezrit","Leghata"]
  },
  "36": {
    name: "El Tarf",
    communes: ["El Tarf","El Kala","Bouhadjar","Ben M'Hidi","Bouteldja","Besbes","Drean","Zerizer","Ain El Assel","Ain Kerma","Lac des Oiseaux","Oued Z'Hor","El Aioun","Berrihane","Chefia","Hammam Beni Salah","Bougous","Raml Souk","Chihani","Zitouna","Asfour","El Chatt","Chbaita Mokhtar"]
  },
  "37": {
    name: "Tindouf",
    communes: ["Tindouf","Oum El Assel"]
  },
  "38": {
    name: "Tissemsilt",
    communes: ["Tissemsilt","Theniet El Had","Bordj Bou Naama","Khemisti","Lardjem","Lazharia","Beni Chaib","Ammari","Ouled Bessem","Layoune","Beni Lahcene","Sidi Lantri","Sidi Abed","Bougara","Tamalaht","Maasem","Sidi Boutouchent","Sidi Slimane"]
  },
  "39": {
    name: "El Oued",
    communes: ["El Oued","Guemar","Bayadha","Djamaa","Robbah","Reguiba","Magrane","Still","Debila","Taghzout","Kouinine","Oued El Alenda","Hassani Abdelkrim","Nakhla","Sidi Aoun","M'Rara","Sidi Khellil","Trifaoui","Hamraia","Ourmes","El Ogla","Mih Ouensa","Douar El Ma","Ain Chabro","Hassi Khalifa"]
  },
  "40": {
    name: "Khenchela",
    communes: ["Khenchela","Ain Touila","Kais","Baghai","El Hamma","Chechar","Taouzianet","El Oueldja","Bouhmama","El Mahmal","Tamza","Ensigha","N'Sigha","Djellal","Babar","Ain Mimoun","M'Sara","Ouled Rechache","Remila","Yabous","Chelia","Taberdga","Mtoussa"]
  },
  "41": {
    name: "Souk Ahras",
    communes: ["Souk Ahras","Sedrata","M'Daourouch","Taoura","Hanancha","Ouillen","Ain Zana","Mechroha","Ouled Driss","Bir Bouhouche","Zaarouria","Drea","Oum El Adhaim","Terraguelt","Ain Soltane","Sidi Fredj","Ragouba","Ain El Hadjar","Khedara","Merahna","Ouled Moumen","Hennencha","Lekhdara","Oued Kebrit"]
  },
  "42": {
    name: "Tipaza",
    communes: ["Tipaza","Cherchell","Koléa","Hadjout","Bou Ismail","Fouka","Ahmer El Ain","Gouraya","Sidi Amar","Damous","Nador","Bou Haroun","Ain Tagourait","Chaiba","Meurad","Attatba","Sidi Rached","Bourkika","Larhat","Aghbal","Menaceur","Sidi Ghiles"]
  },
  "43": {
    name: "Mila",
    communes: ["Mila","Ferdjioua","Chelghoum Laid","Teleghma","Sidi Merouane","Oued Athmania","Ain Beida Harriche","Ain Tine","Grarem Gouga","Benyahia Abderrahmene","Oued Seguen","Oued Endja","Tadjenanet","Rouached","Tassadane Haddada","Bouhatem","Hamala","Ain Mellouk","Terrai Bainen","Mine Ahmed Rachedi","Amira Arres","Beni Guechal","Zeghaia","Sidi Khelifa","Tiberguent","Derrahi Bousselah"]
  },
  "44": {
    name: "Aïn Defla",
    communes: ["Aïn Defla","Miliana","Khemis Miliana","El Attaf","Djelida","Bathia","Bordj Emir Khaled","Ain Lechiakh","Bourached","El Abadia","Rouina","Ain Bouyahia","Zeddine","Boumedfaa","Mekhatria","Ain Soltane","Bir Ould Khelifa","Djendel","El Hassania","El Amra","Hoceinia","Tacheta Zougagha","Arib","Hammam Righa","Ain Torki","Sidi Lakhdar","Oued Chorfa","Oued Djemaa","Ain Benian","Tarik Ibn Ziad"]
  },
  "45": {
    name: "Naâma",
    communes: ["Naâma","Mecheria","Ain Sefra","Tiout","Sfissifa","Moghrar","Djenien Bourezg","Asla","El Biod","Kasdir","Ain Ben Khelil","Mekmen Ben Amar"]
  },
  "46": {
    name: "Aïn Témouchent",
    communes: ["Aïn Témouchent","Hammam Bou Hadjar","El Amria","El Malah","Beni Saf","Ain El Arbaa","Aghlal","Chaabat El Leham","Oued Berkeche","Ain Kihal","Chentouf","Sidi Ben Adda","Ain Tolba","Ain Larbaa","Ouled Boudjemaa","Terga","Tamzoura","Sidi Safi","Emir Abdelkader","Oued Sabah","Hassasna","El Hassasna","Oulhaça El Gheraba"]
  },
  "47": {
    name: "Ghardaïa",
    communes: ["Ghardaïa","Metlili","Berriane","Guerrara","El Atteuf","Daya","Zelfana","Bounoura","El Meniaa","Hassi Lefhal","Hassi Gara","Mansoura","Sebseb"]
  },
  "48": {
    name: "Relizane",
    communes: ["Relizane","Oued Rhiou","Mazouna","Yellel","Ammi Moussa","Mendes","Ain Tarek","El Matmar","Sidi M'Hamed Ben Ali","Djidioua","El Hamadna","Had Echkalla","Oued Essalem","Sidi Saada","Sidi Khettab","El Guettar","Ouarizane","Mediouna","Ain Rahma","Merdja Sidi Abed","Beni Dergoun","Dar Ben Abdallah","Lahlef","Bendaoud","Hamri","Ouled Sidi Mihoub","Oued El Djemaa","Kalaa"]
  },
  "49": {
    name: "Timimoun",
    communes: ["Timimoun","Aougrout","Charouine","Tinerkouk","Deldoul","Ouled Aissa","Metarfa","Ksar Kaddour","Ouled Said"]
  },
  "50": {
    name: "Bordj Badji Mokhtar",
    communes: ["Bordj Badji Mokhtar","Timiaouine"]
  },
  "51": {
    name: "Ouled Djellal",
    communes: ["Ouled Djellal","Sidi Khaled","Doucen","Chaiba","Ras El Miaad","Besbes","El Haouche"]
  },
  "52": {
    name: "Béni Abbès",
    communes: ["Béni Abbès","El Ouata","Igli","Tabelbala","Kerzaz","Beni Ikhlef","Tamtert"]
  },
  "53": {
    name: "In Salah",
    communes: ["In Salah","In Ghar","Foggaret Ezzoubia","Hassi El Gara"]
  },
  "54": {
    name: "In Guezzam",
    communes: ["In Guezzam","Tin Zaouatine"]
  },
  "55": {
    name: "Touggourt",
    communes: ["Touggourt","Temacine","Megarine","Nezla","Taibet","El Hadjira","Blidet Amor","Benaceur"]
  },
  "56": {
    name: "Djanet",
    communes: ["Djanet","Bordj El Haouass"]
  },
  "57": {
    name: "El M'Ghair",
    communes: ["El M'Ghair","Djamaa","Still","Sidi Amrane","Oum Touyour","M'Rara","Sidi Khellil"]
  },
  "58": {
    name: "El Meniaa",
    communes: ["El Meniaa","Hassi El Gara"]
  }
};

// Olfactive families for product categorization
const OLFACTIVE_FAMILIES = [
  { key: 'oriental', label: 'Oriental', icon: '🕌' },
  { key: 'boise', label: 'Boisé', icon: '🌲' },
  { key: 'floral', label: 'Floral', icon: '🌸' },
  { key: 'fruite', label: 'Fruité', icon: '🍑' },
  { key: 'epice', label: 'Épicé', icon: '🌶️' },
  { key: 'cuir', label: 'Cuiré', icon: '🧥' },
  { key: 'aquatique', label: 'Aquatique', icon: '🌊' },
  { key: 'musque', label: 'Musqué', icon: '✨' },
  { key: 'ambre', label: 'Ambré', icon: '🔥' },
  { key: 'oud', label: 'Oud', icon: '🪵' },
  { key: 'agrumes', label: 'Agrumes', icon: '🍋' },
  { key: 'gourmand', label: 'Gourmand', icon: '🍫' },
  { key: 'poudreux', label: 'Poudré', icon: '💫' },
  { key: 'vert', label: 'Vert / Herbacé', icon: '🌿' }
];

// Delivery methods
const DELIVERY_METHODS = [
  { key: 'home', label: 'Livraison à domicile', icon: 'fa-home', desc: 'Livrée directement à votre adresse' },
  { key: 'relay', label: 'Retrait en point relais', icon: 'fa-store', desc: 'Retrait au bureau de livraison le plus proche' }
];

// Order status flow
const ORDER_STATUSES = [
  { key: 'pending', label: '⏳ Nouvelle', color: '#f39c12', bgColor: 'rgba(243,156,18,0.12)' },
  { key: 'confirmed', label: '✓ Confirmée', color: '#3498db', bgColor: 'rgba(52,152,219,0.12)' },
  { key: 'shipped', label: '🚚 Expédiée', color: '#9b59b6', bgColor: 'rgba(155,89,182,0.12)' },
  { key: 'delivered', label: '✅ Livrée', color: '#2ecc71', bgColor: 'rgba(46,204,113,0.12)' },
  { key: 'cancelled', label: '✕ Annulée', color: '#e74c3c', bgColor: 'rgba(231,76,60,0.12)' }
];
