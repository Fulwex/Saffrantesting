// Photo numbers refer to the user's original 26-image upload.
const files = [
  'c21d6eae-3548-46cb-8940-ddd89bd5c47a.jpg','eeb4f753-57d9-44fb-84c0-27cdd8446000.jpg','85facdef-87e2-4169-af7d-ea7ab970f2f8.png','63761321-c4b4-4b2b-adb6-f7522056672b.png','49f3d198-e64b-4097-8ab9-dff95766d8e9.png','b9d3b10b-743e-4f42-b9d8-3181ed21ce23.jpg','b97ab339-c9d2-45ba-a5fb-f8bc972b99cb.png','b3c87762-785b-4b03-a4be-9b11c32cc7fe.jpg','3a59185b-a9a2-44ce-a57c-4c8ad6440861.png','f42f0544-902b-458c-bd01-48fc33c01fe2.png','a28175c2-3751-4463-9733-e51442ef6be7.png','8f9c7b49-ee85-4821-98a9-6c8d0e3141e4.png','91609c83-44e3-4c59-bdf8-0b23ad0ac8be.png','967bba57-025c-497b-9c3d-c9211223142a.png','4ce305a0-d7d6-4101-af31-1f14e00fcd3b.png','39d05f93-5a3e-45c4-838f-2c228060e140.png','b09ed782-0691-4721-9633-3ba63e6795ae.png','2c725bcc-36c5-4603-bb62-474ccc1846e0.png','7ed72cba-b37c-4704-8092-19e2b482d2c0.png','565b2cb3-828f-48fd-afe7-a5085ffe54b7.png','7e7a7915-d528-410c-98fc-8a692d2d30e7.png','25242ea3-a8c8-4145-a74a-8459c4eea388.png','66ca29bf-4d27-4398-846f-d26ad5dacd16.png','ae3c7eba-9d89-42aa-907e-f99e3ea62c1c.png','78b6f05e-d8e3-4e37-bc05-32ac944804d7.png','fc9add27-993a-4e94-8aaf-e3d935b0500e.png'
];
export const sourcePhotos = files.map((file, index) => ({number:index+1, file, path:`C:/Users/gemuk/AppData/Local/Temp/codex-clipboard-${file}`}));
const shot = (number, caption, position='50% 50%') => ({number, caption, position, thumb:`assets/partners/work-${number}-small.webp`, full:`assets/partners/work-${number}.webp`});
export const partners = [
  {id:'seven-lakes', name:'Seven Lakes', location:'Київ', type:'Жакардові рушники', source:'https://sevenlakes.com.ua/', photos:[shot(7,'Жакардовий рушник Seven Lakes','50% 72%'),shot(1,'Фактура та жакардовий логотип Seven Lakes'),shot(16,'Жакардовий рушник Seven Lakes у червоному кольорі')]},
  {id:'radisson', name:'Radisson Blu Resort', location:'Буковель', type:'Махрові рушники', source:'https://www.radissonhotels.com/en-us/hotels/radisson-blu-resort-bukovel', photos:[shot(9,'Махровий рушник Radisson Blu Resort Bukovel','50% 22%')]},
  {id:'premier', name:'Premier Hotels and Resorts', location:'Мережа готелів · Україна', type:'Халати та рушники', source:'https://www.phnr.com/', photos:[shot(23,'Махровий халат із символом Premier','50% 38%'),shot(4,'Кольоровий рушник Premier','72% 71%'),shot(24,'Фірмова етикетка на махровому рушнику Premier','50% 40%'),shot(5,'Фірмова етикетка Premier на кольоровому текстилі')]},
  {id:'sunray', name:'SunRay Hotel', location:'Підгородне · Дніпропетровська обл.', type:'Махрові рушники', source:'https://sunray.ua/articles/hotel/denne-prozhyvannya/', photos:[shot(2,'Жовтий махровий рушник SunRay Hotel','50% 58%')]},
  {id:'bristol', name:'Bristol Hotel', location:'Одеса', type:'Махрові халати', source:'https://bristol-hotel.com.ua/', photos:[shot(21,'Білий халат Bristol Hotel Odesa','50% 44%')]},
  {id:'redling', name:'Redling Hotel', location:'Одеса', type:'Махрові рушники', source:'https://redling-hotel.com.ua/en/', photos:[shot(14,'Махровий рушник із логотипом Redling','50% 40%')]},
  {id:'trysyny', name:'Три Сини та Донька', location:'Східниця · Львівська обл.', type:'Махрові халати', source:'https://trysyny.com/5-star/about/', photos:[shot(19,'Білий махровий халат Три Сини та Донька','50% 43%')]},
  {id:'yug', name:'YUG Resort & Spa', location:'Одеса', type:'Махрові рушники', source:'https://yugrestaurant.com/en/yug-resort-spa', photos:[shot(10,'Білий махровий рушник YUG Resort & Spa','50% 60%')]},
  {id:'tsarsky', name:'TSARSKY City Resort', location:'Київ', type:'Махрові рушники', source:'https://tsarsky.com/ru', photos:[shot(13,'Готова партія рушників TSARSKY City Resort','50% 55%')]},
  {id:'eurosport', name:'Євроспорт', location:'Львів', type:'Халати та рушники', source:'https://eurosport.lviv.ua/', photos:[shot(6,'Білий махровий халат фітнес-клубу Євроспорт','50% 29%'),shot(8,'Махровий рушник фітнес-клубу Євроспорт','50% 70%')]},
  {id:'berezino', name:'Садиба Березино', location:'Зарванці · Вінницька обл.', type:'Махрові рушники', source:'https://berezino.com.ua/', photos:[shot(11,'Махровий рушник Садиба Березино','50% 40%')]},
  {id:'green-hills', name:'Green Hills Fitness & Spa', location:'Віта-Поштова · Київська обл.', type:'Махрові халати', source:'https://green-hills.fitness/', photos:[shot(22,'Білий махровий халат Green Hills Fitness & Spa','55% 34%')]},
  {id:'formula', name:'Формула Medical Spa', location:'Одеса', type:'Рушники для процедур', source:'https://formula.od.ua/', photos:[shot(12,'Рушник для процедур Формула Medical Spa','50% 59%')]},
  {id:'feel', name:'Feel Clinic', location:'Київ', type:'Текстиль для процедур', source:'https://rieltor.ua/commercials-sale/view/12653933/', photos:[shot(18,'Текстиль для процедурного ліжка Feel Clinic','50% 65%')]},
  {id:'beverly', name:'Beverly Hills Beauty', location:'Мережа салонів · Кіпр, Австрія', type:'Рушники для процедур', source:'https://bhb.com.cy/', photos:[shot(20,'Махровий рушник Beverly Hills Beauty у процедурному кабінеті','50% 58%'),shot(17,'Готові рушники Beverly Hills Beauty','50% 50%')]},
  {id:'bursa', name:'BURSA Hotel', location:'Київ', type:'Постільна білизна', source:'https://bursa.cc/hotel/', photos:[shot(25,'Білизна з монограмою BURSA','45% 50%')]},
  {id:'wol', name:'WOL home + hotel', location:'Мережа апарт-готелів · Україна', type:'Кольорові рушники', source:'https://ribashotelsgroup.ua/wol/', photos:[shot(26,'Кольоровий рушник WOL home + hotel','64% 39%')]}
];

