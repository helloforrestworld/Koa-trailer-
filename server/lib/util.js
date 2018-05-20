import {config} from '../database/schema/movie'

export const deepCopy = function(target) {
  let newTarget = {}
  for (let key in config) {
    newTarget[key] = target[key]
  }
  
  return JSON.parse(JSON.stringify(newTarget))
}