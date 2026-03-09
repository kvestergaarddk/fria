import fs from 'fs'
import path from 'path'

const IMG = {
  chicken:    'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80',
  chicken2:   'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=400&q=80',
  meat:       'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80',
  stew:       'https://images.unsplash.com/photo-1534939561116-0fcd5f8a2b89?w=400&q=80',
  steak:      'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80',
  salmon:     'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
  fish:       'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
  shrimp:     'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80',
  salad:      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  soup:       'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
  veg:        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
  risotto:    'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80',
  curry:      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
  egg:        'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80',
  cake:       'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  choco:      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80',
  bread:      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  tart:       'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&q=80',
  pancake:    'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&q=80',
  bowl:       'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
  meatball:   'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
  pork:       'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
}

const GF = ['gluten free']
const LF = ['dairy free']
const GFLF = ['gluten free', 'dairy free']

// id, title, time, servings, img, dishTypes, cuisines, diets, protein, ingredients, steps
const recipes = [

// ── DANSK AFTENSMAD ──────────────────────────────────────────────────
{id:10001,title:'Frikadeller med kartoffelmos og persillesovs',time:45,servings:4,img:IMG.meatball,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'meat',
 ingredients:['500 g hakket svinekød og kalvekød (blandet)','1 æg','½ dl mælk (laktosefri)','1 lille løg, revet','Salt og peber','2 spsk smør (laktosefri)','800 g kartofler, skrællet og skåret','2 dl mælk (laktosefri), varm','30 g smør (laktosefri)','En stor håndfuld frisk persille, hakket','2 dl hønsebouillon','1 spsk maizena'],
 steps:['Rør hakket kød med æg, mælk, løg, salt og peber til en ensartet fars. Lad den hvile 10 minutter i køleskabet.','Kog kartoflerne i saltet vand til de er møre, ca. 20 minutter. Hæld vandet fra og mos dem med varm mælk, smør, salt og peber.','Form frikadellerne med en spiseske dyppet i vand. Steg dem i smør på middel varme ca. 4 minutter på hver side til de er gyldne og gennemstegte.','Lav persillesovsen: Varm bouillonen op, rør maizena ud i lidt koldt vand og tilsæt. Kog igennem og rør persille i til sidst.','Servér frikadellerne på kartoffelmos med rigeligt persillesovs.']},

{id:10002,title:'Stegt flæsk med persillesovs og nye kartofler',time:30,servings:4,img:IMG.pork,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'meat',
 ingredients:['600 g skiveskåret flæsk (ca. 5 mm tykke skiver)','800 g nye kartofler, skurede','30 g smør (laktosefri)','2 dl mælk (laktosefri)','1 spsk maizena','En stor håndfuld persille, groft hakket','Salt og peber','1 tsk eddike'],
 steps:['Kog kartoflerne i let saltet vand med et par kviste mynte, ca. 15 minutter.','Steg flæskeskiverne på en tør pande ved god varme, ca. 3-4 minutter per side til de er sprøde og gyldne. Krydr med salt og peber.','Lav persillesovsen: Smelt smørret i en gryde, rør maizena i og tilsæt mælken lidt ad gangen under konstant omrøring. Kog sovsen igennem i 3 minutter.','Rør rigeligt hakket persille i sovsen og smag til med salt, peber og en lille sjat eddike.','Servér flæskeskiverne med kogte kartofler og persillesovs.']},

{id:10003,title:'Hakkebøf med bløde løg og skysovs',time:30,servings:4,img:IMG.steak,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'meat',
 ingredients:['600 g hakket oksekød (10-15% fedt)','2 store løg, skåret i tynde ringe','3 spsk olivenolie','2 dl oksebouillon','Salt og peber','1 tsk paprika','1 tsk maizena opløst i lidt vand','Frisk timian til pynt'],
 steps:['Form hakket kød til 4 bøffer på ca. 150 g. Tryk dem en smule flade og krydr med salt, peber og paprika på begge sider.','Varm olie i en pande og steg løgene ved middel varme i 15-20 minutter til de er gyldne og bløde. Tag dem af panden og hold dem varme.','Steg bøfferne på den varme pande 3-4 minutter per side alt efter ønsket stegningsgrad.','Tilsæt bouillon til panden og lad det koge op. Jævn med maizena og smag til.','Servér bøfferne med de bløde løg og skysovs, gerne med kogte kartofler.']},

{id:10004,title:'Flæskesteg med rødkål og brunede kartofler',time:120,servings:6,img:IMG.pork,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'meat',
 ingredients:['1,5 kg flæskesteg med svær','1 tsk salt per 100 g kød','10 peberkorn','4 laurbærblade','500 g rødkål, fint snittet','3 spsk æbleeddike','2 spsk sukker','800 g kartofler, kogte og pillede','3 spsk sukker til brunede kartofler','30 g smør (laktosefri)'],
 steps:['Rids sværen i ruder og gnid generøst salt ned i hvert snit. Placer stegen med sværen nedad i en bradepande med lidt vand, laurbær og peber.','Steg ved 200°C de første 30 minutter, vend stegen og fortsæt ved 180°C i 60-70 minutter til kernetemperaturen er 65°C. Skru op til 230°C de sidste 10 min for sprød svær.','Brun sukker i en tykbundet gryde, tilsæt rødkål og rør rundt. Tilsæt eddike, lidt vand og simr under låg i 45 minutter. Smag til.','Brun sukker i en pande, tilsæt smør og de kogte kartofler. Vend dem forsigtigt til de er gyldne og karamelliserede.','Lad stegen hvile 10 minutter inden udskæring. Servér med rødkål og brunede kartofler.']},

{id:10005,title:'Boller i karry med ris',time:50,servings:4,img:IMG.curry,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GF,protein:'meat',
 ingredients:['500 g hakket svinekød','1 æg','50 g glutenfrie rasp','1 løg, fint hakket','2 spsk smør (laktosefri)','2 spsk karry','4 dl hønsebouillon','2 dl kokosmælk','300 g ris','Salt og peber','Frisk koriander til pynt'],
 steps:['Rør hakket kød med æg, glutenfri rasp, halvdelen af løget, salt og peber. Form boller på størrelse med en valnød.','Brun bollerne i smør i en gryde, tag dem op og sæt til side.','Svits resten af løget, tilsæt karry og steg 1 minut. Tilsæt bouillon og kokosmælk og bring i kog.','Læg bollerne tilbage i gryden og simr under låg i 20 minutter.','Kog risen efter anvisning. Servér bollerne i currysovsen over ris, pyntet med koriander.']},

{id:10006,title:'Gule ærter med røget pølse',time:90,servings:6,img:IMG.soup,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'meat',
 ingredients:['500 g tørrede gule ærter, udblødt natten over','300 g røget pølse (glutenfri), skåret i skiver','200 g røget bacon','2 gulerødder, skåret i tern','2 persillerødder, skåret i tern','1 selleri, skåret i tern','2 løg, hakket','1,5 l vand','Salt og peber','Frisk persille'],
 steps:['Hæld vandet fra ærterne og skyl dem. Kom dem i en stor gryde med 1,5 l frisk vand.','Tilsæt bacon og bring i kog. Skum af og simr i 30 minutter.','Tilsæt gulerødder, persillerødder, selleri og løg. Simr yderligere 30-40 minutter til ærterne er helt møre og begynder at gå i stykker.','Tilsæt pølseskiver og varm igennem i 10 minutter. Smag til med salt og peber.','Servér rygende varm med masser af frisk persille.']},

{id:10007,title:'Biksemad med røræg',time:25,servings:4,img:IMG.egg,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'meat',
 ingredients:['600 g kogte kartofler fra dagen før, skåret i tern','300 g kogt eller stegt svinekød, skåret i tern','2 løg, hakket','3 spsk smør (laktosefri)','6 æg','2 spsk mælk (laktosefri)','Salt og peber','Frisk persille','Worchestershiresauce (glutenfri)'],
 steps:['Smelt smør på en stor pande ved god varme. Tilsæt løg og steg til de er bløde.','Tilsæt kartofler og kød. Steg uden at røre for meget så der dannes en gylden skorpe. Krydr med salt, peber og et skvæt worcestershire.','Pisk æg med mælk, salt og peber. Smelt lidt smør i en separat pande og lav bløde røræg.','Vend biksemaden og steg til alt er sprødt og gyldent.','Servér biksemaden toppet med røræg og drysset med frisk persille.']},

{id:10008,title:'Oksehalesuppe med rodfrugter',time:180,servings:6,img:IMG.stew,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'meat',
 ingredients:['1 kg oksehale, skåret i stykker','3 gulerødder','2 persillerødder','1 lille knoldselleri','2 løg','4 laurbærblade','10 hele peberkorn','Salt','Frisk persille og purløg til servering'],
 steps:['Skyl oksehalestykkerne og kom dem i en stor gryde med koldt vand. Bring i kog og skum grundigt af.','Tilsæt hele løg, laurbær og peberkorn. Simr ved lav varme under låg i 2 timer.','Skræl og skær gulerødder, persillerødder og selleri i store stykker. Tilsæt efter 2 timer og simr 45 minutter mere.','Tag kødet op. Sigt suppen og smag til med salt. Pluk kødet fra benene.','Servér suppen med kød og grøntsager, drysset med frisk persille og purløg.']},

{id:10009,title:'Kogt torsk med sennepssovs og kartofler',time:30,servings:4,img:IMG.fish,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'fish',
 ingredients:['800 g torskefilet','1 l vand','2 tsk salt','1 tsk eddike','800 g kartofler','30 g smør (laktosefri)','2 spsk glutenfri sennep','2 dl hønsebouillon','1 spsk maizena','Salt og peber','Frisk dild'],
 steps:['Kog kartoflerne i saltet vand til de er møre, ca. 20 minutter.','Bring vand med salt og eddike i kog. Sænk varmen og pocher torsken ved ca. 80°C i 8-10 minutter alt efter tykkelse.','Lav sennepssovsen: Smelt smør, rør maizena ud i bouillon og tilsæt. Kog igennem og rør sennep i. Smag til med salt og peber.','Løft torsken forsigtigt op med en hulske.','Servér torsken på kartoflerne med sennepssovs og frisk dild.']},

{id:10010,title:'Marineret laks med agurkesalat',time:20,servings:4,img:IMG.salmon,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'fish',
 ingredients:['4 laksefileter à ca. 180 g','2 spsk sojasauce (glutenfri tamari)','1 spsk honning','1 spsk sesamolie','1 agurk, tyndt snittet','3 spsk riseddike','1 tsk sukker','1 tsk salt','Frisk dild og sesam til pynt'],
 steps:['Bland tamari, honning og sesamolie og mariner laksefileterne i blandingen i 15 minutter.','Rør riseddike, sukker og salt sammen til sukkeret er opløst. Vend agurkeskiver i og lad marinere 10 minutter.','Varm en pande op til god varme. Steg laksefileterne 3-4 minutter på skindsiden og 1-2 minutter på den anden side.','Tag af varmen og lad hvile 2 minutter.','Servér laksen med agurkesalaten og drys med sesam og frisk dild.']},

// ── DANSK BAGVÆRK ────────────────────────────────────────────────────
{id:10011,title:'Glutenfri bananbrød med valnødder',time:65,servings:8,img:IMG.bread,
 dishTypes:['breakfast','snack'],cuisines:['danish'],diets:GFLF,protein:'vegetarian',
 ingredients:['3 modne bananer','2 æg','80 ml kokosolie, smeltet','150 g mandelmel','50 g tapioka-mel','1 tsk bagepulver (glutenfri)','1 tsk kanel','1 knivspids salt','100 g valnødder, groft hakket'],
 steps:['Forvarm ovnen til 175°C. Beklæd en rugbrødsform med bagepapir.','Mos bananerne godt med en gaffel. Rør æg og kokosolie i.','Bland mandelmel, tapiokamel, bagepulver, kanel og salt. Vend de tørre ingredienser i bananmassen.','Rør halvdelen af valnødderne i dejen. Hæld i formen og drys resten af nødderne over.','Bag i 50-55 minutter til en pind stukket i midten kommer ren ud. Afkøl 15 minutter inden udskæring.']},

{id:10012,title:'Mandelkage med citron og vanilje',time:50,servings:8,img:IMG.cake,
 dishTypes:['dessert','snack'],cuisines:['danish'],diets:GFLF,protein:'vegetarian',
 ingredients:['250 g mandelmel','3 æg','150 g sukker','100 ml kokosolie, smeltet','Revet skal og saft af 1 citron','1 tsk vaniljeekstrakt','1 tsk bagepulver (glutenfri)','En knivspids salt','Flormelis til servering'],
 steps:['Forvarm ovnen til 175°C. Smør en springform (22 cm) og drys med lidt mandelmel.','Pisk æg og sukker lyst og luftigt i ca. 5 minutter.','Rør kokosolie, citronskal, citronsaft og vanilje i.','Vend mandelmel, bagepulver og salt forsigtigt i med en dejskraber.','Hæld i formen og bag 35-40 minutter. Afkøl og støv med flormelis inden servering.']},

{id:10013,title:'Glutenfrie chokoladebrownie',time:40,servings:12,img:IMG.choco,
 dishTypes:['dessert'],cuisines:['danish'],diets:GFLF,protein:'vegetarian',
 ingredients:['200 g mørk chokolade (70%), groft hakket','150 g kokosolie','3 æg','150 g brun farin','1 tsk vaniljeekstrakt','80 g mandelmel','30 g kakao','½ tsk salt'],
 steps:['Forvarm ovnen til 170°C. Beklæd en firkantet form (20x20 cm) med bagepapir.','Smelt chokolade og kokosolie over vandbad. Rør til det er glat og afkøl lidt.','Pisk æg og farin til det er lyst og luftigt. Rør vaniljeekstrakt i.','Vend chokolademassen i æggemassen. Sigt mandelmel, kakao og salt i og vend forsigtigt.','Hæld i formen og bag 20-22 minutter. Midten må stadig være lidt blød. Afkøl helt inden udskæring.']},

{id:10014,title:'Kokosmakroner med mørk chokolade',time:30,servings:20,img:IMG.cake,
 dishTypes:['dessert'],cuisines:['danish'],diets:GFLF,protein:'vegetarian',
 ingredients:['200 g revet kokos','120 g sukker','2 æggehvider','1 tsk vaniljeekstrakt','En knivspids salt','100 g mørk chokolade til dyp'],
 steps:['Forvarm ovnen til 180°C. Læg bagepapir på en bageplade.','Rør kokos, sukker, æggehvider, vanilje og salt godt sammen.','Form toppe med to skeer eller hænderne. Placer med god afstand på bagepladen.','Bag 12-15 minutter til de er gyldne i kanten. Afkøl helt.','Smelt chokolade over vandbad og dyp bunden af makronerne. Lad sætte sig på bagepapir.']},

{id:10015,title:'Nøddebrød med frø',time:75,servings:10,img:IMG.bread,
 dishTypes:['breakfast','snack'],cuisines:['danish'],diets:GFLF,protein:'vegetarian',
 ingredients:['150 g mandler','100 g hasselnødder','100 g solsikkekerner','50 g græskarkerner','50 g hørfrø','50 g chiafrø','3 æg','60 ml kokosolie, smeltet','1 tsk salt','1 tsk bagepulver (glutenfri)'],
 steps:['Forvarm ovnen til 160°C. Hak mandler og hasselnødder groft.','Bland alle nødder og frø i en skål. Tilsæt æg, kokosolie, salt og bagepulver og rør godt.','Hæld dejen i en beklædt rugbrødsform. Tryk overfladen jævn.','Bag i 55-60 minutter til brødet er fast og gyldent. En pind skal komme ren ud.','Afkøl helt på en rist inden udskæring. Brødet er bedst dagen efter.']},

// ── FRANSK AFTENSMAD ─────────────────────────────────────────────────
{id:10016,title:'Bœuf Bourguignon',time:180,servings:6,img:IMG.stew,
 dishTypes:['dinner','main course'],cuisines:['french'],diets:GFLF,protein:'meat',
 ingredients:['1,2 kg oksekød (tykkam), skåret i store tern','200 g røget bacon, skåret i strimler','300 g champignon, halveret','2 løg, hakket','3 fed hvidløg, hakket','1 flaske rødvin (Bourgogne)','3 dl oksebouillon','2 spsk tomatpuré','3 laurbærblade','Frisk timian','Salt og peber','2 spsk olivenolie'],
 steps:['Brun baconet i en stor jerngryde. Tag det op. Brun oksekødet i portioner i fedtet til det er gyldent på alle sider. Tag op og sæt til side.','Svits løg og hvidløg i samme gryde. Tilsæt tomatpuré og steg 2 minutter.','Hæld rødvin og bouillon i. Tilsæt laurbær, timian, kød og bacon. Bring i kog, skum af.','Læg låg på og simr ved lavest mulige varme i 2,5 timer til kødet er mørt.','Steg champignonerne separat i smør og tilsæt de sidste 15 minutter. Smag til og servér med kartoffelmos.']},

{id:10017,title:'Coq au Vin',time:90,servings:4,img:IMG.chicken,
 dishTypes:['dinner','main course'],cuisines:['french'],diets:GFLF,protein:'chicken',
 ingredients:['1 hel kylling, skåret i stykker','150 g røget bacon','200 g perleløg (eller skalotteløg)','250 g champignon','½ flaske rødvin','2 dl hønsebouillon','3 fed hvidløg','2 spsk tomatpuré','Frisk timian og laurbær','Salt og peber','2 spsk olivenolie'],
 steps:['Brun baconet i en stor gryde. Tilsæt kyllingestykkerne og brun godt på alle sider. Tag op.','Svits perleløg i 5 minutter. Tilsæt hvidløg og tomatpuré, steg 2 minutter.','Hæld vin og bouillon i. Læg kylling og bacon tilbage med timian og laurbær.','Simr under låg i 45-50 minutter til kyllingen er gennemstegt og mørt.','Steg champignonerne separat i smør og tilsæt de sidste 10 minutter. Smag til og servér.']},

{id:10018,title:'Ratatouille Provençale',time:60,servings:4,img:IMG.veg,
 dishTypes:['dinner','main course'],cuisines:['french'],diets:GFLF,protein:'vegetarian',
 ingredients:['2 auberginer, skåret i tern','2 zucchini, skåret i tern','2 røde peberfrugter, skåret i tern','4 tomater, skåret i tern','2 løg, hakket','4 fed hvidløg, hakket','4 spsk olivenolie','Frisk basilikum og timian','Salt og peber'],
 steps:['Drys aubergineternene med salt og lad trække 20 minutter. Skyl og tør.','Varm olivenolie i en stor gryde. Svits løg og hvidløg 5 minutter til bløde.','Tilsæt peberfrugter og steg 5 minutter. Tilsæt derefter aubergine og zucchini.','Tilsæt tomater, timian, salt og peber. Simr uden låg i 30 minutter til grøntsagerne er møre og sovsen er tyknet.','Smag til og servér varm eller ved stuetemperatur med masser af frisk basilikum.']},

{id:10019,title:'Poulet Rôti aux Herbes de Provence',time:80,servings:4,img:IMG.chicken2,
 dishTypes:['dinner','main course'],cuisines:['french'],diets:GFLF,protein:'chicken',
 ingredients:['1 hel kylling, ca. 1,5 kg','3 spsk olivenolie','2 tsk herbes de Provence','4 fed hvidløg, hele med skræl','1 citron, halveret','4 kviste frisk rosmarin','Salt og peber','500 g nye kartofler'],
 steps:['Forvarm ovnen til 200°C. Gnid kyllingen med olivenolie, herbes de Provence, salt og peber indvendigt og udvendigt.','Stik citronhalvdele, hvidløg og rosmarin ind i hulrummet.','Placer kyllingen i en bradepande med kartoflerne rundt om. Drys kartofler med olie og salt.','Steg i 60-70 minutter til kyllingesaften løber klar og huden er gylden og sprød.','Lad hvile 10 minutter inden udskæring. Servér med kartofler og stegesky.']},

{id:10020,title:'Crème Brûlée med Vanilje',time:45,servings:6,img:IMG.tart,
 dishTypes:['dessert'],cuisines:['french'],diets:GF,protein:'vegetarian',
 ingredients:['6 æggeblommer','100 g sukker','600 ml piskefløde','1 vaniljestang, korn udskrabet','6 tsk rørsukker til karamellisering'],
 steps:['Forvarm ovnen til 150°C. Placer 6 ramekiner i en dyb bradepande.','Pisk æggeblommer og sukker til det er lyst. Rør varm piskefløde med vaniljekorn i lidt ad gangen.','Hæld cremen gennem en sigte ned i ramekinerne. Hæld kogende vand i bradepanden til halvvejs op.','Bag i 40-45 minutter til cremen er sat med en lille jævn zittering i midten. Afkøl og stil på køl i min. 2 timer.','Drys med rørsukker og karamelliser med en brænder til en sprød gylden top. Servér straks.']},

{id:10021,title:'Moules Marinières med hvidvin',time:25,servings:4,img:IMG.shrimp,
 dishTypes:['dinner','main course'],cuisines:['french'],diets:GFLF,protein:'fish',
 ingredients:['2 kg friske blåmuslinger, rensede','2 skalotteløg, fint hakket','3 fed hvidløg, hakket','250 ml tør hvidvin','3 spsk smør (laktosefri)','Frisk persille, groft hakket','Salt og peber','Glutenfrit brød til servering'],
 steps:['Rens muslinger grundigt under koldt vand. Kassér dem der er åbne og ikke lukker sig ved et let tryk.','Smelt smør i en stor gryde med låg. Svits skalotteløg og hvidløg 3 minutter.','Tilsæt hvidvin og bring i kog. Tilsæt muslinger og læg låg på.','Kog ved høj varme i 4-5 minutter under jævnlig rystning. Kassér muslinger der ikke har åbnet sig.','Drys med persille, smag til og servér straks i gryden med godt glutenfrit brød.']},

{id:10022,title:'Salade Niçoise',time:20,servings:4,img:IMG.salad,
 dishTypes:['lunch','dinner'],cuisines:['french'],diets:GFLF,protein:'fish',
 ingredients:['4 tun-steaks eller 2 dåser tunfisk i olie','4 æg, hårdkogte','200 g fine grønne bønner (haricots verts)','4 tomater, skåret i både','1 agurk','100 g sorte oliven','4 ansjosfileter','Salatblade','3 spsk olivenolie','1 spsk citronsaft','Salt og peber'],
 steps:['Blancher de grønne bønner i saltet vand i 3 minutter. Køl hurtigt ned i isvand.','Kog æggene 8 minutter, afkøl og pil dem. Skær i kvarte.','Skær tomater, agurk og anret alle ingredienser på et stort fad.','Placer tun, æg, oliven og ansjoser ovenpå.','Pisk olivenolie og citronsaft med salt og peber. Dryp over salaten og servér straks.']},

{id:10023,title:'Tarte Tatin med æbler',time:60,servings:6,img:IMG.tart,
 dishTypes:['dessert'],cuisines:['french'],diets:GF,protein:'vegetarian',
 ingredients:['6 æbler (gerne Cox eller Belle de Boskoop), skrællet og delt i kvarte','150 g sukker','80 g smør','1 tsk kanel','1 pakke glutenfri butterdej eller mørdej'],
 steps:['Smelt sukker i en ovnfast pande (24 cm) til det er gyldent karamel. Tilsæt smør og rør hurtigt.','Placer æblestykkerne tæt i karamellen med den runde side nedad. Drys med kanel.','Steg æblerne ved middel varme i 10 minutter til de er let møre og karamellen er boblende.','Rul dejen ud og læg den over æblerne. Stik hjørnerne ned langs siderne.','Bag ved 200°C i 25 minutter til dejen er gylden. Afkøl 5 minutter og vend tærten ud på et fad. Servér lun.']},

{id:10024,title:'Mousse au Chocolat',time:30,servings:6,img:IMG.choco,
 dishTypes:['dessert'],cuisines:['french'],diets:GFLF,protein:'vegetarian',
 ingredients:['200 g mørk chokolade (70%)','4 æg, delt i blommer og hvider','80 g sukker','En knivspids salt','1 tsk vaniljeekstrakt'],
 steps:['Smelt chokoladen over vandbad og lad køle lidt af.','Pisk æggeblommer med halvdelen af sukkeret til det er lyst og cremet. Rør i den smeltede chokolade.','Pisk æggehvider med salt til skum. Tilsæt resten af sukkeret og pisk til fast skum.','Vend æggehvideskummet i chokolademassen i tre omgange. Bevar så meget luft som muligt.','Fordel i 6 glas og stil på køl i mindst 3 timer inden servering.']},

{id:10025,title:'Gratin Dauphinois',time:80,servings:6,img:IMG.veg,
 dishTypes:['dinner','side dish'],cuisines:['french'],diets:GF,protein:'vegetarian',
 ingredients:['1 kg kartofler, tyndt snittet (ca. 3 mm)','400 ml piskefløde','2 fed hvidløg, presset','1 tsk muskatnød, revet','Salt og peber','50 g revet gruyère (kan udelades for LF)'],
 steps:['Forvarm ovnen til 170°C. Gnid et ildfast fad med hvidløg og smør det.','Bland fløde med hvidløg, muskatnød, salt og peber.','Læg kartofelskiverne lagvis i fadet og hæld fløden over for hvert lag.','Drys med gruyère øverst og bag i 60-70 minutter til kartoflerne er møre og toppen er gylden.','Lad gratinen sætte sig 10 minutter inden servering.']},

// ── ITALIENSK AFTENSMAD ──────────────────────────────────────────────
{id:10026,title:'Risotto ai Funghi Porcini',time:40,servings:4,img:IMG.risotto,
 dishTypes:['dinner','main course'],cuisines:['italian'],diets:GFLF,protein:'vegetarian',
 ingredients:['350 g risotto-ris (Arborio eller Carnaroli)','30 g tørrede Karl Johan-svampe, udblødt','300 g friske champignon, skåret i skiver','1 løg, fint hakket','2 fed hvidløg, hakket','150 ml tør hvidvin','1,2 l varmende grøntsagsbouillon','3 spsk olivenolie','Frisk persille og sort peber'],
 steps:['Udblød tørrede svampe i 250 ml lunt vand i 20 minutter. Hak dem groft, gem udblødsningsvandet (sigt det).','Svits løg og hvidløg i olivenolie til bløde. Tilsæt friske champignon og steg 5 minutter.','Tilsæt risene og ryst til de er gennemsigtige. Hæld vin i og rør til det er absorberet.','Tilsæt svampene og hæld den varme bouillon i lidt ad gangen under konstant omrøring. Processen tager ca. 20 minutter.','Smag til med salt og peber. Servér straks drysset med frisk persille.']},

{id:10027,title:'Osso Buco med Gremolata',time:120,servings:4,img:IMG.stew,
 dishTypes:['dinner','main course'],cuisines:['italian'],diets:GFLF,protein:'meat',
 ingredients:['4 kalveskiver med ben (osso buco), ca. 4 cm tykke','2 gulerødder, hakket','2 stængler selleri, hakket','1 løg, hakket','3 fed hvidløg','400 g flåede tomater','300 ml hvidvin','300 ml oksebouillon','Revet skal af 1 citron og 1 appelsin','Frisk persille','Salt og peber','2 spsk olivenolie'],
 steps:['Krydr kødet med salt og peber. Brun godt i olie i en stor jerngryde, ca. 4 minutter per side. Tag op.','Svits gulerødder, selleri og løg i samme gryde i 8 minutter. Tilsæt hvidløg og steg 2 min mere.','Tilsæt vin og lad det koge ind til halvt. Tilsæt tomater og bouillon.','Læg kødet tilbage i gryden. Simr under låg i 1,5 time til kødet falder fra benet.','Lav gremolata: Bland hakket persille med citronskal, appelsinskal og lidt hakket hvidløg. Drys over ved servering.']},

{id:10028,title:'Saltimbocca alla Romana',time:20,servings:4,img:IMG.meat,
 dishTypes:['dinner','main course'],cuisines:['italian'],diets:GFLF,protein:'meat',
 ingredients:['8 tynde kalveschnitzler','8 skiver parmaskinke','8 friske salvieblade','4 spsk smør (laktosefri)','100 ml tør hvidvin','Salt og peber'],
 steps:['Placer et salvieblad og en skive parmaskinke på hver kalveschnitzler. Fæst med en tandstik.','Krydr kødsiden let med sort peber (skinken er allerede salt).','Smelt smør i en stor pande. Steg schnitzlerne skinke-siden nedad først, ca. 2 minutter, vend og steg 1 minut.','Tag kødet op. Hæld hvidvinen i panden og lad det koge op under omrøring.','Servér straks med de reducerede stegesky og gerne ristede kapriksber.']},

{id:10029,title:'Pollo al Limone',time:35,servings:4,img:IMG.chicken,
 dishTypes:['dinner','main course'],cuisines:['italian'],diets:GFLF,protein:'chicken',
 ingredients:['4 kyllingebryster','Saft og revet skal af 2 usprøjtede citroner','4 fed hvidløg, tyndt snittet','3 spsk olivenolie','150 ml tør hvidvin','Frisk rosmarin og timian','Salt og peber'],
 steps:['Lav snit i kyllingebrysterne og krydr generøst med salt og peber.','Varm olie i en pande og brun kyllingen 4-5 minutter per side til gylden.','Tilsæt hvidløg og urter, steg 1 minut. Tilsæt hvidvin og lad det koge ind til halvt.','Tilsæt citronsaft og -skal. Simr under låg i 10 minutter til kyllingen er gennemstegt.','Lad hvile 5 minutter. Smag sovsen til og servér med citronskiver og friske urter.']},

{id:10030,title:'Caponata Siciliana',time:45,servings:6,img:IMG.veg,
 dishTypes:['dinner','side dish'],cuisines:['italian'],diets:GFLF,protein:'vegetarian',
 ingredients:['2 auberginer, skåret i tern','3 stængler selleri, skåret i skiver','1 løg, hakket','50 g grønne oliven, udstenede','30 g saltede kapers, skyllet','4 spsk rødvinseddike','1 spsk sukker','400 g flåede tomater','4 spsk olivenolie','Salt og peber','Frisk basilikum'],
 steps:['Salt aubergineternene og lad dem trække 20 minutter. Skyl og tør grundigt.','Steg aubergineternene i rigelig olivenolie til gyldne. Sæt til side.','Svits løg og selleri 5 minutter. Tilsæt tomater og simr 10 minutter.','Tilsæt eddike, sukker, oliven og kapers. Simr 5 minutter.','Vend aubergine i og simr alt i 10 minutter. Afkøl og servér ved stuetemperatur med basilikum.']},

{id:10031,title:'Panna Cotta med Bær-coulis',time:20,servings:6,img:IMG.tart,
 dishTypes:['dessert'],cuisines:['italian'],diets:GF,protein:'vegetarian',
 ingredients:['600 ml piskefløde','80 g sukker','1 vaniljestang','3 blade husblas','200 g blandede bær (friske eller frosne)','2 spsk sukker til coulis','Saft af ½ citron'],
 steps:['Udblød husblas i koldt vand i 5 minutter.','Varm fløde, sukker og vaniljekorn op til kogepunktet. Tag fra varmen.','Klem vand fra husblas og opløs i den varme fløde. Rør til det er helt opløst.','Hæld i 6 forme og stil på køl i min. 4 timer eller natten over.','Lav coulis: Kog bær med sukker og citronsaft 5 minutter og blend. Vend panna cotta ud og hæld coulis over.']},

{id:10032,title:'Minestrone med Sæsongrøntsager',time:40,servings:6,img:IMG.soup,
 dishTypes:['dinner','main course'],cuisines:['italian'],diets:GFLF,protein:'vegetarian',
 ingredients:['2 gulerødder, skåret i tern','2 stængler selleri, skåret i skiver','1 zucchini, skåret i tern','200 g spinat','1 dåse kikærter, skyllet','1 dåse flåede tomater','1 løg, hakket','3 fed hvidløg, hakket','1,5 l grøntsagsbouillon','3 spsk olivenolie','Frisk basilikum','Salt og peber'],
 steps:['Svits løg og hvidløg i olivenolie i en stor gryde i 5 minutter.','Tilsæt gulerødder og selleri og steg 5 minutter mere.','Tilsæt zucchini, tomater og bouillon. Bring i kog og simr 15 minutter.','Tilsæt kikærter og spinat. Simr yderligere 5 minutter.','Smag til med salt og peber. Servér med masser af frisk basilikum og olivenolie.']},

{id:10033,title:'Frittata med Spinat og Soltørrede Tomater',time:25,servings:4,img:IMG.egg,
 dishTypes:['dinner','breakfast','main course'],cuisines:['italian'],diets:GF,protein:'vegetarian',
 ingredients:['8 æg','100 g frisk spinat','80 g soltørrede tomater, groft hakket','50 g parmesan, revet','1 løg, fint hakket','2 fed hvidløg, hakket','2 spsk olivenolie','Salt og peber','Frisk basilikum'],
 steps:['Forvarm ovnens grill. Pisk æggene med salt og peber og halvdelen af parmesanen.','Svits løg og hvidløg i ovnfast pande i olivenolie til bløde.','Tilsæt spinat og lad det falde sammen. Tilsæt soltørrede tomater.','Hæld æggemassen over. Steg ved middel varme 4-5 minutter til bunden er sat.','Drys med resten af parmesan og sæt under grillen 3-4 minutter til toppen er gylden. Servér med frisk basilikum.']},

{id:10034,title:'Zuppa di Pesce',time:45,servings:4,img:IMG.fish,
 dishTypes:['dinner','main course'],cuisines:['italian'],diets:GFLF,protein:'fish',
 ingredients:['500 g blandede fisk (torsk, laks, rejer)','400 g flåede tomater','200 ml tør hvidvin','1 løg, hakket','3 fed hvidløg, hakket','2 spsk olivenolie','Frisk persille og basilikum','Chiliflager','Salt og peber','400 g muslinger (valgfrit)'],
 steps:['Svits løg og hvidløg i olivenolie i en bred gryde. Tilsæt chili og steg 1 minut.','Tilsæt vin og lad det koge ind til halvt. Tilsæt tomater og simr 15 minutter.','Tilsæt de faste fisk og simr 5 minutter. Tilsæt muslinger og rejer og kog under låg 5 minutter.','Kassér muslinger der ikke åbner sig. Smag til med salt og peber.','Servér straks med masser af friske urter og et dryp olivenolie.']},

{id:10035,title:'Acqua Pazza – Fisk i Vand med Tomat',time:25,servings:4,img:IMG.fish,
 dishTypes:['dinner','main course'],cuisines:['italian'],diets:GFLF,protein:'fish',
 ingredients:['4 stykker fast hvid fisk (torsk, havbars)','300 g cherrytomater, halverede','4 fed hvidløg, tyndt snittet','100 ml tør hvidvin','200 ml vand','4 spsk olivenolie','Frisk persille','Chili (valgfrit)','Salt og peber'],
 steps:['Varm olivenolie i en bred pande. Tilsæt hvidløg og steg til let gyldent.','Tilsæt tomater og chili. Steg 3-4 minutter til tomaterne begynder at gå i stykker.','Tilsæt vin og vand. Bring i kog.','Læg fiskestykkerne i væsken. Dæk med låg og pochér 8-10 minutter til fisken er gennemstegt.','Smag til, drys med persille og servér direkte fra panden.']},

// ── HURTIGE RETTER ───────────────────────────────────────────────────
{id:10036,title:'Hurtig Kyllingewok med Grøntsager',time:20,servings:4,img:IMG.chicken,
 dishTypes:['dinner','main course'],cuisines:['asian'],diets:GFLF,protein:'chicken',
 ingredients:['500 g kyllingefilet, skåret i strimler','2 gulerødder, snittet i julienne','1 rød peberfrugt, snittet','200 g broccoli i buketter','3 spsk tamari (glutenfri soja)','1 spsk sesamolie','2 spsk kokosolie','3 fed hvidløg, hakket','1 spsk revet ingefær','Sesamfrø og grønne løg'],
 steps:['Varm kokosolien i en wok ved høj varme. Tilsæt hvidløg og ingefær og rør i 30 sekunder.','Tilsæt kyllingestrimler og steg ved høj varme i 4-5 minutter til gyldne.','Tilsæt gulerødder og broccoli og wok 3 minutter. Tilsæt peberfrugt og steg 2 minutter mere.','Hæld tamari og sesamolie over. Ryst og vend alt godt rundt.','Servér straks drysset med sesamfrø og grønne løg.']},

{id:10037,title:'Laks med Avocado-Salsa',time:15,servings:4,img:IMG.salmon,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'fish',
 ingredients:['4 laksefileter','2 avocadoer, skåret i tern','1 rødløg, fint hakket','Saft af 2 limefrugter','2 spsk koriander, hakket','1 rød chili, fint hakket','2 spsk olivenolie','Salt og peber'],
 steps:['Krydr laksefileterne med salt og peber.','Steg laksen i olivenolie 3-4 minutter per side til den er gylden og næsten gennemstegt.','Mens laksen steger: bland avocado, rødløg, limesaft, koriander og chili. Smag til.','Tag laksen af varmen og lad hvile 2 minutter.','Servér laksen toppet med avocado-salsa.']},

{id:10038,title:'Røræg med Røget Laks og Frisk Dild',time:10,servings:2,img:IMG.egg,
 dishTypes:['breakfast','lunch'],cuisines:['danish'],diets:GFLF,protein:'fish',
 ingredients:['4 æg','100 g røget laks, revet i stykker','2 spsk smør (laktosefri)','Frisk dild','Salt og peber','Laktosefri cremefraiche (valgfrit)'],
 steps:['Pisk æggene let med salt og peber.','Smelt smør i en pande ved lav-middel varme.','Hæld æggene i og rør langsomt med en dejskraber. Tag fra varmen mens de stadig er let bløde.','Fold røget laks i.','Servér straks med frisk dild og evt. en klat cremefraiche.']},

{id:10039,title:'Tomatssuppe med Frisk Basilikum',time:25,servings:4,img:IMG.soup,
 dishTypes:['dinner','lunch'],cuisines:['italian'],diets:GFLF,protein:'vegetarian',
 ingredients:['800 g flåede tomater','1 løg, hakket','3 fed hvidløg, hakket','3 spsk olivenolie','3 dl grøntsagsbouillon','1 tsk sukker','En stor håndfuld frisk basilikum','Salt og peber'],
 steps:['Svits løg og hvidløg i olivenolie til bløde, ca. 5 minutter.','Tilsæt tomater, bouillon og sukker. Simr i 15 minutter.','Blend suppen glat med en stavblender.','Smag til med salt og peber. Tilsæt halvdelen af basilikum og blend kort.','Servér med resten af basilikum og et dryp olivenolie.']},

{id:10040,title:'Grillet Rejer med Hvidløg og Persille',time:15,servings:4,img:IMG.shrimp,
 dishTypes:['dinner','main course'],cuisines:['french'],diets:GFLF,protein:'fish',
 ingredients:['600 g store rejer, rensede (men med hale)','4 fed hvidløg, fint hakket','3 spsk smør (laktosefri)','Saft af 1 citron','3 spsk frisk persille, hakket','Chiliflager','Salt og peber'],
 steps:['Krydr rejerne med salt, peber og chili.','Smelt smør i en stor pande ved høj varme til det begynder at bruse.','Tilsæt rejerne i et enkelt lag og steg 2 minutter.','Vend rejerne, tilsæt hvidløg og steg 1-2 minutter mere til de er lyserøde og gennemstegte.','Tilsæt citronsaft og persille. Servér straks.']},

{id:10041,title:'Blomkåls-"Ris" med Kylling og Gurkemeje',time:25,servings:4,img:IMG.chicken,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'chicken',
 ingredients:['500 g kyllingefilet, skåret i tern','1 blomkålshoved, revet til "ris" i foodprocessor','1 løg, hakket','3 fed hvidløg','1 tsk gurkemeje','1 tsk spidskommen','2 spsk kokosolie','Saft af 1 citron','Frisk koriander','Salt og peber'],
 steps:['Varm kokosolie i en stor pande. Krydr kylling med salt, peber, gurkemeje og spidskommen.','Steg kyllingen 5-6 minutter til gylden og gennemstegt. Sæt til side.','I samme pande: svits løg og hvidløg 3 minutter. Tilsæt blomkålsris og steg 5 minutter.','Læg kyllingen tilbage i panden og bland alt godt. Smag til med citronsaft, salt og peber.','Servér drysset med frisk koriander.']},

{id:10042,title:'Hurtig Æg-gryderet med Tomater og Kikærter',time:20,servings:4,img:IMG.egg,
 dishTypes:['dinner','breakfast'],cuisines:['danish'],diets:GFLF,protein:'vegetarian',
 ingredients:['6 æg','400 g flåede tomater','1 dåse kikærter, skyllet','1 løg, hakket','2 fed hvidløg','1 tsk spidskommen','1 tsk paprika','Chiliflager','2 spsk olivenolie','Frisk koriander','Salt og peber'],
 steps:['Svits løg og hvidløg i olivenolie 4 minutter. Tilsæt spidskommen, paprika og chili, steg 1 minut.','Tilsæt tomater og kikærter. Simr 8 minutter til lidt indkogt.','Lav 6 fordybninger i tomatsovsen og knæk et æg i hver.','Læg låg på og kog ved middel varme 5-6 minutter til æggehviderne er sat men blommerne stadig bløde.','Servér straks med frisk koriander og brød.']},

{id:10043,title:'Kyllingesuppe med Ingefær og Citrongræs',time:30,servings:4,img:IMG.soup,
 dishTypes:['dinner','lunch'],cuisines:['asian'],diets:GFLF,protein:'chicken',
 ingredients:['400 g kyllingefilet, skåret i strimler','1 l hønsebouillon','1 stang citrongræs, let knust','2 cm frisk ingefær, revet','2 fed hvidløg','1 rød chili','200 g champignon, skåret i skiver','100 g spinat','Saft af 1 lime','3 spsk tamari (glutenfri)','Frisk koriander'],
 steps:['Bring bouillon i kog med citrongræs, ingefær, hvidløg og chili. Simr 10 minutter.','Fisk citrongræs op. Tilsæt kyllingestrimler og simr 8 minutter.','Tilsæt champignon og simr 3 minutter. Tilsæt spinat og lad det falde sammen.','Smag til med tamari og limesaft.','Servér drysset med frisk koriander.']},

{id:10044,title:'Stegt Torsk med Kapers og Citronsmør',time:20,servings:4,img:IMG.fish,
 dishTypes:['dinner','main course'],cuisines:['danish'],diets:GFLF,protein:'fish',
 ingredients:['4 tykke torskefileter','3 spsk smør (laktosefri)','2 spsk kapers','Saft af 1 citron','Frisk persille','Salt og peber','2 spsk olivenolie'],
 steps:['Krydr torsken godt med salt og peber på begge sider.','Varm olivenolie i en pande ved høj varme. Steg torsken 4-5 minutter på den ene side uden at røre.','Vend forsigtigt og steg 2-3 minutter på den anden side til fisken flager.','Tag fisken op. Tilsæt smør til panden og lad det bruse til nøddebrunt. Tilsæt kapers og citronsaft.','Hæld smørret over fisken og servér straks med frisk persille.']},

{id:10045,title:'Avocado-Rejesalat med Mango',time:15,servings:4,img:IMG.shrimp,
 dishTypes:['lunch','dinner'],cuisines:['danish'],diets:GFLF,protein:'fish',
 ingredients:['300 g kogte rejer','2 avocadoer, skåret i tern','1 mango, skåret i tern','½ rødløg, fint hakket','Saft af 2 limefrugter','2 spsk olivenolie','Frisk koriander','Salt og peber','Salatblade til anretning'],
 steps:['Fordel salatblade på fire tallerkener.','Bland rejer, avocado, mango og rødløg forsigtigt.','Pisk limesaft og olivenolie. Smag til med salt og peber.','Vend dressingen i salaten.','Anret på salatbladene og drys med frisk koriander.']},

// ── MERE AFTENSMAD ───────────────────────────────────────────────────
{id:10046,title:'Marokkansk Lammestovning med Kikærter',time:90,servings:6,img:IMG.stew,
 dishTypes:['dinner','main course'],cuisines:['mediterranean'],diets:GFLF,protein:'meat',
 ingredients:['800 g lammekød (skulder), skåret i tern','1 dåse kikærter, skyllet','400 g flåede tomater','2 løg, hakket','3 fed hvidløg','2 tsk spidskommen','2 tsk koriander','1 tsk kanel','1 tsk gurkemeje','1 tsk paprika','Saft og skal af 1 citron','Frisk koriander','2 spsk olivenolie','Salt og peber'],
 steps:['Varm olie i en stor gryde. Brun lammekødet i portioner. Sæt til side.','Svits løg og hvidløg 5 min. Tilsæt alle krydderier og steg 2 minutter under omrøring.','Tilsæt tomater, lammekødet og lidt vand til det er næsten dækket. Bring i kog.','Simr under låg i 60 minutter. Tilsæt kikærter og simr 15 minutter mere.','Smag til med citronsaft, salt og peber. Servér med frisk koriander.']},

{id:10047,title:'Kylling Tikka Masala',time:45,servings:4,img:IMG.curry,
 dishTypes:['dinner','main course'],cuisines:['indian'],diets:GF,protein:'chicken',
 ingredients:['600 g kyllingefilet, skåret i store tern','400 ml kokosmælk','400 g flåede tomater','1 løg, hakket','4 fed hvidløg, hakket','2 cm ingefær, revet','2 spsk tikka masala krydderi','1 tsk garam masala','2 spsk kokosolie','Frisk koriander','Salt'],
 steps:['Varm kokosolie i en gryde. Svits løg, hvidløg og ingefær i 5 minutter.','Tilsæt tikka masala og garam masala og steg 2 minutter.','Tilsæt tomater og simr 10 minutter. Blend saucen glat.','Tilsæt kylling og kokosmælk. Simr under låg i 20 minutter til kyllingen er gennemstegt.','Smag til med salt. Servér med ris og frisk koriander.']},

{id:10048,title:'Thai Rød Curry med Kylling og Grøntsager',time:30,servings:4,img:IMG.curry,
 dishTypes:['dinner','main course'],cuisines:['asian'],diets:GFLF,protein:'chicken',
 ingredients:['500 g kyllingefilet','400 ml kokosmælk','2 spsk rød curry-pasta (tjek glutenfri)','1 rød peberfrugt','200 g bambusskud','100 g spinat','2 spsk fiskesauce (glutenfri)','1 spsk brun farin','Frisk basilikum (thai)','Limeblade (valgfrit)'],
 steps:['Steg curry-pasta i lidt af kokosmælkens fede del i en wok i 1 minut.','Tilsæt resten af kokosmælk, fiskesauce og farin. Bring i kog.','Tilsæt kylling og peberfrugt. Simr 10-12 minutter.','Tilsæt bambusskud og spinat. Simr 3 minutter mere.','Smag til og servér med jasminris og frisk basilikum.']},

{id:10049,title:'Spansk Gazpacho',time:15,servings:4,img:IMG.veg,
 dishTypes:['lunch','dinner'],cuisines:['spanish'],diets:GFLF,protein:'vegetarian',
 ingredients:['800 g modne tomater, groft hakket','1 agurk, skrællet og groft hakket','1 rød peberfrugt, groft hakket','1 lille rødløg','2 fed hvidløg','4 spsk olivenolie','2 spsk sherryeddike','Salt og peber','Isvand til konsistens','Frisk basilikum til pynt'],
 steps:['Blend tomater, agurk, peberfrugt, løg og hvidløg til en jævn purée.','Tilsæt olivenolie og eddike. Blend igen.','Smag til med salt og peber. Tilsæt isvand til ønsket konsistens.','Stil suppen på køl i min. 1 time.','Servér iskold med en lille tråd olivenolie og friske urter.']},

{id:10050,title:'Spansk Tortilla',time:30,servings:6,img:IMG.egg,
 dishTypes:['lunch','dinner'],cuisines:['spanish'],diets:GFLF,protein:'vegetarian',
 ingredients:['6 æg','400 g kartofler, skrællet og tyndt snittet','1 løg, tyndt snittet','150 ml olivenolie','Salt og peber'],
 steps:['Varm olivenolie i en ovnfast pande (24 cm). Steg kartofler og løg ved middel varme i 20 minutter til møre men ikke brunet. Dræn olien fra (gem den).','Pisk æg med salt og peber. Vend kartofler og løg i æggeblandingen.','Varm 2 spsk af den gemte olie i panden. Hæld æggekartoffel-blandingen i. Sæt under grill ved 180°C i 10-12 minutter.','Tjek om tortillaen er sat i midten. Lad den hvile 5 minutter.','Servér i skiver ved stuetemperatur.']},

]

