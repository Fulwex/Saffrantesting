// Visible copy stays geographic; only Premier needs a name beyond its monogram.
export const displayLocations={
  premier:'Вся Україна',
  radisson:'Буковель',
  sunray:'Підгородне · Дніпр. обл.',
  trysyny:'Східниця · Львів. обл.',
  berezino:'Зарванці · Він. обл.',
  'green-hills':'Віта-Поштова · Київ. обл.',
  beverly:'Лімасол · Відень',
  wol:'Україна',
};
export const premierDisplayName='Premier Hotels';

// Each caption sits in a genuinely quiet area of its own photograph.
export const captionLayout={
  'seven-lakes':{corner:'br',tone:'light'},
  radisson:{corner:'bl'},
  premier:{corner:'tl'},
  sunray:{corner:'br'},
  bristol:{corner:'tr'},
  redling:{corner:'br'},
  trysyny:{corner:'tl'},
  yug:{corner:'tr'},
  tsarsky:{corner:'tl'},
  eurosport:{corner:'bl'},
  berezino:{corner:'tr'},
  'green-hills':{corner:'bl'},
  formula:{corner:'tl'},
  feel:{corner:'tl'},
  beverly:{corner:'bl'},
  bursa:{corner:'br'},
  wol:{corner:'bl',tone:'light'},
};

// Spread darker cloth and brighter white captions through both opposing strips.
export const partnerRowIds=[
  ['bristol','radisson','seven-lakes','trysyny','redling','premier','sunray','bursa'],
  ['wol','tsarsky','beverly','eurosport','yug','green-hills','formula','berezino','feel'],
];
