/**
 * Extract Qna data to session variables
 *
 * @title Extract QnA Data
 * @category Registry Books
 * 
 */

const axios = require('axios')

const setVariable = async (type, name, value) => {
  if (type === 'bot') {
    const original = await bp.kvs.get(event.botId, 'global');
    await bp.kvs.set(event.botId, 'global', {
      ...original,
      [name]: value
    });
  } else if (value === 'null' || value === '' || typeof value === 'undefined') {
    delete event.state[type][name];
  } else {
    event.state[type][name] = value;
  }
};

async function extractQnAData() {
  const data = await bp.database('dialog_sessions')
    .where({
      'id': `api::${event.target}`,
      'botId': event.botId
    })
    .orWhere({
      'id': `web::${event.target}::${event.threadId}`,
      'botId': event.botId
    }).first();

  const last_index = data.session_data.lastMessages.length - 1

  if (data.session_data.lastMessages[last_index].replySource.startsWith('qna ')) {
    const id = data.session_data.lastMessages[last_index].replySource.replace('qna __qna__', '')
    const { data: qna } = await axios.get(`/mod/qna/questions/${id}`, await bp.http.getAxiosConfigForBot(event.botId, { localUrl: true }))
    const question_text = qna.data.questions[0]
    setVariable('session', 'qna_last_answer', { text: question_text, id: data.session_data.lastMessages[last_index].replySource.slice(4) })
    setVariable('session', 'qna_last_question', data.session_data.lastMessages[last_index].incomingPreview)
  }

}

return extractQnAData();