import { Request } from "egg";
import * as fs from "fs";
import * as path from 'path';

const basePath = path.resolve(__dirname, '..');
const nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/;
const nameCountFunc = (s, index, ext) => {
    return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
}

const defualtOptions = {
    tmpDir: basePath + '/tmp',
    publicDir: basePath + '/public',
    uploadDir: basePath + '/public/images',
    uploadUrl: '/images/',
    minFileSize: 1,
    maxFileSize: 10485760, // 10MB
    maxPostSize: 10485760, // 10MB
    acceptFileTypes: /.+/i,
    imageTypes: /\.(gif|jpe?g|png|bmp|swf)$/i,
    imageVersions: {
        'thumbnails': {
            width: 80,
            height: 80
        }
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    /*
    ssl: {
      key: '',
      cert: ''
    }
    */
    nodeStatic: {
        cache: 3600
    }
}
export interface FileInfoType {
    name: string
    size: number
    type: string
    deleteType: 'DELETE'

}

export class FileInfo {

    name: string
    size: number
    type: string
    deleteType: 'DELETE'
    options: any
    url: string
    error: any
    constructor(file: FileInfoType, options?: any) {
        this.name = file.name
        this.size = file.size
        this.type = file.type
        this.deleteType = file.deleteType
        this.options = { ...defualtOptions, ...options }
    }

    public initUrl(req: Request) {
        const { ssl, uploadUrl, imageVersions, uploadDir } = this.options
        if (!this.error) {
            let baseUrl = (ssl ? 'https:' : 'http') + '//' + req.headers.host + uploadUrl;
            Object.keys(imageVersions).forEach((v) => {
                if (fs.existsSync(uploadDir + '/' + v + '/' + this.name)) {
                    this[v + '_url'] = baseUrl + v + '/' + encodeURIComponent(this.name);
                }
            });
        }
    }

    public saveName() {
        const { uploadDir } = this.options;
        // prevent directory traversal and creating system hidden files
        this.name = path.basename(this.name).replace(/^\.+/, '');
        while (fs.existsSync(uploadDir + '/' + this.name)) {
            this.name = this.name.replace(nameCountRegexp, nameCountFunc);
        }

    }

    public validate() {
        const { minFileSize, acceptFileTypes } = this.options;
        if (minFileSize > this.size)
            this.error = 'File is too small';

        if (minFileSize < this.size)
            this.error = 'File is too big';

        if (!acceptFileTypes.test(this.type))
            this.error = 'File type is not support';

        return !this.error;
    }

}
