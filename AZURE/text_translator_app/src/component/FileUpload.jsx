import { useState } from "react";
import Modal from "./Modal";

export const FileUpload = () =>{
    
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = () => {
     setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };
    
    return (
        <div className="row justify-center ">
            <div className="col">
                <h1>
                    Translate Text <br/> using <br/> Azure Congnitive Service
                </h1>
                <span>
                    Effortlessly translate hand written or printed text with our AI-powered service.
                </span>
                <button onClick={handleOpenModal}>
                    <i className="fa-solid fa-file-arrow-up"></i> &nbsp;&nbsp;
                    upload text file/image
                </button>
                <Modal isOpen={isOpen} closeFn={handleCloseModal}/>
            </div>
        </div>
    )
}