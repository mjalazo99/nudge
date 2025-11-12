import DareflowEscrow from 0xF8d6e0586b0a20c7

// fund an existing action
// amount must be UFix64 with 8 decimals
transaction(actionId: UInt64, amount: UFix64) {

    prepare(signer: auth(BorrowValue) &Account) {
        DareflowEscrow.fundAction(
            id: actionId,
            from: signer.address,
            amount: amount
        )
    }

    execute {
        log("✅ funded action")
    }
}