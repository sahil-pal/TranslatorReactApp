import { useNavigate  } from "react-router-dom";

export const Header = () => {

    const navigate = useNavigate();

    const onClickHandle = () => navigate('/');

    return (
        <div className="row space-between">
            <div className="col">
                <h1 onClick={onClickHandle}>Translator App</h1>
            </div>
            <div className="col">
                <img src="https://www.pngitem.com/pimgs/m/531-5318007_microsoft-azure-icon-png-transparent-png.png" alt="azure"></img>
            </div>
        </div>
    );
}