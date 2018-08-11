
const palette = [
'#a8edea',
'#fed6e3',
'#f5f7fa',
'#c3cfe2',
'#e0c3fc',
'#f093fb',
'#f5576c',
'#fdfbfb',
'#ebedee',
'#d299c2',
'#fef9d7',
'#ebc0fd',
'#d9ded8',
'#f6d365',
'#fda085',
'#96fbc4',
'#f9f586'
];

const directions = [
'to top',
'135deg',
'120deg'
];

export const generateColors = (number = 2) => {
  let shadow = [...palette];
  const results = [];
  while (results.length < number && shadow.length) {
    const index = parseInt(Math.random() * shadow.length, 10);
    results.push(shadow[index]);
    shadow = shadow.filter((o, i) => i !== index);
  }

  return results;
};

export const generateGradientDirection = () => {
  return directions[parseInt(Math.random() * directions.length, 10)];
};
