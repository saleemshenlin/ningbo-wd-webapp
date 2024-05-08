import JSEncrypt from 'jsencrypt'

const PUBLIC_KEY =
    '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCB97CSJsgOOVOLiuvjOg5nCPNpKRla54bV0gf+8Wmd6RrsdQ0gjfb7gC5LfpWouBiEYxYhVhUnS4OuXJWJNeHrf8xSn2itM8Aj/Qfm7lHN5eXqg6C5X9ynA0TznwN4YZCUdRjn9FXtPYhiz982f416oikbF7OYHPVlYzPjCQSlawIDAQAB-----END PUBLIC KEY-----'

export const encrypt = (msg: string): string => {
    const sign = new JSEncrypt()
    sign.setPublicKey(PUBLIC_KEY)
    const encryptPassword = sign.encrypt(msg) as string
    console.log('encryptPassword :>> ', encryptPassword)
    return encryptPassword
}
