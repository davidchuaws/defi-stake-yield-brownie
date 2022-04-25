import React from 'react';
import { DAppProvider, Kovan, Rinkeby, Config } from '@usedapp/core';
import {Header} from "./components/Header";
import {Container} from "@material-ui/core"
import {Main} from "./components/Main"
import { getDefaultProvider } from 'ethers'

const config: Config = {
  readOnlyChainId: Kovan.chainId,
  readOnlyUrls: {
    [Kovan.chainId]: getDefaultProvider('kovan'),
    [Rinkeby.chainId]: getDefaultProvider('rinkeby'),
  },
}

/* {{
      networks: [Kovan, Rinkeby],
      notifications: {
        expirationPeriod: 2000,
        checkInterval: 1000
      }
    }}*/

function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <Container maxWidth="md">
      <Main />
      </Container>
    </DAppProvider>
  )
}

export default App;
