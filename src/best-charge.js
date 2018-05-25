function bestCharge(selectedItems) {
  const allItems = loadAllItems();
  const promotions = loadPromotions();

  const listLineStyle = "-----------------------------------";
  const listOfTotal = "总计：";
  const listOfDiscounts = "使用优惠:";

  //初始化
  let value_a = 0;
  let value_b = 0;

  //计算满30减6的情况
  let list_a = selectedItems.reduce((allList, value) => {
    let itemAndNumber = value.split(" x ");
    let item_id = itemAndNumber[0];
    let item_number = itemAndNumber[1] * 1;

    allItems.forEach(currentItem => {
      if (item_id == currentItem.id) {
        allList.push(currentItem.name + " x " + item_number + " = " + item_number * currentItem.price + "元");
        value_a += item_number * currentItem.price;
      }
    });
    return allList;
  }, []);
  if (value_a >= 30) {
    list_a.push(listLineStyle);
    list_a.push(listOfDiscounts);
    list_a.push(promotions[0].type + "，省" + (value_a / 30).toFixed() * 6 + "元");
    value_a -= (value_a / 30).toFixed() * 6;
  }
  list_a.push(listLineStyle);
  list_a.push(listOfTotal + value_a + "元");

  //计算部分菜品打半价的情况
  let discount_name = [];
  let discount_price = 0;

  let list_b = selectedItems.reduce((allList, value) => {
    let itemAndNumber = value.split(" x ");
    let item_id = itemAndNumber[0];
    let item_number = itemAndNumber[1] * 1;

    let currentName;
    let currentPrice;

    allItems.forEach(currentItem => {
      if (item_id == currentItem.id) {
        allList.push(currentItem.name + " x " + item_number + " = " + item_number * currentItem.price + "元");
        value_b += item_number * currentItem.price;
        currentName = currentItem.name;
        currentPrice = currentItem.price;
      }
    });

    //判断是否半价销售
    if (promotions[1].items.includes(item_id)) {
      value_b -= currentPrice * item_number / 2;
      discount_name.push(currentName);
      discount_price += currentPrice * item_number / 2;
    }
    return allList;
  }, []);

  list_b.push(listLineStyle);
  list_b.push(listOfDiscounts);
  list_b.push(promotions[1].type + "(" + discount_name.join("，") + ")，省" + discount_price + "元");
  list_b.push(listLineStyle);
  list_b.push(listOfTotal + value_b + "元");

  //判断哪种方式
  let resultList;
  if (value_b < value_a) {
    resultList = list_b;
  } else {
    resultList = list_a;
  }

  //添加表头，表尾
  resultList.unshift("============= 订餐明细 =============");
  resultList.push("===================================");

  return resultList.join("\n");
}
