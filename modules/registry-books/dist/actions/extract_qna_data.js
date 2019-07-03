"use strict";

/**
 * Extract Qna data to session variables
 *
 * @title Extract QnA Data
 * @category Registry Books
 * 
 */
const axios = require('axios');

const setVariable = async (type, name, value) => {
  if (type === 'bot') {
    const original = await bp.kvs.get(event.botId, 'global');
    await bp.kvs.set(event.botId, 'global', { ...original,
      [name]: value
    });
  } else if (value === 'null' || value === '' || typeof value === 'undefined') {
    delete event.state[type][name];
  } else {
    event.state[type][name] = value;
  }
};

async function extractQnAData() {
  const data = await bp.database('dialog_sessions').where({
    'id': `api::${event.target}`,
    'botId': event.botId
  }).orWhere({
    'id': `web::${event.target}::${event.threadId}`,
    'botId': event.botId
  }).first();
  const last_index = data.session_data.lastMessages.length - 1;

  if (data.session_data.lastMessages[last_index].replySource.startsWith('qna ')) {
    const id = data.session_data.lastMessages[last_index].replySource.replace('qna __qna__', '');
    const {
      data: qna
    } = await axios.get(`/mod/qna/questions/${id}`, (await bp.http.getAxiosConfigForBot(event.botId, {
      localUrl: true
    })));
    const question_text = qna.data.questions[0];
    setVariable('session', 'qna_last_answer', {
      text: question_text,
      id: data.session_data.lastMessages[last_index].replySource.slice(4)
    });
    setVariable('session', 'qna_last_question', data.session_data.lastMessages[last_index].incomingPreview);
  }
}

