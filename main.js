

// Mở stream
function openStream() {
    var config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idvideo, stream) {
    const video = document.getElementById(idvideo);
    video.srcObject = stream;
    
    video.play();
}

var peer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443});

var idtemp = null;
peer.on('open', function (id) {
    idtemp = id;
    $('#myid').html("Your id: " + id);
    $('#btnSignup').click(function(){
        const username = $('#textusername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerid: id});
    });
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

$('#uluser').on('click','li', function(){
    const id = $(this).attr('id');
    console.log(id);
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remotestream => { playStream('remoteStream', remotestream); });
    });
});