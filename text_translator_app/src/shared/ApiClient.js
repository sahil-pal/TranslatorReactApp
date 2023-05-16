import axios from 'axios';

export const ApiClient = {

    uploadFileToServer(dataFile,lang,filename){
        const BASE_URL = process.env.REACT_APP_BASE_URL;
        const URL = BASE_URL+"upload-file"
        console.log(URL);
        const promise = axios.post(URL,
            {
                'input-file-upload':dataFile,
                'language' : lang,
                'filename' : filename
            },{
            credentials: "same-origin", //include, same-origin
            headers: { 
                'Content-Type': 'multipart/form-data',
                'x-apikey': '59a7ad19f5a9fa0808f11931',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
        })

        return promise;
        
    },

  
}