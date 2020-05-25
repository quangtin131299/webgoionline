const io = require('socket.io')(3000);

const arruserinfo = [];

const arrsocket = [];


io.on('connection', socket => {
    arrsocket.push(socket);
    socket.on('NGUOI_DUNG_DANG_KY', username => {
        let isExist = arruserinfo.some(u => username.ten == u.ten);
        socket.peerid = username.peerid;
        if (isExist) {
            socket.emit('DANG_KY_THAT_BAI', username.ten + ' Đăng ký thất bai');
        } else {
            arruserinfo.push(username);
        }
        io.sockets.emit('DANH_SACH_ONLINE', arruserinfo);

        // io.sockets.emit('CO_NGUOI_MOI' , username);
    });
   
    if (arruserinfo.length != 0) {
        io.sockets.emit('DANH_SACH_ONLINE', arruserinfo);
    }

    socket.on('disconnect', () => {
    
        for (let i = 0; i < arrsocket.length; i++) {
            if (arrsocket[i].connected == false) {
                let index = arruserinfo.findIndex(user => user.peerid == arrsocket[i].peerid);
                //xóa người dùng
                arruserinfo.splice(index, 1);
                arrsocket.splice(index, 1);
                io.sockets.emit('DANH_SACH_ONLINE', arruserinfo);

            }
        }
    });
})
//transport close
