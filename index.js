const io = require('socket.io')(3000);

const arruserinfo =[];

io.on('connection', socket => {
    socket.on('NGUOI_DUNG_DANG_KY', username =>{
        arruserinfo.push(username);
        socket.emit('DANH_SACH_ONLINE',arruserinfo);
        io.emit('CO_NGUOI_MOI' , username);
    });
})