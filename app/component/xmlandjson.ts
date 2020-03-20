import { parseString, Builder } from 'xml2js'

export const xml2Json = (str) => {
    return new Promise<any>((resolve, reject) => {
        parseString(str, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

export const json2Xml = (obj: object) => {
    const builder = new Builder();
    return builder.buildObject(obj)
}