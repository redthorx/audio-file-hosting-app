import { expect, Expect,test, describe,mock, beforeEach, beforeAll } from "bun:test";
import { hashPassword,verifyPassword  } from "../../src/auth/cypto";

test('String should be correct syntax',()=>{
    const pwhash = hashPassword("SOMEPASSWORD")
    const [salt, originalHash] = pwhash.split(':')
    expect(salt?.length).toBeGreaterThan(1)
    expect(originalHash?.length).toBeGreaterThan(1)
    expect(verifyPassword("SOMEPASSWORD",pwhash)).toBeTrue()
})