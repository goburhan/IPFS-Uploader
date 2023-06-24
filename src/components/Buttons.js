import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  font-size: 1rem;
  margin: 1em;
  padding: 1rem;
  border-radius: var(--border-radius);
  border: none;
  font-weight: 700;

  ${(props) =>
    props.disabled === true
      ? `
        background-color: ${props.theme.disabledcolor};
        color: ${props.theme.disabledtext};
        `
      : `
        background-color: ${props.theme.pink};
        color: ${props.theme.primaryText};
        `}
`;

const Button = ({ onClick, children, disabled, text }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {/* {children} */}
      {text}
    </StyledButton>
  );
};

export default Button;
