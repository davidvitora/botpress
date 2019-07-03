"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Database {
  constructor(bp) {
    this.bp = bp;

    _defineProperty(this, "knex", void 0);

    this.knex = bp.database;
  }

  initialize() {
    if (!this.knex) {
      throw new Error('You must initialize the database before');
    }

    this.knex.createTableIfNotExists('registry_books', function (table) {
      table.increments('id').unsigned().primary(); // Id from the Bot

      table.string('botId'); // Registry category

      table.string('category'); // Used to internaly check if the data is equal

      table.text('data_key'); // Data Stored

      table.text('data'); // Date in which the data was stored

      table.date('registered_on'); // How many times this data was stored (same category and date)

      table.integer('hit_count');
    }).then(() => this.knex);
  }

}

exports.default = Database;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiLnRzIl0sIm5hbWVzIjpbIkRhdGFiYXNlIiwiY29uc3RydWN0b3IiLCJicCIsImtuZXgiLCJkYXRhYmFzZSIsImluaXRpYWxpemUiLCJFcnJvciIsImNyZWF0ZVRhYmxlSWZOb3RFeGlzdHMiLCJ0YWJsZSIsImluY3JlbWVudHMiLCJ1bnNpZ25lZCIsInByaW1hcnkiLCJzdHJpbmciLCJ0ZXh0IiwiZGF0ZSIsImludGVnZXIiLCJ0aGVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBZSxNQUFNQSxRQUFOLENBQWU7QUFHNUJDLEVBQUFBLFdBQVcsQ0FBU0MsRUFBVCxFQUFrQjtBQUFBOztBQUFBOztBQUMzQixTQUFLQyxJQUFMLEdBQVlELEVBQUUsQ0FBQ0UsUUFBZjtBQUNEOztBQUVEQyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxRQUFJLENBQUMsS0FBS0YsSUFBVixFQUFnQjtBQUNkLFlBQU0sSUFBSUcsS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRDs7QUFFRCxTQUFLSCxJQUFMLENBQ0dJLHNCQURILENBQzBCLGdCQUQxQixFQUM0QyxVQUFVQyxLQUFWLEVBQWlCO0FBQ3pEQSxNQUFBQSxLQUFLLENBQUNDLFVBQU4sQ0FBaUIsSUFBakIsRUFBdUJDLFFBQXZCLEdBQWtDQyxPQUFsQyxHQUR5RCxDQUV6RDs7QUFDQUgsTUFBQUEsS0FBSyxDQUFDSSxNQUFOLENBQWEsT0FBYixFQUh5RCxDQUl6RDs7QUFDQUosTUFBQUEsS0FBSyxDQUFDSSxNQUFOLENBQWEsVUFBYixFQUx5RCxDQU16RDs7QUFDQUosTUFBQUEsS0FBSyxDQUFDSyxJQUFOLENBQVcsVUFBWCxFQVB5RCxDQVF6RDs7QUFDQUwsTUFBQUEsS0FBSyxDQUFDSyxJQUFOLENBQVcsTUFBWCxFQVR5RCxDQVV6RDs7QUFDQUwsTUFBQUEsS0FBSyxDQUFDTSxJQUFOLENBQVcsZUFBWCxFQVh5RCxDQVl6RDs7QUFDQU4sTUFBQUEsS0FBSyxDQUFDTyxPQUFOLENBQWMsV0FBZDtBQUNELEtBZkgsRUFnQkdDLElBaEJILENBZ0JRLE1BQU0sS0FBS2IsSUFoQm5CO0FBaUJEOztBQTdCMkIiLCJzb3VyY2VSb290IjoiRDpcXENvZGlnbyBCb3RwcmVzc1xcYm90cHJlc3NcXG1vZHVsZXNcXHJlZ2lzdHJ5LWJvb2tzXFxzcmNcXGJhY2tlbmQiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhYmFzZSB7XHJcbiAga25leDogYW55XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnA6IFNESykge1xyXG4gICAgdGhpcy5rbmV4ID0gYnAuZGF0YWJhc2VcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUoKSB7XHJcbiAgICBpZiAoIXRoaXMua25leCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGluaXRpYWxpemUgdGhlIGRhdGFiYXNlIGJlZm9yZScpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5rbmV4XHJcbiAgICAgIC5jcmVhdGVUYWJsZUlmTm90RXhpc3RzKCdyZWdpc3RyeV9ib29rcycsIGZ1bmN0aW9uICh0YWJsZSkge1xyXG4gICAgICAgIHRhYmxlLmluY3JlbWVudHMoJ2lkJykudW5zaWduZWQoKS5wcmltYXJ5KClcclxuICAgICAgICAvLyBJZCBmcm9tIHRoZSBCb3RcclxuICAgICAgICB0YWJsZS5zdHJpbmcoJ2JvdElkJylcclxuICAgICAgICAvLyBSZWdpc3RyeSBjYXRlZ29yeVxyXG4gICAgICAgIHRhYmxlLnN0cmluZygnY2F0ZWdvcnknKVxyXG4gICAgICAgIC8vIFVzZWQgdG8gaW50ZXJuYWx5IGNoZWNrIGlmIHRoZSBkYXRhIGlzIGVxdWFsXHJcbiAgICAgICAgdGFibGUudGV4dCgnZGF0YV9rZXknKVxyXG4gICAgICAgIC8vIERhdGEgU3RvcmVkXHJcbiAgICAgICAgdGFibGUudGV4dCgnZGF0YScpXHJcbiAgICAgICAgLy8gRGF0ZSBpbiB3aGljaCB0aGUgZGF0YSB3YXMgc3RvcmVkXHJcbiAgICAgICAgdGFibGUuZGF0ZSgncmVnaXN0ZXJlZF9vbicpXHJcbiAgICAgICAgLy8gSG93IG1hbnkgdGltZXMgdGhpcyBkYXRhIHdhcyBzdG9yZWQgKHNhbWUgY2F0ZWdvcnkgYW5kIGRhdGUpXHJcbiAgICAgICAgdGFibGUuaW50ZWdlcignaGl0X2NvdW50JylcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5rbmV4KVxyXG4gIH1cclxufSJdfQ==