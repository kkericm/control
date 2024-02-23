
import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import { world, system } from "@minecraft/server"
import {
    OnLookAtEntityAfterEvent,
    OnLookAtBlockAfterEvent
} from "./events"
import * as ev from "./events"

class Control {
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
        let raw: any = { rawtext: [] };
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

    range(min: number, max?: number, step: number = 1): number[] {
        if (max === undefined) max = min; min = 0;
        if (step > 0) {
            let length = Math.abs((max - min) / step);
            var index = Array.from({ length }, (_, index) => index);
            return index.map(index => min + index * step);
        } else {
            step = Math.abs(step)
            let length = Math.abs((max - min) / step);
            var index = Array.from({ length }, (_, index) => index);
            return index.map(index => min + (index + 1) * step).reverse();
        }
    };
    defaultOptions<T>(deflt: T) {
        const getDefaultOptions = (): T => (deflt);
        const at = (options: T): T => ({
            ...getDefaultOptions(),
            ...options
        });
        return { at }
    };

    randInt(min: number, max: number) {
        return Math.floor(Math.random() * ((max + 1) - min)) + min;
    };
    randPound(...data: [any, number][]) {
        let final = [];
        data.forEach(i => {
            let arr = new Array(i[1]).fill(i[0]);
            final = final.concat(...arr);
        })
        return this.randTo(...final);
    };
    randTo(...data: any[]) {
        return data[this.randInt(0, data.length - 1)];
    };
}

export const control = new Control()

type EventTrigger<Event> = Event | {
    trigger: Event,
    mode: "on_shot" | "loop"
}

type Event = WorldAfterEvent | WorldBeforeEvent | SystemAfterEvent | SystemBeforeEvent | CustomAfterEvent

type WorldAfterEvent = "blockExplode" | "buttonPush" | "chatSend" | "dataDrivenEntityTrigger" | "effectAdd" | "entityDie" | "entityHealthChanged" | "entityHitBlock" | "entityHitEntity" | "entityHurt" | "entityLoad" | "entityRemove" | "entitySpawn" | "explosion" | "itemCompleteUse" | "itemDefinitionEvent" | "itemReleaseUse" | "itemStartUse" | "itemStartUseOn" | "itemStopUse" | "itemStopUseOn" | "itemUse" | "itemUseOn" | "leverAction" | "messageReceive" | "pistonActivate" | "playerBreakBlock" | "playerDimensionChange" | "playerInteractWithBlock" | "playerInteractWithEntity" | "playerJoin" | "playerLeave" | "playerPlaceBlock" | "playerSpawn" | "pressurePlatePop" | "pressurePlatePush" | "projectileHitBlock" | "projectileHitEntity" | "targetBlockHit" | "tripWireTrip" | "weatherChange" | "worldInitialize"

type WorldBeforeEvent = "_chatSend" | "_dataDrivenEntityTriggerEvent" | "_effectAdd" | "_entityRemove" | "_explosion" | "_itemDefinitionTriggered" | "_itemUse" | "_itemUseOn" | "_pistonActivate" | "_playerBreakBlock" | "_playerInteractWithBlock" | "_playerInteractWithEntity" | "_playerLeave" | "_playerPlaceBlock"

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
    _pistonActivate: mc.PistonActivateBeforeEvent;
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

