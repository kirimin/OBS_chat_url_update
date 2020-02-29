const OBSWebSocket = require('obs-websocket-js');
const getStreaming = require('get_current_streaming');
const CREDENSIALS = require('./credentials/credensials.js')

const CHANNNEL_ID = "UCqN87Ye4TNLB04EFhxJ0L5w"
const CHAT_SOURCE_NAME = "チャット欄"
const LIVE_STATUS = "upcoming"

getStreaming.getVideoId(CREDENSIALS, CHANNNEL_ID, LIVE_STATUS, callback)

function callback(videoId) {
    console.log(videoId)
    const obs = new OBSWebSocket();
    obs.connect({address: 'localhost:4444'})
    .then(() => {
        console.log(`Success! We're connected & authenticated.`);
        return obs.send('GetCurrentScene');
    })
    .then(data => {
        data.sources.forEach(source => {
            if (source.name === CHAT_SOURCE_NAME) {
                console.log(source)
                obs.send('SetBrowserSourceProperties', {
                    'source': source.name,
                    'url': `https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`
                });
            }
        });
        obs.disconnect();
    })
    .catch(err => {
        console.log(err);
    });

    obs.on('error', err => {
        console.error('socket error:', err);
    });
}