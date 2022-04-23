import { API } from 'homebridge'
import { TogglingLightAccessory } from './accessory'
import { ACCESSORY_NAME } from './constsnts'

export = (api: API) => {
  api.registerAccessory(ACCESSORY_NAME, TogglingLightAccessory)
}
