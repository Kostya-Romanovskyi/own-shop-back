const countTotalPriceWithTax = (totalPrice) => {
  const gstTax = 0.05;

  const finalPrice = totalPrice * (1 + gstTax);

  return finalPrice;
};

module.exports = countTotalPriceWithTax;