return extractQnAData();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4dHJhY3RfcW5hX2RhdGEuanMiXSwibmFtZXMiOlsiYXhpb3MiLCJyZXF1aXJlIiwic2V0VmFyaWFibGUiLCJ0eXBlIiwibmFtZSIsInZhbHVlIiwib3JpZ2luYWwiLCJicCIsImt2cyIsImdldCIsImV2ZW50IiwiYm90SWQiLCJzZXQiLCJzdGF0ZSIsImV4dHJhY3RRbkFEYXRhIiwiZGF0YSIsImRhdGFiYXNlIiwid2hlcmUiLCJ0YXJnZXQiLCJvcldoZXJlIiwidGhyZWFkSWQiLCJmaXJzdCIsImxhc3RfaW5kZXgiLCJzZXNzaW9uX2RhdGEiLCJsYXN0TWVzc2FnZXMiLCJsZW5ndGgiLCJyZXBseVNvdXJjZSIsInN0YXJ0c1dpdGgiLCJpZCIsInJlcGxhY2UiLCJxbmEiLCJodHRwIiwiZ2V0QXhpb3NDb25maWdGb3JCb3QiLCJsb2NhbFVybCIsInF1ZXN0aW9uX3RleHQiLCJxdWVzdGlvbnMiLCJ0ZXh0Iiwic2xpY2UiLCJpbmNvbWluZ1ByZXZpZXciXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFRQSxNQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxPQUFELENBQXJCOztBQUVBLE1BQU1DLFdBQVcsR0FBRyxPQUFPQyxJQUFQLEVBQWFDLElBQWIsRUFBbUJDLEtBQW5CLEtBQTZCO0FBQy9DLE1BQUlGLElBQUksS0FBSyxLQUFiLEVBQW9CO0FBQ2xCLFVBQU1HLFFBQVEsR0FBRyxNQUFNQyxFQUFFLENBQUNDLEdBQUgsQ0FBT0MsR0FBUCxDQUFXQyxLQUFLLENBQUNDLEtBQWpCLEVBQXdCLFFBQXhCLENBQXZCO0FBQ0EsVUFBTUosRUFBRSxDQUFDQyxHQUFILENBQU9JLEdBQVAsQ0FBV0YsS0FBSyxDQUFDQyxLQUFqQixFQUF3QixRQUF4QixFQUFrQyxFQUN0QyxHQUFHTCxRQURtQztBQUV0QyxPQUFDRixJQUFELEdBQVFDO0FBRjhCLEtBQWxDLENBQU47QUFJRCxHQU5ELE1BTU8sSUFBSUEsS0FBSyxLQUFLLE1BQVYsSUFBb0JBLEtBQUssS0FBSyxFQUE5QixJQUFvQyxPQUFPQSxLQUFQLEtBQWlCLFdBQXpELEVBQXNFO0FBQzNFLFdBQU9LLEtBQUssQ0FBQ0csS0FBTixDQUFZVixJQUFaLEVBQWtCQyxJQUFsQixDQUFQO0FBQ0QsR0FGTSxNQUVBO0FBQ0xNLElBQUFBLEtBQUssQ0FBQ0csS0FBTixDQUFZVixJQUFaLEVBQWtCQyxJQUFsQixJQUEwQkMsS0FBMUI7QUFDRDtBQUNGLENBWkQ7O0FBY0EsZUFBZVMsY0FBZixHQUFnQztBQUM5QixRQUFNQyxJQUFJLEdBQUcsTUFBTVIsRUFBRSxDQUFDUyxRQUFILENBQVksaUJBQVosRUFDaEJDLEtBRGdCLENBQ1Y7QUFDTCxVQUFPLFFBQU9QLEtBQUssQ0FBQ1EsTUFBTyxFQUR0QjtBQUVMLGFBQVNSLEtBQUssQ0FBQ0M7QUFGVixHQURVLEVBS2hCUSxPQUxnQixDQUtSO0FBQ1AsVUFBTyxRQUFPVCxLQUFLLENBQUNRLE1BQU8sS0FBSVIsS0FBSyxDQUFDVSxRQUFTLEVBRHZDO0FBRVAsYUFBU1YsS0FBSyxDQUFDQztBQUZSLEdBTFEsRUFRZFUsS0FSYyxFQUFuQjtBQVVBLFFBQU1DLFVBQVUsR0FBR1AsSUFBSSxDQUFDUSxZQUFMLENBQWtCQyxZQUFsQixDQUErQkMsTUFBL0IsR0FBd0MsQ0FBM0Q7O0FBRUEsTUFBSVYsSUFBSSxDQUFDUSxZQUFMLENBQWtCQyxZQUFsQixDQUErQkYsVUFBL0IsRUFBMkNJLFdBQTNDLENBQXVEQyxVQUF2RCxDQUFrRSxNQUFsRSxDQUFKLEVBQStFO0FBQzdFLFVBQU1DLEVBQUUsR0FBR2IsSUFBSSxDQUFDUSxZQUFMLENBQWtCQyxZQUFsQixDQUErQkYsVUFBL0IsRUFBMkNJLFdBQTNDLENBQXVERyxPQUF2RCxDQUErRCxhQUEvRCxFQUE4RSxFQUE5RSxDQUFYO0FBQ0EsVUFBTTtBQUFFZCxNQUFBQSxJQUFJLEVBQUVlO0FBQVIsUUFBZ0IsTUFBTTlCLEtBQUssQ0FBQ1MsR0FBTixDQUFXLHNCQUFxQm1CLEVBQUcsRUFBbkMsR0FBc0MsTUFBTXJCLEVBQUUsQ0FBQ3dCLElBQUgsQ0FBUUMsb0JBQVIsQ0FBNkJ0QixLQUFLLENBQUNDLEtBQW5DLEVBQTBDO0FBQUVzQixNQUFBQSxRQUFRLEVBQUU7QUFBWixLQUExQyxDQUE1QyxFQUE1QjtBQUNBLFVBQU1DLGFBQWEsR0FBR0osR0FBRyxDQUFDZixJQUFKLENBQVNvQixTQUFULENBQW1CLENBQW5CLENBQXRCO0FBQ0FqQyxJQUFBQSxXQUFXLENBQUMsU0FBRCxFQUFZLGlCQUFaLEVBQStCO0FBQUVrQyxNQUFBQSxJQUFJLEVBQUVGLGFBQVI7QUFBdUJOLE1BQUFBLEVBQUUsRUFBRWIsSUFBSSxDQUFDUSxZQUFMLENBQWtCQyxZQUFsQixDQUErQkYsVUFBL0IsRUFBMkNJLFdBQTNDLENBQXVEVyxLQUF2RCxDQUE2RCxDQUE3RDtBQUEzQixLQUEvQixDQUFYO0FBQ0FuQyxJQUFBQSxXQUFXLENBQUMsU0FBRCxFQUFZLG1CQUFaLEVBQWlDYSxJQUFJLENBQUNRLFlBQUwsQ0FBa0JDLFlBQWxCLENBQStCRixVQUEvQixFQUEyQ2dCLGVBQTVFLENBQVg7QUFDRDtBQUVGOztBQUVELE9BQU94QixjQUFjLEVBQXJCIiwic291cmNlUm9vdCI6IkQ6XFxDb2RpZ28gQm90cHJlc3NcXGJvdHByZXNzXFxtb2R1bGVzXFxyZWdpc3RyeS1ib29rc1xcc3JjXFxiYWNrZW5kIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEV4dHJhY3QgUW5hIGRhdGEgdG8gc2Vzc2lvbiB2YXJpYWJsZXNcclxuICpcclxuICogQHRpdGxlIEV4dHJhY3QgUW5BIERhdGFcclxuICogQGNhdGVnb3J5IFJlZ2lzdHJ5IEJvb2tzXHJcbiAqIFxyXG4gKi9cclxuXHJcbmNvbnN0IGF4aW9zID0gcmVxdWlyZSgnYXhpb3MnKVxyXG5cclxuY29uc3Qgc2V0VmFyaWFibGUgPSBhc3luYyAodHlwZSwgbmFtZSwgdmFsdWUpID0+IHtcclxuICBpZiAodHlwZSA9PT0gJ2JvdCcpIHtcclxuICAgIGNvbnN0IG9yaWdpbmFsID0gYXdhaXQgYnAua3ZzLmdldChldmVudC5ib3RJZCwgJ2dsb2JhbCcpO1xyXG4gICAgYXdhaXQgYnAua3ZzLnNldChldmVudC5ib3RJZCwgJ2dsb2JhbCcsIHtcclxuICAgICAgLi4ub3JpZ2luYWwsXHJcbiAgICAgIFtuYW1lXTogdmFsdWVcclxuICAgIH0pO1xyXG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICdudWxsJyB8fCB2YWx1ZSA9PT0gJycgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgZGVsZXRlIGV2ZW50LnN0YXRlW3R5cGVdW25hbWVdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBldmVudC5zdGF0ZVt0eXBlXVtuYW1lXSA9IHZhbHVlO1xyXG4gIH1cclxufTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGV4dHJhY3RRbkFEYXRhKCkge1xyXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBicC5kYXRhYmFzZSgnZGlhbG9nX3Nlc3Npb25zJylcclxuICAgIC53aGVyZSh7XHJcbiAgICAgICdpZCc6IGBhcGk6OiR7ZXZlbnQudGFyZ2V0fWAsXHJcbiAgICAgICdib3RJZCc6IGV2ZW50LmJvdElkXHJcbiAgICB9KVxyXG4gICAgLm9yV2hlcmUoe1xyXG4gICAgICAnaWQnOiBgd2ViOjoke2V2ZW50LnRhcmdldH06OiR7ZXZlbnQudGhyZWFkSWR9YCxcclxuICAgICAgJ2JvdElkJzogZXZlbnQuYm90SWRcclxuICAgIH0pLmZpcnN0KCk7XHJcblxyXG4gIGNvbnN0IGxhc3RfaW5kZXggPSBkYXRhLnNlc3Npb25fZGF0YS5sYXN0TWVzc2FnZXMubGVuZ3RoIC0gMVxyXG5cclxuICBpZiAoZGF0YS5zZXNzaW9uX2RhdGEubGFzdE1lc3NhZ2VzW2xhc3RfaW5kZXhdLnJlcGx5U291cmNlLnN0YXJ0c1dpdGgoJ3FuYSAnKSkge1xyXG4gICAgY29uc3QgaWQgPSBkYXRhLnNlc3Npb25fZGF0YS5sYXN0TWVzc2FnZXNbbGFzdF9pbmRleF0ucmVwbHlTb3VyY2UucmVwbGFjZSgncW5hIF9fcW5hX18nLCAnJylcclxuICAgIGNvbnN0IHsgZGF0YTogcW5hIH0gPSBhd2FpdCBheGlvcy5nZXQoYC9tb2QvcW5hL3F1ZXN0aW9ucy8ke2lkfWAsIGF3YWl0IGJwLmh0dHAuZ2V0QXhpb3NDb25maWdGb3JCb3QoZXZlbnQuYm90SWQsIHsgbG9jYWxVcmw6IHRydWUgfSkpXHJcbiAgICBjb25zdCBxdWVzdGlvbl90ZXh0ID0gcW5hLmRhdGEucXVlc3Rpb25zWzBdXHJcbiAgICBzZXRWYXJpYWJsZSgnc2Vzc2lvbicsICdxbmFfbGFzdF9hbnN3ZXInLCB7IHRleHQ6IHF1ZXN0aW9uX3RleHQsIGlkOiBkYXRhLnNlc3Npb25fZGF0YS5sYXN0TWVzc2FnZXNbbGFzdF9pbmRleF0ucmVwbHlTb3VyY2Uuc2xpY2UoNCkgfSlcclxuICAgIHNldFZhcmlhYmxlKCdzZXNzaW9uJywgJ3FuYV9sYXN0X3F1ZXN0aW9uJywgZGF0YS5zZXNzaW9uX2RhdGEubGFzdE1lc3NhZ2VzW2xhc3RfaW5kZXhdLmluY29taW5nUHJldmlldylcclxuICB9XHJcblxyXG59XHJcblxyXG5yZXR1cm4gZXh0cmFjdFFuQURhdGEoKTsiXX0=