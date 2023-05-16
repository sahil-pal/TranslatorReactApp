import React, { useRef, useState } from 'react';
import { ApiClient } from '../shared/ApiClient';
import { useNavigate  } from "react-router-dom";

const Modal = ({ isOpen, closeFn }) => {
  
  const navigate = useNavigate();

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: isOpen ? 'block' : 'none'
  };

  const fileDescStyle = {
    fontSize : '12px',
    color : 'red',
    paddingTop : '50px'
  }

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    height : '62%',
    width : '40%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    display: isOpen ? 'block' : 'none'
  };

  const options = [
    { value: 'hi', label: 'hindi' },
    { value: 'fr', label: 'french' },
    { value: 'ja', label: 'japanese' },
    { value: 'zu', label: 'zulu'},
    { value: 'en', label: 'english'}
  ]


  const [file, setFile] = useState();
  const [loading,setLoading] = useState(false);
  const [langName,setLangName] = useState('');
  const [isResultAvailable,setIsResultAvailable] = useState(false);
  const [translationResults,setTranslationResults] = useState({});
  
  const languageRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  function onTranslate(){
    setLangName(languageRef.current.value);
    setLoading(true);
    const result = ApiClient.uploadFileToServer(file,languageRef.current.value,file.name);
    result.then((doc)=>{
      setLoading(false);
      setIsResultAvailable(true);
      setTranslationResults(doc.data);
    }).catch((err)=>{
      console.log(err);
      alert(err.response.data.message); 
      onClose();
    })
  }

  function onClose(){
    setFile();
    setLangName();
    setIsResultAvailable(false);
    setLoading(false);
    closeFn();
  }

  function onViewResults(){
    navigate('/result',{state : translationResults});
  }


  return (
    <div>
      <div style={overlayStyle} id="model-overlay" onClick={onClose} />
        <div style={modalStyle} id='model-content' className='row'>
            {
                (loading === false) ?
                  (isResultAvailable === false) 
                  ?
                  <>
                    <div className='col'>
                        <form id="form-file-upload" method='post'>
                            {
                                (file != null)
                                ? (
                                    <>
                                        <h2 className="message-head"> File Uploaded Successfully !</h2>
                                        <p>{file.name}</p>
                                    </>
                                )   
                                : (
                                    <>
                                        <input type="file" id="input-file-upload" onChange={handleFileChange} multiple={true} />
                                        <label id="label-file-upload" htmlFor="input-file-upload">
                                            <div>
                                                <p>Drag and drop your file here or <br/>Upload a file</p>
                                                <p style={fileDescStyle} >supported files : jpg, png, pdf, jpeg</p>
                                            </div> 
                                        </label>
                                    </>
                                )
                            }
                            <div className='row justify-center'>
                                <label id='input-language' htmlFor='input-language'>
                                    <h3> Select Language </h3>
                                </label>
                                <select id='input-language' ref={languageRef}>
                                    {options.map((option,index) => (
                                        <option key={index} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                        <div id="model-op" className='row justify-center'>
                            <button onClick={onTranslate}>Translate</button> &nbsp;&nbsp;
                            <button onClick={onClose}>Close</button>
                        </div>
                    </div>
                </>
                :
                <div id='result-message'>
                  <h2 className='message-head'>File Translated Successfully !</h2>
                  <button onClick={onViewResults}>View Results</button>
                  <div className='row justify-center'>
                    <button onClick={onClose}>Close</button>
                  </div>
                </div>
                :
                <div id='loading-img'>
                    <img src='https://media.tenor.com/JbpMGnCf-noAAAAC/loading-instagram.gif' alt='loading'/>
                    <div>
                        <p> Translating to <span style={{color:'red', display:'inline'}}>{langName}</span></p>
                    </div>
                </div>
            }
        </div>
    </div>
  );
};

export default Modal;
