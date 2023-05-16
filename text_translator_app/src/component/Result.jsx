import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Result = () => {

    const {state} = useLocation();
    const [inputText,setInputText] = useState('');
    const [outputText,setOutputText] = useState('');

    useEffect(() =>{
        let tempInput = '';
        for(let line of state.fileInputText){
            tempInput = tempInput + "\n" + line;
        }
        let tempOutput = '';
        let output = state.fileOutputText.text.split(', ');
        for(let line of output){
            tempOutput = tempOutput + "\n" + line;
        }
        setInputText(tempInput);
        setOutputText(tempOutput);
    },[]);

    function onDownloadHandle(){
        const element = document.createElement("a");
        const file = new Blob([outputText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "output.txt";
        element.click();
    }

    
    return ( 
        <div id="result" className="container">
            <div className="row justify-center ">
                <div className="col">
                    <h1>
                        View Results
                    </h1>
                    <div className="row justify-center">
                        <button onClick={onDownloadHandle}> Download Output <i className="fa-solid fa-download"></i> </button>
                    </div>
                </div>
            </div>
            <div className="row justify-between">
                <div className="result-box">
                    <h2>Input Text ({ state.detectedInputLang.language } - { (state.detectedInputLang.score/1)*100 }% )</h2>
                    <textarea disabled  value={inputText}>
                    {
                        inputText
                    }
                    </textarea>
                </div>
                <div className="result-box">
                    <h2>Output Translated ( {state.fileOutputText.to} ) </h2>
                    <textarea disabled  value={outputText}>
                    {
                        outputText
                    }
                    </textarea>
                </div>
            </div>
        </div>
    );
}