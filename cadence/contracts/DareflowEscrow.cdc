access(all) contract DareflowEscrow {

    // minimum duration in seconds
    access(all) let MIN_DURATION: UFix64

    // auto-incrementing id
    access(self) var nextID: UInt64

    // dictionary of actions (resource dictionary)
    access(self) var actions: @{UInt64: Action}

    // view type for frontend
    access(all) struct ActionView {
        access(all) let id: UInt64
        access(all) let creator: Address
        access(all) let description: String
        access(all) let target: UFix64
        access(all) let raised: UFix64
        access(all) let expiresAt: UFix64
        access(all) let isCompleted: Bool
        access(all) let isRefunded: Bool

        init(
            id: UInt64,
            creator: Address,
            description: String,
            target: UFix64,
            raised: UFix64,
            expiresAt: UFix64,
            isCompleted: Bool,
            isRefunded: Bool
        ) {
            self.id = id
            self.creator = creator
            self.description = description
            self.target = target
            self.raised = raised
            self.expiresAt = expiresAt
            self.isCompleted = isCompleted
            self.isRefunded = isRefunded
        }
    }

    // main resource
    access(all) resource Action {
        access(all) let id: UInt64
        access(all) let creator: Address
        access(all) let description: String
        access(all) let target: UFix64
        access(all) var raised: UFix64
        access(all) let expiresAt: UFix64

        // these are internal so we can mutate them in methods
        access(self) var isCompleted: Bool
        access(self) var isRefunded: Bool

        access(all) var contributions: {Address: UFix64}

        // ---- mutators ----

        access(all) fun addContribution(addr: Address, amount: UFix64) {
            let prev = self.contributions[addr] ?? 0.0
            self.contributions[addr] = prev + amount
            self.raised = self.raised + amount
        }

        access(all) fun markCompleted() {
            self.isCompleted = true
        }

        access(all) fun markRefunded() {
            self.isRefunded = true
        }

        access(all) fun asView(): DareflowEscrow.ActionView {
            return DareflowEscrow.ActionView(
                id: self.id,
                creator: self.creator,
                description: self.description,
                target: self.target,
                raised: self.raised,
                expiresAt: self.expiresAt,
                isCompleted: self.isCompleted,
                isRefunded: self.isRefunded
            )
        }

        init(
            id: UInt64,
            creator: Address,
            description: String,
            target: UFix64,
            expiresAt: UFix64
        ) {
            self.id = id
            self.creator = creator
            self.description = description
            self.target = target
            self.raised = 0.0
            self.expiresAt = expiresAt
            self.isCompleted = false
            self.isRefunded = false
            self.contributions = {}
        }
    }

    // ---- public funcs on contract ----

    access(all) fun createAction(
        description: String,
        target: UFix64,
        duration: UFix64
    ): UInt64 {
        pre {
            duration >= self.MIN_DURATION: "duration too short"
        }

        let id = self.nextID
        self.nextID = self.nextID + 1

        let now = getCurrentBlock().timestamp
        let expiresAt = now + duration

        let action <- create Action(
            id: id,
            creator: self.account.address,
            description: description,
            target: target,
            expiresAt: expiresAt
        )

        self.actions[id] <-! action

        return id
    }

    access(all) fun fundAction(id: UInt64, from: Address, amount: UFix64) {
        let action <- self.actions.remove(key: id) ?? panic("no action with that id")
        action.addContribution(addr: from, amount: amount)
        self.actions[id] <-! action
    }

    access(all) fun completeAction(id: UInt64, caller: Address) {
        let action <- self.actions.remove(key: id) ?? panic("no action with that id")
        if caller != action.creator {
            panic("only creator can complete")
        }
        action.markCompleted()
        self.actions[id] <-! action
    }

    access(all) fun refundAction(id: UInt64) {
        let action <- self.actions.remove(key: id) ?? panic("no action with that id")
        let now = getCurrentBlock().timestamp
        if now <= action.expiresAt {
            panic("cannot refund before expiry")
        }
        action.markRefunded()
        self.actions[id] <-! action
    }

    access(all) fun getActions(): [DareflowEscrow.ActionView] {
    var out: [DareflowEscrow.ActionView] = []

    // we have to remove → read → put back because this is a resource dictionary
    for key in self.actions.keys {
        let action <- self.actions.remove(key: key) ?? panic("action missing")
        out.append(action.asView())
        self.actions[key] <-! action
    }

    return out
}

    init() {
        self.MIN_DURATION = 60.0
        self.nextID = 1
        self.actions <- {}
    }
}