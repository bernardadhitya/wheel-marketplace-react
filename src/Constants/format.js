export const formattedCurrency = (fee) => {
  const numericToCurrency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return numericToCurrency.format(fee);
}

export const formattedDescription = (description) => {
  return description.length > 100 ? description.slice(0,97) + '...' : description;
}

export const tireWidthConverter = (width) => {
  const convertionDict = {
    5.0:  { minimum: 155, ideal: [165, 175], maximum: 185},
    5.5:  { minimum: 165, ideal: [175, 185], maximum: 195},
    6.0:  { minimum: 175, ideal: [185, 195], maximum: 205},
    6.5:  { minimum: 185, ideal: [195, 205], maximum: 215},
    7.0:  { minimum: 195, ideal: [205, 215], maximum: 225},
    7.5:  { minimum: 205, ideal: [215, 225], maximum: 235},
    8.0:  { minimum: 215, ideal: [225, 235], maximum: 245},
    8.5:  { minimum: 225, ideal: [235, 245], maximum: 255},
    9.0:  { minimum: 235, ideal: [245, 255], maximum: 265},
    9.5:  { minimum: 245, ideal: [255, 265], maximum: 275},
    10.0: { minimum: 255, ideal: [265, 275], maximum: 285},
    10.5: { minimum: 265, ideal: [275, 285], maximum: 295},
    11.0: { minimum: 275, ideal: [285, 295], maximum: 305},
    11.5: { minimum: 285, ideal: [295, 305], maximum: 315},
    12.0: { minimum: 295, ideal: [305, 315], maximum: 325},
    12.5: { minimum: 305, ideal: [315, 325], maximum: 335},
    13.0: { minimum: 315, ideal: [325, 335], maximum: 345},
    13.5: { minimum: 325, ideal: [335, 345], maximum: 355},
    14.0: { minimum: 335, ideal: [345, 355], maximum: 365},
  };

  const formattedWidth = Math.round(width*2)/2;
  const result = convertionDict[formattedWidth];
  return result;
}