import { treaty } from '@elysiajs/eden'
import type { API } from '../../apps/server/src'

export function createApiModel(host: string) {
    return treaty<API>(host, {
        headers: {
            'x-csrf': '1'
        }
    })
}