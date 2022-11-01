# API hooks

Os 'hooks' da API são disponibilizados para que haja uma comunicação reativa em tempo real entre o back-end e o front-end.

## Utilização
Por segurança, a utilização do hash de integração é obrigatória para acessar qualquer parte do sistema via api. <br/>
Caso não informe um hash válido, a api retornará a seguinte mensagem: <br/>
```bash
{
  "message": "Not authorized"
}
```
<br/>

```bash
Atenção: o conteudo abaixo exibido em 'data' é meramente ilustrativo e pode ser usado da maneira que preferir.
```

Basicamente temos dois endpoints disponibilizados para a comunicação entre as pontas, os endpoints são:
<br/>

### Usuário
O Hook de usuário é um hook a ser disparado para apenas um ouvinte, requer 3 paramêtros: <br/>
    - event: nome do evento que será disparado pelo websocket. <br/>
    - listener: chave amiga (enviada pelo front-end no handshake da conexão do socket) do usuário a quem deve ser emitido o evento. <br/>
    - data: conteúdo a ser enviado através do evento. <br/>

```bash
[POST] /hook/user
{
  "event": "deposit",
  "listener": "1666924923361_usermail@email.com",
  "data": {
    "old_value": 100.00,
    "current_value": 500.00
  }
}

Headers: { integration_hash: 'your integration hash' }
```

Caso o listener especificado não seja encontrado, a api retornará a seguinte mensagem:

```bash
{
  "message": "event was not emitted",
  "reason": "listener not found"
}
```
### Salas
O Hook de usuário é um hook a ser disparado para uma sala, todos os usuários conectados à essa sala irão receber o evento, requer 3 paramêtros: <br/>
    - event: nome do evento que será disparado pelo websocket. <br/>
    - data: conteúdo a ser enviado através do evento. <br/>

```bash
[POST] /hook/room/:room-id
{
  "event": "bonus-reward",
  "data": {
    "message": "Crash game is paying 20% bonus"
  }
}

Headers: { integration_hash: 'your integration hash' }
```
