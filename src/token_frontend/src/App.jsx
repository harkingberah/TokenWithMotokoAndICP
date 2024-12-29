import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";

function App(props) {
  return (
    <div id="screen">
      <Header />
      <Faucet userPrincipal={props.loggedInPrincipal} />
      <Balance />
    </div>
  );
}

export default App;