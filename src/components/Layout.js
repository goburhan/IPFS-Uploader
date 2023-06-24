import React from "react";
import styled from "styled-components";

const StyledLayout = styled.div`
  margin-top: 64px;
  padding: 1rem;
`;
export default function Layout({ children }) {
  return <StyledLayout>{children}</StyledLayout>;
}
