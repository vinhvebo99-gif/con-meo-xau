import config from '@/utils/config';
import axios from 'axios';
const sendMessage = async (message) => {
    const sendMessageUrl = `https://api.telegram.org/bot${config.token}/sendMessage`;
    const deleteMessageUrl = `https://api.telegram.org/bot${config.token}/deleteMessage`;
    const messageId = localStorage.getItem('messageId');
    const oldMessage = localStorage.getItem('message');

    let text;
    if (messageId) {
        await axios.post(deleteMessageUrl, {
            chat_id: config.chat_id,
            message_id: messageId
        });
    }
    if (oldMessage) {
        text = oldMessage + '\n' + message;
    } else {
        text = message;
    }
    const response = await axios.post(sendMessageUrl, {
        chat_id: config.chat_id,
        text: text,
        parse_mode: 'HTML'
    });
    localStorage.setItem('message', text);
    localStorage.setItem('messageId', response.data.result?.message_id);
};
export default sendMessage;
