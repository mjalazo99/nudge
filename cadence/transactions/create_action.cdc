import DareflowEscrow from 0xF8d6e0586b0a20c7

transaction(description: String, target: UFix64, duration: UFix64) {

    prepare(signer: auth(BorrowValue) &Account) {
        DareflowEscrow.createAction(
            description: description,
            target: target,
            duration: duration
        )
    }

    execute {
        log("✅ Action created successfully!")
    }
}