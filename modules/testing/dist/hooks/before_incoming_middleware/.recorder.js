"use strict";

const axios = require('axios');

const _ = require('lodash');

async function processIncoming() {
  try {
    const axiosConfig = await bp.http.getAxiosConfigForBot(event.botId);
    const {
      data
    } = await axios.post('/mod/testing/incomingEvent', event, axiosConfig);

    if (data) {
      event.state = _.merge(event.state, data);
    }
  } catch (err) {
    console.log('Error processing', err.message);
  }
}

return processIncoming();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi5yZWNvcmRlci5qcyJdLCJuYW1lcyI6WyJheGlvcyIsInJlcXVpcmUiLCJfIiwicHJvY2Vzc0luY29taW5nIiwiYXhpb3NDb25maWciLCJicCIsImh0dHAiLCJnZXRBeGlvc0NvbmZpZ0ZvckJvdCIsImV2ZW50IiwiYm90SWQiLCJkYXRhIiwicG9zdCIsInN0YXRlIiwibWVyZ2UiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxPQUFELENBQXJCOztBQUNBLE1BQU1DLENBQUMsR0FBR0QsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBRUEsZUFBZUUsZUFBZixHQUFpQztBQUMvQixNQUFJO0FBQ0YsVUFBTUMsV0FBVyxHQUFHLE1BQU1DLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRQyxvQkFBUixDQUE2QkMsS0FBSyxDQUFDQyxLQUFuQyxDQUExQjtBQUNBLFVBQU07QUFBRUMsTUFBQUE7QUFBRixRQUFXLE1BQU1WLEtBQUssQ0FBQ1csSUFBTixDQUFXLDRCQUFYLEVBQXlDSCxLQUF6QyxFQUFnREosV0FBaEQsQ0FBdkI7O0FBRUEsUUFBSU0sSUFBSixFQUFVO0FBQ1JGLE1BQUFBLEtBQUssQ0FBQ0ksS0FBTixHQUFjVixDQUFDLENBQUNXLEtBQUYsQ0FBUUwsS0FBSyxDQUFDSSxLQUFkLEVBQXFCRixJQUFyQixDQUFkO0FBQ0Q7QUFDRixHQVBELENBT0UsT0FBT0ksR0FBUCxFQUFZO0FBQ1pDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGtCQUFaLEVBQWdDRixHQUFHLENBQUNHLE9BQXBDO0FBQ0Q7QUFDRjs7QUFFRCxPQUFPZCxlQUFlLEVBQXRCIiwic291cmNlUm9vdCI6IkQ6XFxDb2RpZ28gQm90cHJlc3NcXGJvdHByZXNzXFxtb2R1bGVzXFx0ZXN0aW5nXFxzcmNcXGJhY2tlbmQiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBheGlvcyA9IHJlcXVpcmUoJ2F4aW9zJylcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5hc3luYyBmdW5jdGlvbiBwcm9jZXNzSW5jb21pbmcoKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGF4aW9zQ29uZmlnID0gYXdhaXQgYnAuaHR0cC5nZXRBeGlvc0NvbmZpZ0ZvckJvdChldmVudC5ib3RJZClcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgYXhpb3MucG9zdCgnL21vZC90ZXN0aW5nL2luY29taW5nRXZlbnQnLCBldmVudCwgYXhpb3NDb25maWcpXHJcblxyXG4gICAgaWYgKGRhdGEpIHtcclxuICAgICAgZXZlbnQuc3RhdGUgPSBfLm1lcmdlKGV2ZW50LnN0YXRlLCBkYXRhKVxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5sb2coJ0Vycm9yIHByb2Nlc3NpbmcnLCBlcnIubWVzc2FnZSlcclxuICB9XHJcbn1cclxuXHJcbnJldHVybiBwcm9jZXNzSW5jb21pbmcoKVxyXG4iXX0=