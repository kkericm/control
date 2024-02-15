# Control
Módulos com recursos extras para a API do Minecraft Bedrock

## Documentação

### Classes
| Nome     | Descrição                          |
| -------- | ---------------------------------- |
| Control  | Classe com alguns recursos extras. |

### Classe Control
| Nome         | Descrição                                                        |
| ------------ | ---------------------------------------------------------------- |
| on           | Detecta eventos.                                                 |
| log          | Escreve qualquer coisa no chat(strings, números, objetos e etc). |
| getProperty  | Pega uma propriedade do mundo.                                   |
| setProperty  | Define uma propriedade do mundo.                                 |
| editProperty | Edita uma propriedade do mundo.                                  |
| toRaw        | Converte uma `RawString` para `RawText`.                         |

## Exemplos

Importação:
```ts
import { control } from "./control";
```

### `on`

ex: Usando o metodo *on* de *control* para detectar se um player usou uma espada de diamante, e matá-lo por isso.
```ts
control.on("itemUse", event => {
    if (event.itemStack.typeId === "minecraft:diamond_sword") {
        event.source.kill();
    }
});
```

ex: Usando o metodo *on* de *control*, com o *eventTrigger* *_chatSend* (*eventTriggers* com underline("_") são equivalentes aos *beforeEvents*.), para que sempre que uma mensagem seja enviada no chat por um player, essa mensagem seja reproduzida(usando o *log*) com "[Member]" antes do nome do player.
```ts
control.on("_chatSend", event => {
    event.cancel = true;
    control.log(`[Member] <${event.sender}> ${event.message}`);
});
```

### `Property's`

ex: Nesse exemplo se usa *getProperty*, *setProperty* e *editProperty* para criar uma propriedade usando um array tipo pré-definido, após "pega" os dados da propriedade, e logo após, soma 10 ao scores do player 0.
```ts
// Definição da interface.
interface PlayerData {
    name: string;
    scores: number;
    role: "adm" | "mod" | "member"
};
// Define uma propriedade no mundo chamado "Players" com um array de `PlayerData`.
control.setProperty<PlayerData[]>("Players", [
    {
        name: "oERicM",
        scores: 0,
        role: "member"
    }
// Soma 10 ao score do player 0.
control.editProperty<PlayerData[]>("Players", data => data[0].scores += 10);
]);
// Retorna um array de `PlayerData`.
control.getProperty<PlayerData[]>("Players");  // Literalmente `[{ name: "oERicM", scores: 10, role: "member" }]`
```
### `toRaw`
ex: Esse código converte uma *string* em uma *mc.RawText*.
```ts
const input = `t{common.wellcome}, ${player.name}!`;
const output = control.toRaw(input);
// output: {
//     rawtext: [
//         { translate: "common.wellcome" },
//         { text: "oERicM" }
//     ]
// }
```


## Eventos Extras

| Nome           | Descrição                                                                      |
| -------------- | ------------------------------------------------------------------------------ |
| onLookAtEntity | Despara quando um player olhar para uma entidade(até 64 blocos de distancia).  |
| onLookAtBlock  | Despara quando um player olhar para um bloco(até 64 blocos de distancia).      |
| onSneaking     | Despara quando um player agacha.                                               |
| touchFloor     | Despara quando um player toca uma superfice.                                   |
| fallInWater    | Despara quando um player entra dentro d'água.                                  |
| onJump         | Despara quando um player pula.                                                 |
| onSleep        | Despara quando um player dorme.                                                |
| fillInventory  | Despara quando um player enche todos os slots do inventário.                   |

ex: Sempre que um player olha para uma entidade, na sua *actionBar* surge uma mensagem com o tipo dessa entidade. Por exemplo: "Tipo: Porco", quando se olha para um porco.
```ts
control.on("onLookAtEntity", event => {
    const entityId = event.target.typeId.replace("minecraft:", '')
    event.source.onScreenDisplay.setActionBar({
        rawtext: [
            { translate: `storageManager.groupType` },
            { text: ": " },
            { translate: `entity.${entityId}.name` }
        ]
    })
})
```
ou...
```ts
control.afterEvents.onLookAtEntity.subscribe(event => {
    const entityId = event.target.typeId.replace("minecraft:", '')
    event.source.onScreenDisplay.setActionBar({
        rawtext: [
            { translate: `storageManager.groupType` },
            { text: ": " },
            { translate: `entity.${entityId}.name` }
        ]
    })
})
```
ex: Exemplo de um *Double Jump*, detecta se o player pulou, se o player estava no solo, e pulou, a quantidade de pulos restantes abaixa em *1*. Se estiver no ar, ele pode dar mais um pulo. Assim que toca o solo, os pulos são resetados.
```ts
let max = 2; // quantidade de pulos.
let x = max;
control.on("onJump", event => {
    if (x == max) {
        x -= 1;
    } else if (x < max && x > 0) {
        event.source.applyKnockback(0, 0, 0, 0.5);
        x -= 1;
    }
});
control.on("touchFloor", event => {
    x = max;
});
```
