
import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import { world, system } from "@minecraft/server"
import {
    OnLookAtEntityAfterEvent,
    OnLookAtBlockAfterEvent
} from "./events"
import * as ev from "./events"

export class Control {
    on<T extends Event>(eventTrigger: EventTrigger<T>, callback: (args: EventSignal[T]) => void) {
        let local: "system" | "world";
        let afbe: "afterEvents" | "beforeEvents";
        let mode: string;
        let et: string;
        if (typeof eventTrigger === "string") {
            mode = "subscribe";
            et = eventTrigger;
        } else {
            mode = eventTrigger.mode === "loop" ? "subscribe" : "unsubscribe";
            et = eventTrigger.trigger;
        }
        if (et.startsWith("_")) {
            afbe = "beforeEvents";
        } else {
            afbe = "afterEvents";
        }
        if (customEvents.includes(et)) {
            this.afterEvents[et][mode](event => callback(event));
        } else {
            if (["scriptEventReceive", "_watchdogTerminate"].includes(et)) {
                local = "system";
            } else {
                local = "world";
            }
            mc[local][afbe][et][mode](event => callback(event));
        }
    };

    onu<T extends Event>(eventTrigger: T, callback: (args: EventSignal[T]) => void) {
        this.on({ trigger: eventTrigger, mode: "on_shot" }, event => callback(event))
    };

    log(message: any, target?: mc.EntityQueryOptions, indent = 0) {
        var msg: string
        if (typeof message == "object") {
            msg = JSON.stringify(message, undefined, indent)
        } else {
            msg = `${message}`
        }

        if (target === undefined) {
            world.sendMessage(msg)
        } else {
            world.getPlayers(target)[0].sendMessage(msg)
        }
    };

    afterEvents = {
        onLookAtEntity: new ev.OnLookAtEntityAfterEventSignal(),
        onLookAtBlock: new ev.OnLookAtBlockAfterEventSignal(),
        onSneaking: new ev.OnSneakingAfterEventSignal(),
        touchFloor: new ev.TouchFloorAfterEventSignal(),
        fallInWater: new ev.FallInWaterAfterEventSignal(),
        onJump: new ev.OnJumpAfterEventSignal(),
        onSleep: new ev.OnSleepAfterEventSignal(),
        fillInventory: new ev.FillInventoryAfterEventSignal(),
    };

    getProperty<T = any>(propertyName: string): T {
        let prop: T = world.getDynamicProperty(propertyName) as any;
        if (typeof prop === "object") {
            return prop as T;
        } else {
            return JSON.parse(prop as unknown as string) as T;
        }
    };
    setProperty<T = any>(propertyName: string, _new: T): void {
        world.setDynamicProperty(propertyName, JSON.stringify(_new));
    };
    editProperty<T = any>(propertyName: string, callback: (arg: T) => void): void {
        let data: T = this.getProperty<T>(propertyName);
        callback(data);
        this.setProperty(propertyName, data);
    };

    toRaw(inputString: RawString): mc.RawText {
        const regex = /t\{(\w+(\.\w+)*)\}/g;
        let raw: any = {rawtext: []};
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        
        while ((match = regex.exec(inputString)) !== null) {
            const prefix = inputString.substring(lastIndex, match.index); 
            const variable = match[1]; 
            if (prefix.length > 0) {
                raw.rawtext.push({ text: prefix });
            }
            raw.rawtext.push({ translate: variable });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < inputString.length) {
            const remainingText = inputString.substring(lastIndex);
            raw.rawtext.push({ text: remainingText });
        }
        return raw;
    };
}

export const control = new Control()

type EventTrigger<Event> = Event | {
    trigger: Event,
    mode: "on_shot" | "loop"
}

type Event = WorldAfterEvent | WorldBeforeEvent | SystemAfterEvent | SystemBeforeEvent | CustomAfterEvent

type WorldAfterEvent = "blockExplode" | "buttonPush" | "chatSend" | "dataDrivenEntityTrigger" | "effectAdd" | "entityDie" | "entityHealthChanged" | "entityHitBlock" | "entityHitEntity" | "entityHurt" | "entityLoad" | "entityRemove" | "entitySpawn" | "explosion" | "itemCompleteUse" | "itemDefinitionEvent" | "itemReleaseUse" | "itemStartUse" | "itemStartUseOn" | "itemStopUse" | "itemStopUseOn" | "itemUse" | "itemUseOn" | "leverAction" | "messageReceive" | "pistonActivate" | "playerBreakBlock" | "playerDimensionChange" | "playerInteractWithBlock" | "playerInteractWithEntity" | "playerJoin" | "playerLeave" | "playerPlaceBlock" | "playerSpawn" | "pressurePlatePop" | "pressurePlatePush" | "projectileHitBlock" | "projectileHitEntity" | "targetBlockHit" | "tripWireTrip" | "weatherChange" | "worldInitialize"

