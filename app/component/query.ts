export interface IPaging {
    total,
    pageSize,
    current
}

export interface IQuery {
    current: number
    pageSize: number
    sorter: string
    toQuery: () => any
    sortOf: () => any
    skipTo: () => number
    limitIn: () => number
    toPagi: (total: number) => IPaging
}

export class Query implements IQuery {
    current: number = 1
    pageSize: number = 10
    sorter: string = ''



    toQuery(): any {
        return {}
    }
    /**
     * 生成排序规则
     */
    sortOf(): any {
        let val = {};
        if (!this.sorter) return val;
        if (this.sorter.indexOf('.') === -1) {
            // 没有检测到 '.' 默认为字段 asc
            val[this.sorter] = 1
        } else {
            // 检测到 a.b 结构
            let [key, rule] = this.sorter.split('.');
            val[key] = rule.includes('asc') ? 1 : -1
        }
        return val;
    }
    /**
     * 跳至, 分页用
     */
    skipTo(): number {
        return (this.current - 1) * this.pageSize;
    }

    /**
     * 限制数量, 分页用
     */
    limitIn(): number {
        return this.pageSize * 1
    }

    /**
     * 生成分页
     * @param total 记录总数
     */
    toPagi(total: number = 1): IPaging {
        return { current: this.current, pageSize: this.pageSize, total: total };
    }

    static populate(obj: any) {
        let q = new Query();
        Object.assign(q, obj);
        return q;
    }
}