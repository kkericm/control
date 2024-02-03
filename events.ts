import * as mc from "@minecraft/server"
import { world, system} from "@minecraft/server"

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
