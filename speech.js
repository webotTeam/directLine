var record = require('node-record-lpcm16')
var fs = require('fs')
var request = require('request')

exports.speech = function(handler)
{
    var speechFile = fs.createWriteStream('speech.wav', { encoding: 'binary' });
    record.start().pipe(speechFile);
    
    console.log('startSpeech')
    
    //讲话完成
    speechFile.on('finish', function () {
        console.log('endSpeech')
        transToText(handler);
    })
}

function transToText(handler) {
    var data = fs.createReadStream('speech.wav'); 

        request.post({
            'url': 'https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=zh-CN&format=detailed',
            'headers': {
                'Accept': 'application/json;',
                'Ocp-Apim-Subscription-Key': '838ebad450ab48258afc767194c84ad9',
                'Transfer-Encoding': 'chunked',
                'Content-Type': 'audio/wav; codec=audio/pcm; samplerate=16000'
            },
            body: data
        }, function (err, resp, body) {

            if (err)
                return;

            var result = JSON.parse(body).NBest[0].Display;
            console.log(result);

            handler(result);
        })

}



