import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import RPC from "./web3RPC";
import "./App.css";
import Logo from "./assets/img/logo-black-blockless.png";

let styles = {
  button: {
    width: "100%",
    maxWidth: 200,
    cursor: "pointer",
    background: "#0164FF",
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
    marginBottom: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: 400,
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

const clientId =
  "BGHfKtvW1yDVPTOYXpIGZyMkHbIs_eLKudRa8kKEyfpJ0Ms38k5ypycT_PnCyH4iK105T4aQ7ddCglOzo-xVh9g"; // get from https://dashboard.web3auth.io

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
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5afe", // Sapphire mainnet
            rpcTarget: "https://sapphire.oasis.io",
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

  const isConnected = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return false;
    }
    return web3auth.status === "connected";
  };

  const handleLogin = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider.provider);

    // Get initial data
    await getUserInfo();
    await getAccounts();
    // await getBalance();
    // await getChainId();
  };
  const handleLogout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
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
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    setUserData(user);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
    setChainId(chainId);
  };
  const getAccounts = async () => {
    if (!web3auth) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const address = await rpc.getAccounts();
    setAddress(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    setBalance(balance);
    console.log(balance);
  };

  const loggedInView = (
    <>
      <button onClick={getChainId} className="card" style={styles.button}>
        Get Chain ID
      </button>
      <button onClick={getBalance} className="card" style={styles.button}>
        Get Balance
      </button>
      <button onClick={handleLogout} className="card" style={styles.button}>
        Logout
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={handleLogin} className="card" style={styles.button}>
      Login
    </button>
  );

  return (
    <div
      className="container"
      style={{
        textAlign: "center",
        color: "white",
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "2%",
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
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: 24,
                  textAlign: "center",
                }}
              >
                Login to Web3Auth
              </h6>
              <button
                style={{
                  marginTop: 10,
                  backgroundColor: "#8347E5",
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
                Login with social
              </button>
            </div>
          </div>
        </div>
      )}
      {address && (
        <div className="row">
          <div className="col-md-4">
            <div className="grid">
              {provider ? loggedInView : unloggedInView}
            </div>
          </div>
          <div className="col-md-8">
            <div style={styles.card}>
              <img alt="Blockless" src={Logo} width="120px" />
              <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 20 }}>
                Successfully Logged In
              </h6>
              <div style={{ marginTop: 20, textAlign: "left", color: "black" }}>
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  User Info:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  <span style={{ fontSize: 12 }}>
                    <strong>{userData && userData.name}</strong> -{" "}
                    {userData && userData.email}
                  </span>
                </p>{" "}
                <br />
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  User wallet address:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {address}
                </p>
                <br />
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  ChainId:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {chainId}
                </p>
                <br />
                <h6 style={{ color: "#000000", fontWeight: 700, fontSize: 16 }}>
                  Balance:
                </h6>
                <p style={{ color: "#000000", fontWeight: 400, fontSize: 12 }}>
                  {balance}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
