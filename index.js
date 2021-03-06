const express = require("express");

const fileupload = require("express-fileupload");
const app = express();
const fs = require("fs");

const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
const handler = tfn.io.fileSystem("model/model.json");

var getPixels = require("get-pixels");
var path = require("path");
var Jimp = require("jimp");
const port = process.env.PORT || 5000;
app.use(fileupload());
app.post("/predict", (req, res) => {
  const file = req.files.file;

  Jimp.read(file.data, (err, image) => {
    if (err) throw err;

    image.resize(300, 300).write("image2.jpg");
    let img2 = new Array(1);

    img2[0] = new Array(300);
    for (let x = 0; x < 300; x++) {
      img2[0][x] = new Array(300);
      for (let y = 0; y < 300; y++) {
        let pixelcolor = image.getPixelColor(x, y);
        let rgbavalue = Jimp.intToRGBA(pixelcolor);
        img2[0][x][y] = new Array(3);
        img2[0][x][y][0] = rgbavalue["r"];
        img2[0][x][y][1] = rgbavalue["g"];
        img2[0][x][y][2] = rgbavalue["b"];
      }
    }

    tf.loadLayersModel(handler).then(model => {
      const prediction = model.predict(tf.tensor(img2));
      // console.log("prediction" + prediction);
      // console.log(prediction.dataSync());
      res.send(prediction.dataSync());
    });
  });
  // const stream = fs.createWriteStream("image.jpg");
  // stream.write(file.data);
  // stream.close();

  // stream.on("finish", function() {
  //   getPixels("image.jpg", function(err, pixels) {
  //     if (err) {
  //       console.log("Bad image path");
  //       return;
  //     }
  //     //console.log("got pixels", pixels.data);

  //     const unit = new Uint8Array(pixels.data);

  //     //console.log(pixels.data.length);
  //     let img = new Array(1);
  //     img[0] = new Array(300);
  //     for (let x = 0; x < 300; x++) {
  //       img[0][x] = new Array(300);
  //       for (let y = 0; y < 300; y++) {
  //         img[0][x][y] = new Array(3);
  //         img[0][x][y][0] = unit[x * 300 + y * 4 + 0];
  //         img[0][x][y][1] = unit[x * 300 + y * 4 + 1];
  //         img[0][x][y][2] = unit[x * 300 + y * 4 + 2];
  //       }
  //     }

  //       tf.loadLayersModel(handler).then(model => {
  //         const prediction = model.predict(tf.tensor(img));
  //         // console.log("prediction" + prediction);
  //         // console.log(prediction.dataSync());
  //         res.send(prediction.dataSync());
  //       });

  //   });
  // });

  // console.log(
  //   file.data
  //     .toString("hex")
  //     .match(/../g)
  //     .join(" ").length
  // );
  //const image = createImageBitmap(file.data);

  //let baseDir = path.join(__dirname, "images/image.jpg");

  //  console.log(file.data.length);

  //const prediction = model.predictions(file.data);
  //console.log(prediction);

  //var buf = new Buffer(file, "base64");
  //fs.writeFile("images/image.png", file.data);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("fruit-quality-evaluator/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "fruit-quality-evaluator", "build", "index.html")
    );
  });
}
app.listen(port, () => console.log(`Listening on port ${port}`));
