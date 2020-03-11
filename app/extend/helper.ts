import * as moment from 'moment'
moment.locale('zh-cn');

export function format(date: Date): string {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export function fromNow(date: Date): string {
    return moment(date).fromNow();
}

/**
 * 将数组根据父子关系重新组合
 * @param array 重组集合
 * @param key 主键字段名称
 * @param parentKey 父级字段名称
 * @param rootValue 根字段值
 * @param childrenName 子集字段名称
 */
const treeSet = <T>(array: T[], key: string, parentKey: string, rootValue = undefined, childrenName: string = 'children') => {
    const tree: T[] = [];
    const getChildren = (root: any) => {
        if (root === rootValue)
            return array.filter(p => p[parentKey] === rootValue);
        return array.filter(p => p[parentKey] === root[key]);
    }
    const search = (root: any) => {
        let subs = getChildren(root);
        for (var i in subs) {
            search(subs[i]);

            if (root != rootValue) {
                if (!root[childrenName]) root[childrenName] = [];
                root[childrenName].push(subs[i]);
            } else {
                tree.push(subs[i]);
            }
        }
    }
    search(rootValue);
    return tree;
}

const parseMsg = (action: any, payload: any = {}, metadata: any = {}) => {
    const meta = Object.assign({}, {
        timestamp: Date.now()
    }, metadata);

    return {
        meta,
        data: {
            action,
            payload
        }
    }
}

export { moment, treeSet, parseMsg }
