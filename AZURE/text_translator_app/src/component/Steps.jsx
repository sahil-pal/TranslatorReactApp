export const Steps = () => {
    
    return (
        <>
            <div className="step-box">
                <h2>1. Upload a file</h2>
                <p className="desc-text">
                    The first step to upload the text file to our website. You can simply browse your computer to select file/image you want to translate.
                </p>
                <img src="https://subai.pro/media.svg" alt="upload-file" />
            </div>
            <div className="step-box">
                <h2>2. Select Lang. and Translate</h2>
                <p className="desc-text">
                    Our website will automatically translate the text from your file or image using Azure Congnitive services to the specified language.
                </p>
                <img src="https://subai.pro/transcribe.svg" alt="upload-file" />
            </div>
            <div className="step-box">
                <h2>3. View/Download Results </h2>
                <p className="desc-text">
                Once the translation transcription is complete, you can download the result file or view the results online.
                </p>
                <img src="https://subai.pro/download.svg" alt="upload-file" />
            </div>
        </> 
    );
}