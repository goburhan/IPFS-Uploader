import Theme from "@/context/Themeprovider";
import GlobalStyles from "@/styles/Globalstyles";
import "@/styles/globals.css";
import { Space_Grotesk } from "next/font/google";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import { MoralisProvider } from "react-moralis";
import Moralis from "moralis";
import "../moralis"
const chains = [arbitrum, mainnet, polygon];
// const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectId = "af3409bccb5f380fa3fbd63c7bdc0832";
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const grotesk = Space_Grotesk({
  subsets: ["latin-ext"],
  weights: [300, 400, 500, 600, 700],
});



export default function App({ Component, pageProps }) {
  return (
    <main className={grotesk.className}>
      <WagmiConfig config={wagmiConfig}>
        <Theme>
          <Navbar>
            <Layout>
              <Component {...pageProps} />
              <GlobalStyles />
            </Layout>
          </Navbar>
        </Theme>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </main>
  );
}
