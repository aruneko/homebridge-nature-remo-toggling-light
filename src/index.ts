import { API } from 'homebridge'
import { TogglingLightAccessory } from './accessory'
import { ACCESSORY_IDENTIFIER, ACCESSORY_NAME } from './constants'

export = (api: API) => {
  api.registerAccessory(ACCESSORY_IDENTIFIER, ACCESSORY_NAME, TogglingLightAccessory)
}
