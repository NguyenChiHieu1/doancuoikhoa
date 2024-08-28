const formatMoney = (number) => {
  let money = number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
  return money;
};

export default formatMoney;
