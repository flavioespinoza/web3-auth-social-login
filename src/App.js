import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import Web3 from "web3";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import RPC from "./web3RPC";
import "./App.css";
import Logo from "./assets/img/logo-black-blockless.png";

// https://dashboard.web3auth.io/organization/BlocklessDev/projects
// social-auth (project name)
const clientId =
  "BGHfKtvW1yDVPTOYXpIGZyMkHbIs_eLKudRa8kKEyfpJ0Ms38k5ypycT_PnCyH4iK105T4aQ7ddCglOzo-xVh9g";

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [chainId, setChainId] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainId: "0x1", // Please use 0x1 for Mainnet
            rpcTarget: "https://rpc.ankr.com/eth",
            chainNamespace: CHAIN_NAMESPACES.EIP155,
          },
        });

        setWeb3auth(web3auth);
        await web3auth.initModal();

        let connectedStatus = await isConnected();
        if (connectedStatus) {
          setProvider(web3auth.provider);
          getUserInfo();
          getAccounts();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const getProviderInfo = async () => {
      try {
        if (provider) {
          await getBalance();
          await getChainId();
        }
      } catch (error) {
        console.error(error);
      }
    };

    getProviderInfo();
  }, [provider]);

  const isConnected = async () => {
    if (!web3auth) {
      console.log("isConnected: web3auth not initialized yet");
      return false;
    }
    return web3auth.status === "connected";
  };

  const handleLogin = async () => {
    if (!web3auth) {
      console.log("handleLogin: web3auth not initialized yet");
      return;
    }

    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider.provider);

    await getUserInfo();
    await getAccounts();
    await getAccounts();
  };

  const handleLogout = async () => {
    if (!web3auth) {
      console.log("handleLogout: web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.logout();
    setProvider(web3authProvider);
    setBalance("");
    setAddress("");
    setUserData({});
    setChainId("");
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("getUserInfo: web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    setUserData(user);
  };

  const getAccounts = async () => {
    if (!web3auth) {
      console.log("getAccounts: web3auth not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const address = await rpc.getAccounts();
    setAddress(address);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("getChainId: provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const chainId = await rpc.getChainId();
    setChainId(chainId);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("getBalance: provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    setBalance(balance);
  };

  const loggedInView = (
    <button onClick={handleLogout} style={styles.button}>
      LOGOUT
    </button>
  );

  return (
    <div
      className="container"
      style={{
        textAlign: "center",
        color: "white",
        paddingTop: 40,
      }}
    >
      {!address && (
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-8">
            <div style={styles.card}>
              <img alt="Blockless" src={Logo} width="200px" />
              <h6
                style={{
                  paddingTop: 24,
                  marginBottom: 24,
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: 24,
                  textAlign: "center",
                }}
              >
                Web3Auth
              </h6>
              <button
                style={{
                  marginTop: 10,
                  backgroundColor: "#0164FF",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "2px",
                  width: "100%",
                  height: 44,
                  fontWeight: 600,
                  border: "none",
                }}
                mt={2}
                onClick={handleLogin}
              >
                LOGIN WITH SOCIAL
              </button>
            </div>
          </div>
        </div>
      )}
      {address && (
        <div className="row">
          <div className="col-md-8">
            <div style={styles.card}>
              <img alt="Blockless" src={Logo} width="120px" />
              <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 20 }}>
                Successfully Logged In
              </h6>
              <div style={{ marginTop: 40, textAlign: "left", color: "black" }}>
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  User Info:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  <span style={{ fontSize: 12 }}>
                    <strong>{userData && userData.name}</strong> -{" "}
                    {userData && userData.email} - {userData.typeOfLogin}
                  </span>
                </p>
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  Wallet address:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {address}
                </p>
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  Chain ID:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {chainId}
                </p>
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  Balance ETH:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {balance}
                </p>
              </div>
            </div>
            <div className="mt-2">{provider ? loggedInView : null}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

const styles = {
  button: {
    width: "100%",
    maxWidth: 200,
    cursor: "pointer",
    backgroundColor: "#0164FF",
    boxSizing: "border-box",
    borderRadius: "4px",
    fontSize: 16,
    color: "#f9f9f9",
    fontWeight: 700,
    padding: "12px 30px 12px 30px",
    marginTop: 4,
    display: "flex",
    justifyContent: "center",
    border: "none",
  },
  card: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: "100%",
    height: "100%",
    minHeight: 200,
    border: "10px solid #f9f9f9",
    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.03)",
    borderRadius: "4px",
    "&:hover": {
      boxShadow: "0px 24px 33px -9px #0000005C",
    },
  },
};