export class Vec3 {
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

export class ActionFormExtra {
    private data: { title: mc.RawText; body?: mc.RawText; buttons: { name: mc.RawText; icon?: string; }[] } = {
        title: {},
        buttons: []
    };
    constructor() { }
    title(titleText: RawString | mc.RawMessage): ActionFormExtra {
        if (typeof titleText === "string") {
            this.data.title = control.toRaw(titleText);
        } else {
            this.data.title = titleText;
        }
        return this;
    };
    body(bodyText: RawString | mc.RawMessage | ModifyBody): ActionFormExtra {
        if (bodyText instanceof ModifyBody) {
            this.data.body = bodyText.resolved
        } else if (typeof bodyText === "string") {
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
        let pl = new ui.ActionFormData().title(this.data.title);
        if (this.data.body !== undefined) pl.body(this.data.body);
        for (let i of this.data.buttons) {
            pl.button(i.name, i.icon);
        };
        let c = await pl.show(player)
        return new Promise((resolve, reject) => {
            resolve({
                select(_data: { [key: number]: () => void } | (() => void)[]) {
                    if (!c.canceled) {
                        _data[c.selection as number]();
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
    buttons(...buttonsData: ([RawString, string | undefined] | [RawString])[]): ActionFormExtra {
        for (let i of buttonsData) {
            this.button(i[0], i[1]);
        };
        return this
    };
}

interface ActionResponseExtra extends ui.ActionFormResponse {
    select: (_data: { [key: number]: () => void } | (() => void)[]) => void
    cancel: (_data: () => void) => void
}

export class ModifyBody {
    private body: mc.RawText = { rawtext: [] }
    constructor() { };

    label(text: RawString, config: ModifyBodyLabelConfig = {}) {
        var _config = control.defaultOptions<ModifyBodyLabelConfig>({ modify: "normal", indent: 0 }).at(config);
        let color = {
            body: "§l",
            italic: "§o",
            normal: "§r"
        };
        this.body.rawtext = this.body.rawtext?.concat(...control.toRaw(`${" ".repeat(_config.indent as number)}${color[_config.modify as string]}${text}§r`).rawtext as mc.RawMessage[]);
        return this;
    };
    progressBar(max: number, now: number, options?: (option?: ProgressBarOptions, now?: number, max?: number) => void): this
    progressBar(max: number, now: number, options?: ProgressBarOptions): this
    progressBar(...args: any[]) {
        const max = args[0]
        const now = args[1]
        var option: ProgressBarOptions = {
            modifyLoad: "§e",
            modifyVoid: "§8",
            length: 38
        }
        try {
            args[2](option, now, max)
        } catch {
            option = control.defaultOptions<ProgressBarOptions>(option).at(args[2])
        }
        let val = option.length as number;
        var char = "▌";
        var final: string;
        if (max < now) {
            final = ` ${option.modifyLoad}${char.repeat(val)}§r\n`;
        } else {
            var a = Math.floor(now * val / max);
            if (a == 0) {
                final = ` §r${option.modifyVoid}${char.repeat(val)}§r\n`;
            } else {
                var y = val - a;
                final = ` ${option.modifyLoad}${char.repeat(a)}§r${option.modifyVoid}${char.repeat(y)}§r\n`;
            }
        }
        this.body.rawtext?.push({ text: final });
        return this;
    };
    multLabel(data: ([RawString, ModifyBodyLabelConfig] | [RawString])[]) {
        data.forEach(value => {
            this.label(value[0], value[1]);
        });
        return this;
    };
    list(data: RawString[], mark: string = "") {
        let u: string[] = []
        data.forEach((i, e) => {
            if (mark !== undefined) {
                let k = this.convert(mark)
                if (k.type === "number") {
                    u.push(this.subts(k.infer.replace("[type]", `${e + 1}`), i));
                } else if (k.type === "lower") {
                    u.push(this.subts(k.infer.replace("[type]", `${this.ntos(e + 1, "lower")}`), i));
                } else if (k.type === "upper") {
                    u.push(this.subts(k.infer.replace("[type]", `${this.ntos(e + 1, "upper")}`), i));
                } else {
                    u.push(this.subts(k.infer, i));
                }
            } else {
                u.push(i);
            }
        })
        this.body.rawtext = this.body.rawtext?.concat(control.toRaw(u.join("")).rawtext as mc.RawMessage[]);
        return this;
    };
    get space() {
        this.label("\n");
        return this;
    }
    private ntos(num: number, mode: "upper" | "lower") {
        let lett = ''
        const letters = {
            upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lower: "abcdefghijklmnopqrstuvwxyz"
        }

        while (num > 0) {
            let remainder = (num - 1) % 26;
            lett = letters[mode][remainder] + lett;
            num = Math.floor((num - 1) / 26);
        }

        return lett;
    };
    private convert(inputString: string) {
        const regex = /\[(\w+(\.\w+)*)\]/g;
        let raw = { type: "void", infer: "" };
        let lastIndex = 0;
        let matches: any = [];
        let match;
        while ((match = regex.exec(inputString)) !== null) {
            matches.push({
                type: match[1],
                index: match.index
            });
        }
        for (let i = 0; i < matches.length; i++) {
            const currentMatch = matches[i];
            const prefix = inputString.substring(lastIndex, currentMatch.index);
            if (prefix.length > 0) {
                raw.infer += prefix;
            }
            raw.infer += "[type]";
            lastIndex = currentMatch.index + currentMatch.type.length + 2;
            raw.type = currentMatch.type;
        }
        if (lastIndex < inputString.length) {
            const remainingText = inputString.substring(lastIndex);
            raw.infer += remainingText;
        }
        return raw;
    };
    private subts(text: string, daal: string) {
        text += " "
        var lek = text.split("##");
        lek.forEach((i, e) => {
            lek[e] = i.replace(/#(?=[^#])/g, daal);
        });
        return lek.join("#").slice(0, -1);
    };
    get resolved() {
        control.log(this.body, undefined, 4);
        return this.body;
    };
}
interface ModifyBodyLabelConfig {
    modify?: "body" | "italic" | "normal";
    indent?: number;
}
interface ProgressBarOptions {
    modifyLoad?: string;
    modifyVoid?: string;
    length?: number;
}