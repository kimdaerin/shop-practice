const express = require("express"); //express라는 상수에 express 모듈의 정보를 가져와서 대입하겠다
const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("this is root page");
});

router.get("/goods/cart", async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart)=> cart.goodsId);

  const goods = await Goods.find({ goodsId: goodsIds});

  console.log(goods);

  res.json({
      cart: carts.map((cart)=> {
          return {
              quantity: cart.quantity,
              goods: goods.find((item) => item.goodsId === cart.goodsId), 
          };
      })
  })
});

router.get("/goods", async (req, res) => {
  const { category } = req.query;
  const goods = await Goods.find({ category });

    res.json({
        goods,
    });
});

router.get("/goods/:goodsId", async (req, res) => {
    const {goodsId}= req.params;

    const [goods] = await Goods.find({ goodsId: Number(goodsId) });


    res.json({
        goods,
    });
});



router.delete("/goods/:goodsId/cart", async (req,res) => {
  const {goodsId} = req.params;

  const existsCarts = await Cart.find({ goodsId : Number(goodsId)});

  if(existsCarts.length){
    await Cart.deleteOne({ goodsId: Number(goodsId)});
  }

  res.json({ success: true});
});

router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (!existsCarts.length) {
    await Cart.create({ goodsId: Number(goodsId), quantity });
  } else {
    await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
  }

  res.json({ success: true });
});

router.post("/goods", async (req, res) => {
    const { goodsId, name, thumbnailUrl, category, price }= req.body;
    const goods = await Goods.find({ goodsId });
    if(goods.length) {
      return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다."});
    }

    const createdGoods = await Goods.create({ 
      goodsId, 
      name, 
      thumbnailUrl, 
      category, 
      price 
    });

    res.json({ goods: createdGoods });
});

module.exports = router; //모듈로서 내보내겠다






