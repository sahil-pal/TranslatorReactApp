import {FileUpload} from '../component/FileUpload';
import {Steps} from '../component/Steps';

export const Home = () => {
  return (
    <div className="container">
      <div id="file-upload">
        <FileUpload />
      </div>
      <div id="steps">
        <Steps />
      </div>
    </div>
  );
};
