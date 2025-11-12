import DareflowEscrow from 0xF8d6e0586b0a20c7

transaction(actionId: UInt64) {

    prepare(signer: auth(BorrowValue) &Account) {
        DareflowEscrow.completeAction(
            id: actionId,
            caller: signer.address
        )
    }

    execute {
        log("✅ action marked completed")
    }
}