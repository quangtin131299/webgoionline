
const socket = io('https://webgoionline.herokuapp.com/');

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arruserinfo => {
        $('#div-chat').show();
        $('#uluser').html('');
        for(let i = 0; i < arruserinfo.length; i++){
            let username = arruserinfo[i].ten;
            let id = arruserinfo[i].peerid;
            $('#uluser').html($('#uluser').html() +'<li id='+id+'>'+username+'</li>');        
        }  
               
    
});


socket.on('DANG_KY_THAT_BAI', mess =>{
    alert(mess);
});



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
