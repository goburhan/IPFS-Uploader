import Alerts from "@/components/Alerts";
import Button from "@/components/Buttons";
import Dropdown from "@/components/Dropdown";
import Navbar from "@/components/Navbar";
import Slide from "@/components/Slider";
import GlobalStyles from "@/styles/Globalstyles";
import styled from "styled-components";
import { Web3Button } from "@web3modal/react";
import Card from "@/components/Swapcard/Card";
const StyledMain = styled.div``;

export default function Home() {
  return (
    <StyledMain>
      <Card />
    </StyledMain>
  );
}