// Retained locally, never rendered as unidentified or misleading public cases.
export const pendingPhotos = [
  {numbers:[3], reason:'Pinecone/wave jacquard logo, lettering resembles EMOTION PALACE. No independently verified matching property/location yet.'}
];
export const duplicatePhotos = [{number:15, duplicateOf:10}];

// Square viewing windows in the unretouched source WebPs, in source-image pixels.
// No generated logo, perspective correction, artificial tilt or fabric replacement.
export const partnerLogoCrops = {
  'seven-lakes':{number:7,width:720,height:1280,left:100,top:590,size:500,light:1.10,contrast:1.16,saturation:1.20},
  radisson:{number:9,width:816,height:1197,left:8,top:0,size:800,light:1.13,contrast:1.13,saturation:1.27},
  premier:{number:23,width:720,height:1280,left:150,top:250,size:480,light:1.035,contrast:1.11,saturation:1.22},
  sunray:{number:2,width:1600,height:900,left:350,top:50,size:800,light:1.06,contrast:1.13,saturation:1.20},
  bristol:{number:21,width:720,height:1280,left:180,top:330,size:390,light:1.10,contrast:1.14,saturation:1.25},
  redling:{number:14,width:720,height:1280,left:20,top:250,size:680,light:1.14,contrast:1.14,saturation:1.29},
  trysyny:{number:19,width:720,height:1280,left:20,top:240,size:600,light:1.075,contrast:1.13,saturation:1.27},
  yug:{number:10,width:720,height:1280,left:120,top:420,size:460,light:1.16,contrast:1.12,saturation:1.26},
  tsarsky:{number:13,width:720,height:1280,left:265,top:610,size:340,light:1.14,contrast:1.13,saturation:1.26},
  eurosport:{number:8,width:1013,height:1800,left:80,top:590,size:720,light:1.075,contrast:1.14,saturation:1.26},
  berezino:{number:11,width:1280,height:720,left:295,top:30,size:660,light:1.14,contrast:1.13,saturation:1.30},
  'green-hills':{number:22,width:1280,height:720,left:540,top:160,size:370,light:1.10,contrast:1.14,saturation:1.25},
  formula:{number:12,width:720,height:1280,left:190,top:580,size:360,light:1.13,contrast:1.15,saturation:1.08},
  feel:{number:18,width:960,height:1280,left:180,top:440,size:670,light:1.065,contrast:1.12,saturation:1.10},
  beverly:{number:20,width:960,height:1280,left:220,top:350,size:620,light:1.08,contrast:1.14,saturation:1.28},
  bursa:{number:25,width:1280,height:960,left:190,top:200,size:680,light:1.045,contrast:1.15,saturation:1.08},
  wol:{number:26,width:1280,height:720,left:540,top:140,size:480,light:1.075,contrast:1.14,saturation:1.26}
};
export const partnerLogoSources=Object.fromEntries(Object.entries(partnerLogoCrops).map(([id,crop])=>[id,crop.number]));
