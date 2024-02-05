
import * as mc from "@minecraft/server"
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
        if (["scriptEventReceive", "_watchdogTerminate"].includes(et)) {
            local = "system";
        } else {
            local = "world";
        }
        mc[local][afbe][et][mode](event => callback(event));
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
    };

    getProperty<T = any>(propertyName: string): T {
        let prop: T = world.getDynamicProperty(propertyName) as any;
        if (typeof prop === "object") {
            return prop as T;
        } else {
            return JSON.parse(prop as string) as T;
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

type CustomAfterEvent = "onLookAtEntity" | "onLookAtBlock"

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
}
