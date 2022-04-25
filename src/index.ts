import { API } from 'homebridge'
import { TogglingLightAccessory } from './accessory.js'
import { ACCESSORY_IDENTIFIER, ACCESSORY_NAME } from './constsnts.js'

export = (api: API) => {
  api.registerAccessory(ACCESSORY_IDENTIFIER, ACCESSORY_NAME, TogglingLightAccessory)
}
