
const socket = io('https://webgoionline.herokuapp.com/');

socket.on('DANH_SACH_ONLINE', arruserinfo => {
    arruserinfo.forEach(user => {
        let username = user.ten;
        let id = user.peerid;
        console.log('<li id="' + id + '">' + username + '</li>');
        // // $('#uluser').html($('#uluser').html() +'<li id='+id+'>'+username+'</li>');

    });
});

socket.on('CO_NGUOI_MOI', user => {
    // let username = user.ten;
    // let id = user.peerid;
    // // $('#uluser').html($('#uluser').html() +'<li id='+id+'>'+username+'</li>');
});

// Mở stream
function openStream() {
    var config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idvideo, stream) {
    const video = document.getElementById(idvideo);
    video.srcObject = stream;
    video.play();
}

// openStream().then(stream => {playStream('localStream', stream);console.log(stream)});

var peer = new Peer({key: 'peerjs', host: 'https://webgoionline.herokuapp.com/', secure: true, port:443});

peer.on('open', function (id) {
    console.log(id);
    $('#myid').html("Your id: " + id);
    // $('#btnSignup').click(function(){
    //     const username = $('#textusername').val();
    //     // socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerid: id});
    // });
});

//Người gọi
$('#btnCall').click(function () {
    const id = $('#remoteid').val();
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remotestream => { playStream('remoteStream', remotestream) });
    });
});

//Người nhận
peer.on('call', call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remotestream => playStream('remoteStream', remotestream));
    });
});

$('#btnSignup').click(function () {
    const username = $('#textusername').val();
    socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerid: 'id'});
});

