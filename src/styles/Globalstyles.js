import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    line-height: 1.2;
    font-family: 'Space Grotesk', sans-serif;
  }

 :root {
    --border-radius: 16px;
    
  }
  
html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}
 
  body {
     background: ${({ theme }) => theme.background};
  }


  label {
    margin-bottom:6px;
  }

    select{
      width: 100%;
      border: none;
      background: #1F1C26;
      color: ${({ theme }) => theme.primaryText};
      font-size: 1rem;
      padding: 1rem;
      border-radius: var(--border-radius);
    }

a{
  text-decoration: none;
  color: inherit;
}

h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }

ul, li {
  margin: 0;
  padding: 0;
  list-style: none;
}

button {
  cursor: pointer;
  transition: 0.3s;
  &:focus {
    outline: none;
  }
  &:hover {
    opacity: 0.8;
  }
}

:root {
  font-size: 16px;
}



/*  this section removes increment button from numeric input fields*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}


input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
}

  @media (max-width: 1024px) {
    :root {
        font-size: 14px;
        }
    }
    @media (max-width: 768px) {
      :root {
            font-size: 12px;
        }
    }

`;

export default GlobalStyles;