type WorldBeforeEvent = "_chatSend" | "_dataDrivenEntityTriggerEvent" | "_effectAdd" | "_entityRemove" | "_explosion" | "_itemDefinitionTriggered" | "_itemUse" | "_itemUseOn" | "_pistonActivateBeforeEvent" | "_playerBreakBlock" | "_playerInteractWithBlock" | "_playerInteractWithEntity" | "_playerLeave" | "_playerPlaceBlock"

type SystemAfterEvent = "scriptEventReceive"

type SystemBeforeEvent = "_watchdogTerminate"

type CustomAfterEvent = "onLookAtEntity" | "onLookAtBlock" | "onSneaking" | "touchFloor" | "fallInWater" | "onJump" | "onSleep" | "fillInventory"

interface EventSignal {
    blockExplode: mc.BlockExplodeAfterEvent;
    buttonPush: mc.ButtonPushAfterEvent;
    chatSend: mc.ChatSendAfterEvent;
    dataDrivenEntityTrigger: mc.DataDrivenEntityTriggerAfterEvent;
    effectAdd: mc.EffectAddAfterEvent;
    entityDie: mc.EntityDieAfterEvent;
    entityHealthChanged: mc.EntityHealthChangedAfterEvent;
    entityHitBlock: mc.EntityHitBlockAfterEvent;
    entityHitEntity: mc.EntityHitEntityAfterEvent;
    entityHurt: mc.EntityHurtAfterEvent;
    entityLoad: mc.EntityLoadAfterEvent;
    entityRemove: mc.EntityRemoveAfterEvent;
    entitySpawn: mc.EntitySpawnAfterEvent;
    explosion: mc.ExplosionAfterEvent;
    itemCompleteUse: mc.ItemCompleteUseAfterEvent;
    itemDefinitionEvent: mc.ItemDefinitionTriggeredAfterEvent;
    itemReleaseUse: mc.ItemReleaseUseAfterEvent;
    itemStartUse: mc.ItemStartUseAfterEvent;
    itemStartUseOn: mc.ItemStartUseOnAfterEvent;
    itemStopUse: mc.ItemStopUseAfterEvent;
    itemStopUseOn: mc.ItemStopUseOnAfterEvent;
    itemUse: mc.ItemUseAfterEvent;
    itemUseOn: mc.ItemUseOnAfterEvent;
    leverAction: mc.LeverActionAfterEvent;
    messageReceive: mc.MessageReceiveAfterEvent;
    pistonActivate: mc.PistonActivateAfterEvent;
    playerBreakBlock: mc.PlayerBreakBlockAfterEvent;
    playerDimensionChange: mc.PlayerDimensionChangeAfterEvent;
    playerInteractWithBlock: mc.PlayerInteractWithBlockAfterEvent;
    playerInteractWithEntity: mc.PlayerInteractWithEntityAfterEvent;
    playerJoin: mc.PlayerJoinAfterEvent;
    playerLeave: mc.PlayerLeaveAfterEvent;
    playerPlaceBlock: mc.PlayerPlaceBlockAfterEvent;
    playerSpawn: mc.PlayerSpawnAfterEvent;
    pressurePlatePop: mc.PressurePlatePopAfterEvent;
    pressurePlatePush: mc.PressurePlatePushAfterEvent;
    projectileHitBlock: mc.ProjectileHitBlockAfterEvent;
    projectileHitEntity: mc.ProjectileHitEntityAfterEvent;
    targetBlockHit: mc.TargetBlockHitAfterEvent;
    tripWireTrip: mc.TripWireTripAfterEvent;
    weatherChange: mc.WeatherChangeAfterEvent;
    worldInitialize: mc.WorldInitializeAfterEvent;

    _chatSend: mc.ChatSendBeforeEvent;
    _dataDrivenEntityTriggerEvent: mc.DataDrivenEntityTriggerBeforeEvent;
    _effectAdd: mc.EffectAddBeforeEvent;
    _entityRemove: mc.EntityRemoveBeforeEvent;
    _explosion: mc.ExplosionBeforeEvent;
    _itemDefinitionTriggered: mc.ItemDefinitionTriggeredBeforeEvent;
    _itemUse: mc.ItemUseBeforeEvent;
    _itemUseOn: mc.ItemUseOnBeforeEvent;
    _pistonActivateBeforeEvent: mc.PistonActivateBeforeEvent;
    _playerBreakBlock: mc.PlayerBreakBlockBeforeEvent;
    _playerInteractWithBlock: mc.PlayerInteractWithBlockBeforeEvent;
    _playerInteractWithEntity: mc.PlayerInteractWithEntityBeforeEvent;
    _playerLeave: mc.PlayerLeaveBeforeEvent;
    _playerPlaceBlock: mc.PlayerPlaceBlockBeforeEvent;

