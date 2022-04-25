import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  Logging,
  Service,
} from 'homebridge'
import fetch from 'node-fetch'
import { SwitchState } from './switchState'

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
      .onGet(this.getOnCharacteristicHandler.bind(this))
      .onSet(this.setOnCharacteristicHandler.bind(this))

    return [informationService, lightBulb]
  }

  private async getOnCharacteristicHandler(): Promise<boolean> {
    return this.switchState.isOn
  }

  private async setOnCharacteristicHandler(): Promise<void> {
    const url = new URL(`/1/signals/${this.signalID}/send`, this.baseURL)
    const headers = { Authorization: `Bearer ${this.accessToken}` }

    const numOfLoop = this.switchState.isOn ? this.numToOff : this.numToOn

    try {
      for await (const _ of [...Array(numOfLoop)]) {
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers,
        })
        await response.text()
        this.logger('send a signal')
      }
      if (this.switchState.isOn) {
        this.switchState.setOffState()
      } else {
        this.switchState.setOnState()
      }
    } catch (e) {
      if (e instanceof Error) {
        this.logger(e.message)
      }
    }
  }
}
