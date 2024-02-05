import * as mc from "@minecraft/server"
import { world, system } from "@minecraft/server"

export type OnLookAtEntityAfterEvent = {
    source: mc.Player;
    distance: number;
    target: mc.Entity;
}

export class OnLookAtEntityAfterEventSignal {
    constructor() { }

    subscribe(callback: (args: OnLookAtEntityAfterEvent) => void) {
        mc.system.runInterval(() => {
            for (let i of mc.world.getAllPlayers()) {
                let x = i.getEntitiesFromViewDirection({ maxDistance: 64 })
                if (x.length !== 0) {
                    callback({
                        source: i,
                        target: x[0].entity,
                        distance: x[0].distance
                    })
                }
            }
        }, 1)
    }

    unsubscribe(callback: (args: OnLookAtEntityAfterEvent) => void) {
        let z = mc.system.runInterval(() => {
            for (let i of mc.world.getAllPlayers()) {
                let x = i.getEntitiesFromViewDirection({ maxDistance: 64 })
                if (x.length !== 0) {
                    callback({
                        source: i,
                        target: x[0].entity,
                        distance: x[0].distance
                    })
                    mc.system.clearRun(z)
                }
            }
        }, 1)
    }
}


export type OnLookAtBlockAfterEvent = {
    source: mc.Player;
    block?: mc.Block;
    face?: mc.Direction;
    faceLocation?: mc.Vector3;
}

export class OnLookAtBlockAfterEventSignal {
    constructor() { }

    subscribe(callback: (args: OnLookAtBlockAfterEvent) => void) {
        system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                let x = i.getBlockFromViewDirection({ maxDistance: 64, includeLiquidBlocks: true, includePassableBlocks: true })
                if (x !== undefined) {
                    callback({
                        source: i,
                        block: x.block,
                        face: x.face,
                        faceLocation: x.faceLocation
                    })
                }
            }
        }, 1)
    }

    unsubscribe(callback: (args: OnLookAtBlockAfterEvent) => void) {
        let z = system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                let x = i.getBlockFromViewDirection({ maxDistance: 64, includeLiquidBlocks: true, includePassableBlocks: true })
                callback({
                    source: i,
                    block: x?.block,
                    face: x?.face,
                    faceLocation: x?.faceLocation
                })
                system.clearRun(z)
            }
        }, 1)
    }
}


export type OnSneakingAfterEvent = {
    source: mc.Player;
}

export class OnSneakingAfterEventSignal {
    constructor() { }

    subscribe(callback: (args: OnSneakingAfterEvent) => void) {
        let y = []
        system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isSneaking) {
                    if (!(y.includes(i.name))) {
                        y.push(i.name)
                        callback({ source: i })
                    }
                } else {
                    y.splice(y.indexOf(i.name), 1)
                }
            }
        }, 1)
    }

    unsubscribe(callback: (args: OnSneakingAfterEvent) => void) {
        let y = []
        let n = system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isSneaking) {
                    if (!(y.includes(i.name))) {
                        y.push(i.name)
                        callback({ source: i })
                        system.clearRun(n)
                    }
                } else {
                    y.splice(y.indexOf(i.name), 1)
                }
            }
        }, 1)
    }
}


export type TouchFloorAfterEvent = {
    source: mc.Player;
}

export class TouchFloorAfterEventSignal {
    constructor() { }

    subscribe(callback: (args: TouchFloorAfterEvent) => void) {
        let __touchFloor = []
        system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isOnGround) {
                    if (!(__touchFloor.includes(i.name))) {
                        __touchFloor.push(i.name)
                        callback({ source: i })
                    }
                } else {
                    __touchFloor.splice(__touchFloor.indexOf(i.name), 1)
                }
            }
        }, 1)
    }

    unsubscribe(callback: (args: TouchFloorAfterEvent) => void) {
        let __touchFloor = []
        let n = system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isOnGround) {
                    if (!(__touchFloor.includes(i.name))) {
                        __touchFloor.push(i.name)
                        callback({ source: i })
                        system.clearRun(n)
                    }
                } else {
                    __touchFloor.splice(__touchFloor.indexOf(i.name), 1)
                }
            }
        }, 1)
    }
}


