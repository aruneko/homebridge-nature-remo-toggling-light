import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  Logging,
  Service,
} from 'homebridge'
import fetch from 'node-fetch'
import { SwitchState } from './switchState.js'

export class TogglingLightAccessory implements AccessoryPlugin {
  private readonly Service = this.api.hap.Service
  private readonly Characteristic = this.api.hap.Characteristic

  private readonly accessToken: string = this.config.accessToken
  private readonly signalID: string = this.config.signalID
  private readonly numToOn: number = this.config.numToOn
  private readonly numToOff: number = this.config.numToOff

  private readonly baseURL = 'https://api.nature.global'

  private readonly switchState = new SwitchState()

  constructor(
    private readonly logger: Logging,
    private readonly config: AccessoryConfig,
    private readonly api: API
  ) {}

  public getServices(): Service[] {
    const informationService = new this.Service.AccessoryInformation()
      .setCharacteristic(this.Characteristic.Manufacturer, 'Nature, Inc.')
      .setCharacteristic(this.Characteristic.Model, 'NatureRemo')
      .setCharacteristic(this.Characteristic.SerialNumber, 'nature-remo')
    const lightBulb = new this.Service.Lightbulb(this.config.name)

    lightBulb
      .getCharacteristic(this.Characteristic.On)
      .on('get', this.getOnCharacteristicHandler.bind(this))
      .on('set', this.setOnCharacteristicHandler.bind(this))

    return [informationService, lightBulb]
  }

  private async getOnCharacteristicHandler() {
    return this.switchState.isOn
  }

  private async setOnCharacteristicHandler() {
    const url = new URL(`/1/signals/${this.signalID}/send`, this.baseURL)
    const headers = { Authorization: `Bearer ${this.accessToken}` }

    const numOfLoop = this.switchState.isOn ? this.numToOff : this.numToOn

    const requests = [...Array(numOfLoop)].map((_) =>
      fetch(url.toString(), { method: 'POST', headers })
    )

    try {
      for await (const response of requests) {
        const responseMessage = await response.text()
        this.logger(responseMessage)
      }
    } catch (e) {
      if (e instanceof Error) {
        this.logger(e.message)
      }
    }
  }
}
