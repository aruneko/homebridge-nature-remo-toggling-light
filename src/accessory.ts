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

  private readonly informationService = new this.Service.AccessoryInformation()
  private readonly lightBulb = new this.Service.Lightbulb(this.config.name)

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
  ) {
    this.informationService
      .setCharacteristic(this.Characteristic.Manufacturer, 'Nature, Inc.')
      .setCharacteristic(this.Characteristic.Model, 'NatureRemo')
      .setCharacteristic(this.Characteristic.SerialNumber, 'nature-remo')

    this.lightBulb
      .getCharacteristic(this.Characteristic.On)
      .onGet(this.getOnCharacteristicHandler)
      .onSet((value) => this.setOnCharacteristicHandler(value as boolean))
  }

  public getServices(): Service[] {
    return [this.informationService, this.lightBulb]
  }

  private async getOnCharacteristicHandler(): Promise<boolean> {
    return this.switchState.isOn
  }

  private async setOnCharacteristicHandler(nextState: boolean): Promise<void> {
    const url = new URL(`/1/signals/${this.signalID}/send`, this.baseURL)
    const headers = { Authorization: `Bearer ${this.accessToken}` }

    this.logger(`value: ${nextState}`)
    const numOfLoop = nextState ? this.numToOn : this.numToOff

    try {
      for await (const _ of [...Array(numOfLoop)]) {
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers,
        })
        await response.text()
        this.logger('send a signal')
      }
      if (nextState) {
        this.switchState.setOnState()
        this.logger('turned on')
      } else {
        this.switchState.setOffState()
        this.logger('turned off')
      }
    } catch (e) {
      if (e instanceof Error) {
        this.logger(e.message)
      }
    }
  }
}
