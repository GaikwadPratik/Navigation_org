import * as io from 'socket.io-client';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';

export class MailerModel {

    public SendMail(toEmails: string[] | string, subject: string, body: string) {
        return new Promise((resolve, reject) => {

            let socket = io.connect("http://localhost:61337");

            // Let's handle the data we get from the server
            socket.on("response", (data) => {
                let _data = JSON.parse(data.toString());
                ApplicationLog.LogDebug(`Client : Response from server: $${_data.response}`);
                
                // Close the connection
                socket.close();
                resolve(_data.response);
            });

            socket.on('connect', () => {
                ApplicationLog.LogDebug(`${new Date()} Connected to server`);
                socket.emit('request', JSON.stringify({ ToEmails: toEmails, Subject: subject, Body: body }));
            });
        });
    }
}