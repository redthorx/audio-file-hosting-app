import { scryptSync,randomBytes } from "crypto"


export function hashPassword(password:string) {
    const salt = randomBytes(16).toString('hex')
    const hash = scryptSync(password,salt,64).toString('hex')
    return `${salt}:${hash}`
}

export function verifyPassword(input:string,storedHash:string){
    const [salt, originalHash] = storedHash.split(':')
    const inputHash = scryptSync(input, salt!, 64).toString('hex')
    return inputHash === originalHash
}