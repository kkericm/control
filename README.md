# Control
Módulos com recursos extras para a API do Minecraft Bedrock

## Documentação

<table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Control</td>
      <td>Classe com alguns recursos extras.</td>
    </tr>
    <tr>
      <td>on</td>
      <td>Método de control, e detecta eventos.</td>
    </tr>
    <tr>
      <td>log</td>
      <td>Método de control, e escreve qualquer coisa no chat(strings, números, objetos e etc).</td>
    </tr>
  </tbody>
</table>

## Exemplos

Importação:
```ts
import { control } from "./control";
```

ex: Usando o metodo `on` de `control` para detectar se um player usou uma espada de diamante, e matá-lo por isso.
```ts
control.on("itemUse", event => {
    if (event.itemStack.typeId === "minecraft:diamond_sword") {
        event.source.kill();
    }
});
```

ex: Usando o metodo `on` de `control`, com o `eventTrigger` `_chatSend` (`eventTriggers` com underline(`_`) são equivalentes aos `beforeEvents`.), para que sempre que uma mensagem seja enviada no chat por um player, essa mensagem seja reproduzida(usando o `log`) com "[Member]" antes do nome do player.
```ts
control.on("_chatSend", event => {
    event.cancel = true;
    control.log(`[Member] <${event.sender}> ${event.message}`);
});
```

## Eventos Extras

<table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>onLookAtEntity</td>
      <td>Despara quando um player olhar para uma entidade(até 64 blocos de distancia).</td>
    </tr>
    <tr>
      <td>onLookAtBlock</td>
      <td>Despara quando um player olhar para um bloco(até 64 blocos de distancia).</td>
    </tr>
  </tbody>
</table>

ex: Sempre que um player olha para uma entidade, na sua `actionBar` surge uma mensagem com o tipo dessa entidade. Por exemplo: "Tipo: Porco", quando se olha para um porco.
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
