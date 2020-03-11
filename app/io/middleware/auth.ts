import { Context } from 'egg'
export default () => {
    return async (ctx: Context, next) => {
        const { socket, } = ctx;
        const id = socket.id;
        // const nsp = app.io.of('/feature');
        const query = socket.handshake.query;

        const { room, uid } = query
        // const rooms = [room];
        console.log(id, room, uid)
        //ctx.socket.emit('res', 'connected!');
        await next();
        console.log('disconnection!');
    }
}