import { Context } from 'egg'
import { IPaging } from '../component/query';
import { json2Xml } from '../component/xmlandjson';
// import CustomLogger from '../component/customlogger';
export default {

    // get log(this: Context) {
    //     return CustomLogger(this);
    // },

    /**
     * 以JSON格式输出
     */
    json(this: Context) {
        this.type = "application/json";
        this.status = 200;
    },

    /**
     * 表示服务器执行成功，并且输出对象
     * @param obj 输出对象
     */
    success(this: Context, obj?: any) {
        this.body = obj || {}
        this.json();
    },

    /**
     * 表示服务器执行成功，并且输出列表
     * @param list 输出列表
     * @param pagi 分页对象
     */
    paging(this: Context, list: any, pagi: IPaging) {
        this.body = {
            data: list,
            ...pagi
        }
        this.json();
    },

    /**
     * 返回错误
     * @param errmsg 异常信息
     */
    error(this: Context, errmsg: string) {
        this.body = {
            errcode: -1,
            err: true,
            errmsg
        }
        this.json();
    },


    replyText(this: Context, content: string | undefined, from: string[] | undefined, to: string[] | undefined) {
        const rep = json2Xml({
            xml: {
                FromUserName: from,
                ToUserName: to,
                CreateTime: Date.now(),
                MsgType: ['text'],
                Content: [content]
            }
        })
        this.res.end(content ? rep : null);
    }

}