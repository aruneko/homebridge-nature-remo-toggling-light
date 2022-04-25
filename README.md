# Homebridge Plugin for Nature Remo Toggling Light Devices
## これなに
Nature Remo に登録された照明機器を操作するためのプラグインです。このプラグインでは1つの信号でトグル式に明るさが切り替わるライトを、オンにする信号とオフにする信号の回数を指定することでワンタッチでオンオフ可能にすることができます。

## 使い方
npm に登録していますので、Homebridge の管理画面からインストールできます。

## config の書き方
`accessories` に書き加えてください。複数のデバイスがある場合は、そのまま複数登録してください。

|プロパティ名|解説|
|:----|:----|
|accessory|`NatureRemoTogglingLightDevice` で固定です|
|name|デバイスの名前で、任意に設定可能です。|
|accessToken|[公式サイト](https://home.nature.global/)から取得できます。|
|signalID|下記方法を参照してください。|
|numToOn|オフの状態からオンの状態にするのに送信したい信号の回数を指定します。|
|numToOff|オンの状態からオフの状態にするのに送信したい信号の回数を指定します。|


```json
{
  "accessories": [
    {
      "accessory": "NatureRemoTogglingLightDevice",
      "name": "リビングの電気",
      "accessToken": "SECRET_TOKEN",
      "signalID" : "xxxxx",
      "numToOn": 1,
      "numToOff": 4
    }
  ]
}
```

## signalID の調べ方
curl / jq コマンドを使った例を載せておきます。`YOU_SECRET_TOKEN` の箇所は各自書き換えてください。

Nature Remo Cloud API を叩いた結果を jq で抽出し、「その他」として登録されたデバイスに紐付いている信号をリストで取得することができます。この中から自分が操作したい信号の ID をコピーしてきてください。

```bash
$ curl -X GET "https://api.nature.global/1/appliances" -H "Authorization: Bearer YOU_SECRET_TOKEN" | jq ".[] | { name: .nickname, signals: .signals }"
```
