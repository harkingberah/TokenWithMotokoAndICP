import { Principal } from "@dfinity/principal";
import { useState } from "react";
import { canisterId, createActor } from "../../declarations/token_backend/index";
import { AuthClient } from "@dfinity/auth-client";

function Transfer({ senderId }) {
    const [recipientId, setId] = useState("");
    const [amount, setAmount] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Transfer");
    const [message, setMessage] = useState("");

    async function handleClick() {
        setIsDisabled(true);
        setButtonText("Processing...");
        const sender = Principal.fromText(senderId);
        let recipient;
        let amountToTransfer;
        try {
            recipient = Principal.fromText(recipientId);
            amountToTransfer = Number(amount);
            if (isNaN(amountToTransfer) || amountToTransfer <= 0) {
                throw new Error("Invalid amount");
            }
        } catch (error) {
            setButtonText("Transfer");
            setMessage("Invalid recipient ID or amount.");
            setIsDisabled(false);
            return;
        }
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        const authenticatedCanister = createActor(canisterId, {
            agentOptions: {
                identity,
            }
        });



        const result = await authenticatedCanister.transfer(sender, recipient, amountToTransfer);
        console.log(result); // Log the result for debugging
        if (result === "Success") {
            setButtonText("Success");
            setMessage("Transfer successful!");
        } else if (result === "Not enough balance") {
            setButtonText("Transfer");
            setMessage("Insufficient funds.");
        } else {
            setButtonText("Transfer");
            setMessage("Transfer failed.");
        }
        setIsDisabled(false);
    }

    return (
        <div className="window white">
            <div className="transfer">
                <fieldset>
                    <legend>To Account:</legend>
                    <ul>
                        <li>
                            <input
                                type="text"
                                id="transfer-to-id"
                                value={recipientId}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </li>
                    </ul>
                </fieldset>
                <fieldset>
                    <legend>Amount:</legend>
                    <ul>
                        <li>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </li>
                    </ul>
                </fieldset>
                <p className="trade-buttons">
                    <button id="btn-transfer" onClick={handleClick} disabled={isDisabled}>
                        {buttonText}
                    </button>
                </p>
                <p>{message}</p> {/* Display the message */}
            </div>
        </div>
    );
}

export default Transfer;