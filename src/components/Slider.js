import React from "react";
import Slider from "@mui/material/Slider";
import styled from "styled-components";

const StyledSlider = styled(Slider)`
  color: ${({ theme }) => theme.secondary};

  .MuiSlider-thumb {
    color: ${({ theme }) => theme.primary};
    border: 3px solid ${({ theme }) => theme.gray};
    &:hover {
      box-shadow: 0 0 0 6px rgba(102, 96, 119, 0.3);
    }
    &:focus {
        box-shadow: 0 0 0 6px rgba(102, 96, 119, 0.3);
    }
  }
`;

export default function Slide() {
  return (
    <StyledSlider
      size="large"
      defaultValue={70}
      aria-label="Small"
      valueLabelDisplay="auto"
    />
  );
}
