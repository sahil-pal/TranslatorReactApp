import { useEffect, useState } from 'react';
import { Footer } from '../component/Footer';
import {Header} from '../component/Header';
import { Home } from '../component/Home';
import {Routes,Route } from "react-router-dom";
import { Error } from '../shared/components/Error';
import { Result } from '../component/Result';


export const HomePage = () => {

    const [headerBackgroundColor, setHeaderBackgroundColor] = useState({});
    
    function scrollEventStyle() {
        if (window.scrollY > 40) {
          setHeaderBackgroundColor({
            backgroundColor: 'rgba(0,0,0, 0.7)',
            color : 'white'
        })
        } 
        else{
          setHeaderBackgroundColor({
            
          })
        }
    }
    
    useEffect(()=>{
        window.addEventListener('scroll',scrollEventStyle)
    })
    
    return (
        <>
            <header style={headerBackgroundColor}> 
                <Header/>
            </header>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/result" element={<Result/>}/>
                <Route path="*" element={<Error/>}/>
            </Routes>
            <footer>
                <Footer/>
            </footer>
        </>
    );
}