// ── SKRIV FILER ──────────────────────────────────────────────────────
const publicDir = path.resolve('./public')
const recipesDir = path.join(publicDir, 'recipes')
fs.mkdirSync(recipesDir, { recursive: true })

// List data til recipes.json
const listRecipes = recipes.map(r => ({
  id: r.id,
  title: r.title,
  image: r.img,
  readyInMinutes: r.time,
  servings: r.servings,
  dishTypes: r.dishTypes,
  cuisines: r.cuisines,
  diets: r.diets,
  protein: r.protein,
}))

// Merge med eksisterende
const existingPath = path.join(publicDir, 'recipes.json')
let existing = []
if (fs.existsSync(existingPath)) {
  const raw = JSON.parse(fs.readFileSync(existingPath, 'utf8'))
  existing = (raw.recipes || []).filter(r => r.id < 10000)
}

const merged = [...existing, ...listRecipes]
fs.writeFileSync(existingPath, JSON.stringify({ recipes: merged }, null, 2))
console.log(`✓ recipes.json opdateret: ${merged.length} opskrifter i alt`)

// Detail JSON-filer
for (const r of recipes) {
  const detail = {
    id: r.id,
    title: r.title,
    image: r.img,
    readyInMinutes: r.time,
    servings: r.servings,
    ingredients: r.ingredients,
    steps: r.steps,
  }
  const filePath = path.join(recipesDir, `${r.id}.json`)
  fs.writeFileSync(filePath, JSON.stringify(detail))
  process.stdout.write('.')
}
console.log(`\n✓ ${recipes.length} detail-filer skrevet til /public/recipes/`)
