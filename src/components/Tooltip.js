import React, { useState } from "react";
import styled from "styled-components";

const StyledTooltip = styled.div`
  position: relative;
  background-image: url("/assets/svg/tooltip.svg");
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
  width: 20px;
  height: 20px;

  span {
    display: none;
    position: absolute;
    background-color: #fff;
    color: #000;
    border-radius: 6px;
    padding: 5px 10px;
    border: 1px solid #000;
    font-size: 0.9rem;
    animation: fadeIn 0.2s;
    z-index: 1;
    width: max-content;
    top: -20%;
    left: 300%;
    transform: translate(-50%, -100%); // To adjust position
  }

  &:hover span {
    display: block;
  }
`;

export default function Tooltip({ message }) {
  return (
    <StyledTooltip>
      <span className="tooltiptext">Tooltip text</span>
    </StyledTooltip>
  );
}
