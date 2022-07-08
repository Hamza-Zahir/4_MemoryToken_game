import Web3 from "web3";
import AbiCcontract from "../json/abiContract.json";
const state = {
  CurrentAccount: "",
  ChainId: "",
  AllCandidates: [],
  TotalElected: 0,
};

const getters = {
  CurrentAccount: (state) => state.CurrentAccount,
  ChainId: (state) => state.ChainId,
  AllCandidates: (state) => state.AllCandidates,
  TotalElected: (state) => state.TotalElected,
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

  // async getCandidates({ commit }) {
  //   let allCandidates = [];
  //   let TotalElected = 0;
  //   const ethereum = window.ethereum;

  //   if (ethereum) {
  //     const web3 = new Web3(Web3.givenProvider || ethereum);
  //     const Election_contract = new web3.eth.Contract(
  //       AbiCcontract,
  //       "0xCFe110057f2A5AcFBC8a891295e5584d9ee4d126"
  //     );
  //     const _candidatesCount = await Election_contract.methods
  //       .candidatesCount()
  //       .call();

  //     for (let i = 1; i <= Number(_candidatesCount); i++) {
  //       const _Candidate = await Election_contract.methods.candidates(i).call();
  //       const _CandidateId = Number(_Candidate[0]);
  //       const _CandidateName = _Candidate[1];
  //       const _CandidateVoteCount = Number(_Candidate[2]);
  //       TotalElected += Number(_Candidate[2]);
  //       allCandidates.push({
  //         CandidateId: _CandidateId,
  //         CandidateName: _CandidateName,
  //         CandidateVoteCount: _CandidateVoteCount,
  //       });
  //     }
  //     commit("setAllCandidates", allCandidates);
  //     commit("setTotalElected", TotalElected);
  //   }
  // },
  // async Vote(state, CandidateId) {
  //   const _CurrentAccount = this.state.CurrentAccount;
  //   if (!_CurrentAccount) {
  //     window.alert("Please connect to Metamask.");
  //   } else if (!CandidateId) {
  //     window.alert("Please Select Candidate.");
  //   } else if (this.state.ChainId == 4) {
  //     const ethereum = window.ethereum;
  //     const web3 = new Web3(Web3.givenProvider || ethereum);
  //     const Election_contract = new web3.eth.Contract(
  //       AbiCcontract,
  //       "0xCFe110057f2A5AcFBC8a891295e5584d9ee4d126"
  //     );
  //     const boll = await Election_contract.methods
  //       .voters(_CurrentAccount)
  //       .call();
  //     if (boll) {
  //       window.alert("Unfortunately, you can not vote more than once.");
  //     } else {
  //       await Election_contract.methods.vote(CandidateId).send({
  //         from: _CurrentAccount,
  //         gasLimit: 300000,
  //       });
  //     }
  //   }
  // },
};
const mutations = {
  setCurrentAccount: (state, addres) => (state.CurrentAccount = addres),
  setChainId: (state, chainId) => (state.ChainId = chainId),
  setAllCandidates: (state, array) => (state.AllCandidates = array),
  setTotalElected: (state, num) => (state.TotalElected = num),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
