import {
	browserName,
	deviceType,
	osVersion,
	osName,
} from 'react-device-detect';

export const getDevice = () => {
  return `${browserName}${deviceType}-${osName}_${osVersion}`
}