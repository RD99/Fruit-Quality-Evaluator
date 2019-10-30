import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import "./App.css";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import axios from "axios";
import FormData from "form-data";
function App() {
  const [result, setresult] = useState("");
  const uploadfile = e => {
    const image = e.target.files[0];
    const file = new Blob([e.target.files[0]], { type: "image/png" });
    const form = new FormData();
    form.append("file", image, file.filename);

    console.log(image);

    axios
      .post("/predict", form, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        console.log(response.data);
        var labels = { 0: "Orange", 1: "Apple", 2: "Banana", 3: "Mixed" };
        const p = response.data;
        for (var key in p) {
          if (p.hasOwnProperty(key)) {
            if (p[key] === 1) {
              setresult(labels[key]);
            }
          }
        }
        // response.data.forEach(element => {
        //   console.log(element);
        // });
        //var result=labels[]
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("uploadedimage").src = e.target.result;
        };

        reader.readAsDataURL(image);
        //console.log(response);
      });
  };
  return (
    <div className="main">
      {result ? (
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10vh",
            color: "white",
            alignItems: "center"
          }}
        >
          <img id="uploadedimage" src="#" alt="my image"></img>
          <p>{result}</p>
        </div>
      ) : (
        <span></span>
      )}

      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={e => {
          document.querySelector("#fileinput").click();
        }}
      >
        Upload
        <input type="File" id="fileinput" onChange={uploadfile}></input>
      </Button>
    </div>
  );
}

export default App;
