import { useState } from "react";
import { canisterId, createActor } from "../../declarations/token_backend/index"; // Adjust the import path as necessary
import { AuthClient } from "@dfinity/auth-client";
function Faucet(props) {
    const [isDisabled, setIsDisabled] = useState(false);
    const [buttonText, setText] = useState("Gimme gimme");

    async function handleClick() {
        setIsDisabled(true);

        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();

        const authenticatedCanister = createActor(canisterId, {
            agentOptions: {
                identity,
            }
        });



        const result = await authenticatedCanister.payOut();
        if (result === "Success") {
            setText("Success");
        } else if (result === "Already claimed") {
            setText("Already claimed");
        }
        setIsDisabled(result !== "Success");
    }

    return (
        <div className="blue window">
            <h2>
                <span role="img" aria-label="tap emoji">
                    🚰
                </span>
                Faucet
            </h2>
            <label>Get your free DAkingbera tokens here! Claim 10,000 DANG coins to your {props.userPrincipal}.</label>
            <p className="trade-buttons">
                <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
                    {buttonText}
                </button>
            </p>
        </div>
    );
}

export default Faucet;