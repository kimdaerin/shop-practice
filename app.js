const express = require("express"); //express라는 상수에 express 모듈의 정보를 가져와서 대입하겠다
const connect = require("./schemas");
const app = express();
const port = 3000;

connect();

const goodsRouter = require("./routes/goods");


const requestMiddleware = (req, res , next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
};

app.use(express.json());
app.use(requestMiddleware);

app.use("/api", [goodsRouter]);

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
});