    scriptEventReceive: mc.ScriptEventCommandMessageAfterEvent;
    _watchdogTerminate: mc.WatchdogTerminateBeforeEvent;

    onLookAtEntity: OnLookAtEntityAfterEvent;
    onLookAtBlock: OnLookAtBlockAfterEvent;
    onSneaking: ev.OnSneakingAfterEvent;
    touchFloor: ev.TouchFloorAfterEvent;
    fallInWater: ev.FallInWaterAfterEvent;
    onJump: ev.OnJumpAfterEvent;
    onSleep: ev.OnSleepAfterEvent;
    fillInventory: ev.FillInventoryAfterEvent;
}

const customEvents = [
    "onLookAtEntity",
    "onLookAtBlock",
    "onSneaking",
    "touchFloor",
    "fallInWater",
    "onJump",
    "onSleep",
    "fillInventory",
]

type RawString = string

class Vec3 {
    x: number
    y: number
    z: number
    constructor(vector: mc.Vector3) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
    }
    distance(vec: Vec3 | mc.Vector3) {
        return Math.sqrt(
            Math.pow(this.x - vec.x, 2) +
            Math.pow(this.y - vec.y, 2) +
            Math.pow(this.z - vec.z, 2)
        )
    }
    modify(call: (vec: this) => void) {
        call(this);
    }
    get write() {
        return `${this.x} ${this.y} ${this.z}`
    }
}

// export const vec3 = new Vec3({ x: 0, y: -60, z: 0 })

class ActionFormExtra {
    private data: {
        title: mc.RawText;
        body?: mc.RawText;
        buttons: {
            name: mc.RawText;
            icon?: string;
        }[];
    };
    constructor() {}
    title(titleText: RawString | mc.RawMessage): ActionFormExtra {
        if (typeof titleText === "string") {
            this.data.title = control.toRaw(titleText);
        } else {
            this.data.title = titleText;
        }
        return this;
    };
    body(bodyText: RawString | mc.RawMessage): ActionFormExtra {
        if (typeof bodyText === "string") {
            this.data.body = control.toRaw(bodyText);
        } else {
            this.data.body = bodyText;
        }
        return this;
    };
    button(text: RawString | mc.RawMessage, iconPath?: string | undefined): ActionFormExtra {
        var bt: {
            name: mc.RawText;
            icon?: string | undefined;
        } = {
            name: {}
        };
        if (typeof text === "string") {
            bt["name"] = control.toRaw(text);
        } else {
            bt["name"] = text;
        }
        bt["icon"] = iconPath;
        this.data.buttons.push(bt);
        return this;
    };
    async show(player: mc.Player): Promise<ActionResponseExtra> {
        let pl = new ui.ActionFormData().title(this.data.title)
        if (this.data.body !== undefined) pl.body(this.data.body);
        for (let i of this.data.buttons) {
            pl.button(i.name, i.icon);
        };
        let c = await pl.show(player)
        return new Promise((resolve, reject) => {
            resolve({
                select(_data: { [key: number]: () => void } | (() => void)[]) {
                    if (!c.canceled) {
                        _data[c.selection as number];
                    }
                },
                cancel(_data: () => void) {
                    if (c.canceled) {
                        _data();
                    }
                },
                ...c
            });
        });
    };

    buttons(buttonData: ([RawString | mc.RawMessage, string | undefined] | RawString | mc.RawMessage)[]): ActionFormExtra {
        for (let i of buttonData) {
            this.button(i[0], i[1]);
        };
        return this
    };
}

interface ActionResponseExtra extends ui.ActionFormResponse {
    select: (_data: { [key: number]: () => void } | (() => void)[]) => void
    cancel: (_data: () => void) => void
}

// const player = mc.Player.prototype;

// new ActionFormExtra()
//     .title("Menu")
//     .buttons([
//         "Botão 1",
//         "Botão 2",
//         "Botão 3",
//         "Botão 4"
//     ])
//     .show(player).then(result => {
//         result.select([
//             () => console.log("Clicou o botão 1!"),
//             () => console.log("Clicou o botão 2!"),
//             () => console.log("Clicou o botão 3!"),
//             () => console.log("Clicou o botão 4!"),
//         ])
//     });