export type FallInWaterAfterEvent = {
    source: mc.Player;
}

export class FallInWaterAfterEventSignal {
    constructor() { }

    subscribe(callback: (args: FallInWaterAfterEvent) => void) {
        let __entryInWater = []
        system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isInWater) {
                    if (!(__entryInWater.includes(i.name))) {
                        __entryInWater.push(i.name)
                        callback({ source: i })
                    }
                } else {
                    __entryInWater.splice(__entryInWater.indexOf(i.name), 1)
                }
            }
        }, 1)
    }

    unsubscribe(callback: (args: FallInWaterAfterEvent) => void) {
        let __entryInWater = []
        let n = system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isInWater) {
                    if (!(__entryInWater.includes(i.name))) {
                        __entryInWater.push(i.name)
                        callback({ source: i })
                        system.clearRun(n)
                    }
                } else {
                    __entryInWater.splice(__entryInWater.indexOf(i.name), 1)
                }
            }
        }, 1)
    }
}


export type OnJumpAfterEvent = {
    source: mc.Player;
}

export class OnJumpAfterEventSignal {
    constructor() { }

    subscribe(callback: (args: OnJumpAfterEvent) => void) {
        let __isJumping = []
        system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isJumping) {
                    if (!(__isJumping.includes(i.name))) {
                        __isJumping.push(i.name)
                        callback({ source: i })
                    }
                } else {
                    __isJumping.splice(__isJumping.indexOf(i.name), 1)
                }
            }
        }, 1)
    }

    unsubscribe(callback: (args: OnJumpAfterEvent) => void) {
        let __isJumping = []
        let n = system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isJumping) {
                    if (!(__isJumping.includes(i.name))) {
                        __isJumping.push(i.name)
                        callback({ source: i })
                        system.clearRun(n)
                    }
                } else {
                    __isJumping.splice(__isJumping.indexOf(i.name), 1)
                }
            }
        }, 1)
    }
}


export type OnSleepAfterEvent = {
    source: mc.Player;
}

export class OnSleepAfterEventSignal {
    constructor() { }

    subscribe(callback: (args: OnSleepAfterEvent) => void) {
        let __isSleep = []
        system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isSleeping) {
                    if (!(__isSleep.includes(i.name))) {
                        __isSleep.push(i.name)
                        callback({ source: i })
                    }
                } else {
                    __isSleep.splice(__isSleep.indexOf(i.name), 1)
                }
            }
        }, 1)
    }

    unsubscribe(callback: (args: OnSleepAfterEvent) => void) {
        let __isSleep = []
        let n = system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                if (i.isSleeping) {
                    if (!(__isSleep.includes(i.name))) {
                        __isSleep.push(i.name)
                        callback({ source: i })
                        system.clearRun(n)
                    }
                } else {
                    __isSleep.splice(__isSleep.indexOf(i.name), 1)
                }
            }
        }, 1)
    }
}


export type FillInventoryAfterEvent = {
    source: mc.Player;
    container: mc.Container;
}

export class FillInventoryAfterEventSignal {
    constructor() { }

    subscribe(callback: (args: FillInventoryAfterEvent) => void) {
        let __fullInventory = []
        system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                let u = i.getComponent("minecraft:inventory").container
                if (u.emptySlotsCount === 0) {
                    if (!(__fullInventory.includes(i.name))) {
                        __fullInventory.push(i.name)
                        callback({ source: i, container: u })
                    }
                } else {
                    __fullInventory.splice(__fullInventory.indexOf(i.name), 1)
                }
            }
        }, 1)
    }

    unsubscribe(callback: (args: FillInventoryAfterEvent) => void) {
        let __fullInventory = []
        let n = system.runInterval(() => {
            for (let i of world.getAllPlayers()) {
                let u = i.getComponent("minecraft:inventory").container
                if (u.emptySlotsCount === 0) {
                    if (!(__fullInventory.includes(i.name))) {
                        __fullInventory.push(i.name)
                        callback({ source: i, container: u })
                        system.clearRun(n)
                    }
                } else {
                    __fullInventory.splice(__fullInventory.indexOf(i.name), 1)
                }
            }
        }, 1)
    }
}


















