import styled from "styled-components";

// extension changed to jsx for colored view
// 249ea0,008083,005f60
const defPadding = "0.5rem";
const mainBg = "#d9f1f1";
const secBg = "#a5c9c9";
const black = "#3b3b3b";

export const RTFDoc = styled.section`
    background: linear-gradient(to right, #d9f1f1,#cefae9);
    border: 3px solid #4e4e4e;
    /* background-color: ${mainBg}; */
    color:${black};
    padding: ${defPadding};
    max-width: 900px;
    min-width: 800px;
    border-radius: 6px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    h1 {
        font-size: 3.5rem;
        font-weight: 600;
    }
    h2 {
        font-size: 3.0rem;
        font-weight: 600;
    }
    h3 {
        font-size: 2.5rem;
        font-weight: 700;
    }
    h4 {
        font-size: 2.0rem;
        font-weight: 500;
    }
    h5 {
        font-size: 2.0rem;
        font-weight: 400;
    }
    h6 {
        font-size: 1.5rem;
        font-weight: 300;
    }
    ul {
        margin: 0 0 0 2em ;
        list-style: disc;
    }
    blockquote {
        padding: ${defPadding};
        background-color: ${secBg};
        color: #474747;
    }
    hr {
        padding: ${defPadding};
        border-color: #4e4d4d;
    }
    
`;