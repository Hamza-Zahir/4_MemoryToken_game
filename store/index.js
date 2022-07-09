import Web3 from "web3";
import AbiCcontract from "../json/abiContract.json";
const state = {
  CurrentAccount: "",
  ChainId: "",
  TokenUrlsOfUser: [],
  TotalBalans: 0,
};

const getters = {
  CurrentAccount: (state) => state.CurrentAccount,
  ChainId: (state) => state.ChainId,
  TokenUrlsOfUser: (state) => state.TokenUrlsOfUser,
  TotalBalans: (state) => state.TotalBalans
  ,
};
const actions = {
  async connectMetamask({ commit }) {
    const ethereum = window.ethereum;
    if (!ethereum) {
      window.open("https://metamask.io", "blank");
    } else {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      commit("setCurrentAccount", accounts[0]);

      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(4).toString(16)}` }],
        });
        await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
          commit("setChainId", Number(resalt));
        });
      } catch (switchError) {
        console.log(switchError);
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${Number(4).toString(16)}`,
                  chainName: "Rinkeby",
                  nativeCurrency: {
                    name: "Rinkeby Ether",
                    symbol: "RIN",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rinkeby.infura.io/v3/"],
                  blockExplorerUrls: ["https://rinkeby.etherscan.io"],
                },
              ],
            });

            await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
              commit("setChainId", Number(resalt));
            });
            ethereum.on("chainChanged", handleChainChanged);
            function handleChainChanged(_chainId) {
              window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  },
  async checkWalletIsConnected({ commit }) {
    const ethereum = window.ethereum;
    let web3 = new Web3(Web3.givenProvider || ethereum);
    let accounts = await web3.eth.getAccounts();
    if (accounts.length) {
      commit("setCurrentAccount", accounts[0]);
      await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
        commit("setChainId", Number(resalt));
      });
      ethereum.on("chainChanged", handleChainChanged);
      function handleChainChanged(_chainId) {
        window.location.reload();
      }
    }
  },
  // ......................................

  async getTokenURIOfUser({ commit }) {
    let tokenurls = []
    const _CurrentAccount = this.state.CurrentAccount;
    const ethereum = window.ethereum;
    if(ethereum && _CurrentAccount){
    const web3 = new Web3(Web3.givenProvider || ethereum);
    const MemoryToken_contract = new web3.eth.Contract(
      AbiCcontract,
      "0x5D514a6578A9e99cc212534bf134c76851608086"
    );


  const _balanceOfOner =  await MemoryToken_contract.methods.balanceOf(_CurrentAccount).call()
    for (let i = 0; i < _balanceOfOner; i++) {
    const id = await MemoryToken_contract.methods.tokenOfOwnerByIndex(_CurrentAccount, i).call()
    const tokenURI = await MemoryToken_contract.methods.tokenURI(id).call()
    tokenurls.push(tokenURI)

    }

      commit("setTokenUrlsOfUser", tokenurls)
}
  },
  async setTokenToBlockchain(state, _tokenUrl) {
    const _CurrentAccount = this.state.CurrentAccount;
    const _ChainId = this.state.ChainId;
    const ethereum = window.ethereum;

    if (!_CurrentAccount) {
      window.alert("pleas Connect To Metamask To get your Token");
    } else if (_CurrentAccount && _ChainId != 4) {
      window.alert("pleas change network");
    } else {
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);
      const MemoryToken_contract = new web3.eth.Contract(
        AbiCcontract,
        "0x5D514a6578A9e99cc212534bf134c76851608086"
      );
      await MemoryToken_contract.methods.mint(_CurrentAccount, _tokenUrl).send({
        from: _CurrentAccount,
        gasLimit: 300000,
      });
    }
  },
};
const mutations = {
  setCurrentAccount: (state, addres) => (state.CurrentAccount = addres),
  setChainId: (state, chainId) => (state.ChainId = chainId),
  setTokenUrlsOfUser: (state, array) => (state.TokenUrlsOfUser = array),
  setTotalBalans: (state, num) => (state.TotalBalans = num),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
