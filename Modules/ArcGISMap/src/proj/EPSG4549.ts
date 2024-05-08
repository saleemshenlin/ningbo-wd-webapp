import { IPORJ4 } from '../store/types'

export const EPSG4549: IPORJ4 = {
    name: 'EPSG:4549',
    proj4: '+proj=tmerc +lat_0=0 +lon_0=121.35 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs',
}

export const EPSG4490: IPORJ4 = {
    name: 'EPSG:4490',
    proj4: '+proj=longlat +ellps=GRS80 +no_defs +type=crs',
}
