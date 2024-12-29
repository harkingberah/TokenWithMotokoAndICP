import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

// import Debug "mo:base/Debug";

actor Token {
  let owner : Principal = Principal.fromText("4muul-vhryk-bicc4-6jbzg-xioox-imtf7-qeda7-ab2nj-plkns-szrif-uae");
  let totalSupply : Nat = 1000000000;
  let symbol : Text = "DAKG";
  private stable var balanceEntries : [(Principal, Nat)] = [];

  private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  if (balances.size() < 1) {
    balances.put(owner, totalSupply);
  };

  // balances.put(owner, totalSupply);

  public query func balanceOf(who : Principal) : async Nat {
    switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };
  };

  public query func showSymbol() : async Text {
    return symbol;
  };

  public shared (msg) func payOut() : async Text {
    let caller = msg.caller;
    switch (balances.get(caller)) {
      case null {
        let amount = 10000;
        let result = await transfer(owner, msg.caller, amount);
        return result;
      };
      case (?_) {
        return "Already claimed";
      };
    };
  };

  public shared (_msg) func transfer(from : Principal, to : Principal, amount : Nat) : async Text {
    if (balances.get(from) == null) {
      return "Not enough balance";
    } else {
      let fromBalance = await balanceOf(from);
      if (fromBalance < amount) {
        return "Not enough balance";
      } else {
        let newFromBalance : Nat = fromBalance - amount;
        balances.put(from, newFromBalance);
        let toBalance = await balanceOf(to);
        let newToBalance : Nat = toBalance + amount;
        balances.put(to, newToBalance);
        return "Success";
      };
    };
  };
  system func preupgrade() {
    // to transfer our balance to balance entries
    balanceEntries := Iter.toArray(balances.entries());

  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
    if (balances.size() < 1) {
      balances.put(owner, totalSupply);
    };
  };
};
