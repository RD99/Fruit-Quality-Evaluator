const express = require("express");

const fileupload = require("express-fileupload");
const app = express();
const fs = require("fs");

const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
const handler = tfn.io.fileSystem("model/model.json");

var getPixels = require("get-pixels");
var path = require("path");
const port = process.env.PORT || 5000;
app.use(fileupload());
app.post("/predict", (req, res) => {
  const file = req.files.file;

  const a = new Uint8Array(file.data);
  //console.log(tf.tensor(a));

  //const model = tf.loadLayersModel("Model_with_15_Epochs.h5");
  const stream = fs.createWriteStream("image.jpg");
  stream.write(file.data);
  stream.close();
  //console.log("model loader");

  //const buffer = tf.buffer([1, 400, 400, 3], "int32", a);
  //console.log(buffer);
  stream.on("finish", function() {
    getPixels("image.jpg", function(err, pixels) {
      if (err) {
        console.log("Bad image path");
        return;
      }
      //console.log("got pixels", pixels);
      const unit = new Uint8Array(pixels.data);
      console.log(pixels.data.length);
      let img = new Array(1);
      img[0] = new Array(300);
      for (let x = 0; x < 300; x++) {
        img[0][x] = new Array(300);
        for (let y = 0; y < 300; y++) {
          img[0][x][y] = new Array(3);
          img[0][x][y][0] = unit[x * 300 + y * 4 + 0];
          img[0][x][y][1] = unit[x * 300 + y * 4 + 1];
          img[0][x][y][2] = unit[x * 300 + y * 4 + 2];
        }
      }
      const unittensor = tf.tensor(unit);
      //const buffer = tf.buffer([1, 300, 300, 3], "int32", img);
      console.log(tf.tensor(img));
      tf.loadLayersModel(handler).then(model => {
        //const bowData = bow(file, true);
        //var data = tf.tensor2d(bowData, [1, bowData.length]);
        const prediction = model.predict(tf.tensor(img));

        //console.log(model);s
        console.log("prediction" + prediction);
        console.log(prediction.dataSync());

        res.send(prediction.dataSync());
      });
    });
  });

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

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("front-end/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname, "fruit-quality-evaluator", "build", "index.html")
//     );
//   });
// }
app.listen(port, () => console.log(`Listening on port ${port}`));
