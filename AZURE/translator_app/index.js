'use strict';
const fs = require('fs');
const https = require('https');
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const express = require('express');
require("dotenv").config();
const multer = require('multer');
const app = express();
var cors = require('cors');
app.use(cors());

const uploadFile = multer({
    storage : multer.diskStorage({
        destination : function(req,res,callBack){
            callBack(null,"uploads")
        },
        filename : function(req,file,callBack){
            callBack(null,file.originalname);
        }
    })
}).single("input-file-upload")

app.get('/',(req,res)=>{
    res.send('Welcome to Translator Server')
})

app.get('/welcome',(req,res)=>{
  res.send('Welcome to Translator Server')
})

app.post('/upload-file',uploadFile,(req,res,next)=>{

    var languageSelected = req.body.language;
    var fileName = req.body.filename;

    var inputText = [];
    function setInputTextFn(textExtracted){
        inputText = textExtracted;
    }
    
    const key = process.env.KEY_TEXT_EXTRACT;
    const endpoint = process.env.TEXT_EXTRACT_ENDPOINT;
    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
    
    // OCR function call to extract text from document/file
    const result = computerVision(computerVisionClient,fileName,setInputTextFn)
    result.then((doc)=>{
        // translate function call
        const translateResult = translateText(inputText.toString(),languageSelected);
        translateResult.then((outputText)=>{
          res.status(200).json({'fileInputText':inputText, 'fileOutputText':outputText.data[0].translations[0],'detectedInputLang' : outputText.data[0].detectedLanguage});
        }).catch((err)=>res.status(500).json({'message':'translation failed'}));
    }).catch((err)=>
        res.status(500).json({'message' : 'extraction failed !'})
    );
})

const server = app.listen(process.env.PORT || 9999, (err) => {
    if (err) {
      console.log("App Crash ", err);
    } else {
      console.log("Server Started... at ", server.address().port);
    }
});



async function translateText(inputText,languageSelected){
  const axios = require('axios').default;
  const { v4: uuidv4 } = require('uuid');
  let key = process.env.KEY_TEXT_TRANSLATE;
  let endpoint = process.env.TEXT_TRANSLATE_ENDPOINT;
  let location = "eastus";
  
  const promise = axios({
    baseURL: endpoint,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      // location required if you're using a multi-service or regional (not global) resource.
      "Ocp-Apim-Subscription-Region": location,
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
      // from: "en",
      to: [languageSelected],
    },
    data: [
      {
        text: inputText,
      },
    ],
    responseType: "json",
  })
  return promise;
}

async function computerVision(computerVisionClient,inputFileName,setInputTextFn){
    const STATUS_SUCCEEDED = "succeeded";
    const STATUS_FAILED = "failed";
    const printedTextSampleURL = "./uploads/" + inputFileName;

    // Recognize text in printed image from a URL
    console.log(
      "Read printed text from URL...",
      printedTextSampleURL.split("/").pop()
    );
    const printedResult = await readTextFromURL(
      computerVisionClient,
      printedTextSampleURL
    );
    setInputTextFn(printedResult);

    // Perform read and await the result from URL
    async function readTextFromURL(client, url) {
      // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
      // let result = await client.read(url);
      const streamResponse = await computerVisionClient
        .readInStream(() => createReadStream(url))
        .then((response) => {
          return response;
        });

      // Get operation location from response, so you can get the operation ID.
      const operationLocationLocal = streamResponse.operationLocation;
      // Get the operation ID at the end of the URL
      const operationIdLocal = operationLocationLocal.substring(
        operationLocationLocal.lastIndexOf("/") + 1
      );

      let resultantLines = [];
      // Wait for the read operation to finish, use the operationId to get the result.
      while (true) {
        const readOpResult = await computerVisionClient
          .getReadResult(operationIdLocal)
          .then((result) => {
            return result;
          });
        console.log("Read status: " + readOpResult.status);
        if (readOpResult.status === STATUS_FAILED) {
          console.log("The Read File operation has failed.");
          break;
        }
        if (readOpResult.status === STATUS_SUCCEEDED) {
          console.log("The Read File operation was a success.");
          console.log();

          // Print the text captured
          // Looping through: pages of result from readResults[], then Line[]
          for (const textRecResult of readOpResult.analyzeResult.readResults) {
            for (const line of textRecResult.lines) {
              resultantLines.push(line.text);
            }
          }
          break;
        }
        await sleep(1000);
      }

      return resultantLines;
    }
    return printedResult;
}