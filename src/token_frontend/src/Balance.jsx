import { useState } from "react";
import { Principal } from "@dfinity/principal";
import { token_backend } from "../../declarations/token_backend";
import Transfer from "./Transfer"; // Import the Transfer component

function Balance() {
    const [inputValue, setInput] = useState("");
    const [balanceResult, setBalance] = useState("");
    const [symbol, setSymbol] = useState("");
    const [isHidden, setIsHidden] = useState(true);

    async function handleClick() {
        const principal = Principal.fromText(inputValue);
        const balance = await token_backend.balanceOf(principal);
        const symbol = await token_backend.showSymbol();
        setBalance(balance.toString());
        setSymbol(symbol);
        setIsHidden(false);
    }

    return (
        <div className="window white">
            <label>Check account token balance:</label>
            <p>
                <input
                    id="balance-principal-id"
                    type="text"
                    placeholder="Enter a Principal ID"
                    value={inputValue}
                    onChange={(e) => setInput(e.target.value)}
                />
            </p>
            <p className="trade-buttons">
                <button id="btn-request-balance" onClick={handleClick}>
                    Check Balance
                </button>
            </p>
            <p style={{ display: isHidden ? "none" : "block" }}>
                This account has a balance of {balanceResult} {symbol}
            </p>
            <Transfer senderId={inputValue} /> {/* Pass the principal ID to the Transfer component */}
        </div>
    );
}

export default Balance;