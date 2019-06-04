"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FILENAME_REGEX = /^[0-9a-zA-Z_\-.]+$/;

class Editor {
  constructor(bp, botId, config) {
    _defineProperty(this, "bp", void 0);

    _defineProperty(this, "_botId", void 0);

    _defineProperty(this, "_typings", void 0);

    _defineProperty(this, "_config", void 0);

    this.bp = bp;
    this._botId = botId;
    this._config = config;
  }

  async fetchFiles() {
    return {
      actionsGlobal: this._config.allowGlobal && (await this._loadFiles('/actions', 'action')),
      actionsBot: await this._loadFiles('/actions', 'action', this._botId)
    };
  }

  async _validateMetadata({
    name,
    botId,
    type
  }) {
    if (!botId || !botId.length) {
      if (!this._config.allowGlobal) {
        throw new Error(`Global files are restricted, please check your configuration`);
      }
    } else {
      if (botId !== this._botId) {
        throw new Error(`Please switch to the correct bot to change its actions.`);
      }
    }

    if (type !== 'action') {
      throw new Error('Invalid file type Only actions are allowed at the moment');
    }

    if (!FILENAME_REGEX.test(name)) {
      throw new Error('Filename has invalid characters');
    }
  }

  async saveFile(file) {
    this._validateMetadata(file);

    const {
      location,
      botId,
      content
    } = file;
    const ghost = botId ? this.bp.ghost.forBot(this._botId) : this.bp.ghost.forGlobal();
    return ghost.upsertFile('/actions', location, content);
  }

  async loadTypings() {
    if (this._typings) {
      return this._typings;
    }

    const sdkTyping = _fs.default.readFileSync(_path.default.join(__dirname, '/../botpress.d.js'), 'utf-8');

    this._typings = {
      'process.d.ts': this._buildRestrictedProcessVars(),
      'node.d.ts': this._getNodeTypings().toString(),
      'botpress.d.ts': sdkTyping.toString().replace(`'botpress/sdk'`, `sdk`)
    };
    return this._typings;
  }

  _getNodeTypings() {
    const getTypingPath = folder => _path.default.join(__dirname, `/../../${folder}/@types/node/index.d.ts`);

    if (_fs.default.existsSync(getTypingPath('node_modules'))) {
      return _fs.default.readFileSync(getTypingPath('node_modules'), 'utf-8');
    }

    return _fs.default.readFileSync(getTypingPath('node_production_modules'), 'utf-8');
  }

  async _loadFiles(rootFolder, type, botId) {
    const ghost = botId ? this.bp.ghost.forBot(botId) : this.bp.ghost.forGlobal();
    return Promise.map((await ghost.directoryListing(rootFolder, '*.js')), async filepath => {
      return {
        name: _path.default.basename(filepath),
        location: filepath,
        content: await ghost.readFileAsString(rootFolder, filepath),
        type,
        botId
      };
    });
  }

  _buildRestrictedProcessVars() {
    const exposedEnv = { ..._lodash.default.pickBy(process.env, (_value, name) => name.startsWith('EXPOSED_')),
      ..._lodash.default.pick(process.env, 'TZ', 'LANG', 'LC_ALL', 'LC_CTYPE')
    };

    const root = this._extractInfo(_lodash.default.pick(process, 'HOST', 'PORT', 'EXTERNAL_URL', 'PROXY'));

    const exposed = this._extractInfo(exposedEnv);

    return `
    declare var process: RestrictedProcess;
    interface RestrictedProcess {
      ${root.map(x => {
      return `/** Current value: ${x.value} */
${x.name}: ${x.type}
`;
    })}

      env: {
        ${exposed.map(x => {
      return `/** Current value: ${x.value} */
  ${x.name}: ${x.type}
  `;
    })}
      }
    }`;
  }

  _extractInfo(keys) {
    return Object.keys(keys).map(name => {
      return {
        name,
        value: keys[name],
        type: typeof keys[name]
      };
    });
  }

}

exports.default = Editor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRvci50cyJdLCJuYW1lcyI6WyJGSUxFTkFNRV9SRUdFWCIsIkVkaXRvciIsImNvbnN0cnVjdG9yIiwiYnAiLCJib3RJZCIsImNvbmZpZyIsIl9ib3RJZCIsIl9jb25maWciLCJmZXRjaEZpbGVzIiwiYWN0aW9uc0dsb2JhbCIsImFsbG93R2xvYmFsIiwiX2xvYWRGaWxlcyIsImFjdGlvbnNCb3QiLCJfdmFsaWRhdGVNZXRhZGF0YSIsIm5hbWUiLCJ0eXBlIiwibGVuZ3RoIiwiRXJyb3IiLCJ0ZXN0Iiwic2F2ZUZpbGUiLCJmaWxlIiwibG9jYXRpb24iLCJjb250ZW50IiwiZ2hvc3QiLCJmb3JCb3QiLCJmb3JHbG9iYWwiLCJ1cHNlcnRGaWxlIiwibG9hZFR5cGluZ3MiLCJfdHlwaW5ncyIsInNka1R5cGluZyIsImZzIiwicmVhZEZpbGVTeW5jIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJfYnVpbGRSZXN0cmljdGVkUHJvY2Vzc1ZhcnMiLCJfZ2V0Tm9kZVR5cGluZ3MiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJnZXRUeXBpbmdQYXRoIiwiZm9sZGVyIiwiZXhpc3RzU3luYyIsInJvb3RGb2xkZXIiLCJQcm9taXNlIiwibWFwIiwiZGlyZWN0b3J5TGlzdGluZyIsImZpbGVwYXRoIiwiYmFzZW5hbWUiLCJyZWFkRmlsZUFzU3RyaW5nIiwiZXhwb3NlZEVudiIsIl8iLCJwaWNrQnkiLCJwcm9jZXNzIiwiZW52IiwiX3ZhbHVlIiwic3RhcnRzV2l0aCIsInBpY2siLCJyb290IiwiX2V4dHJhY3RJbmZvIiwiZXhwb3NlZCIsIngiLCJ2YWx1ZSIsImtleXMiLCJPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBTUEsTUFBTUEsY0FBYyxHQUFHLG9CQUF2Qjs7QUFFZSxNQUFNQyxNQUFOLENBQWE7QUFNMUJDLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBRCxFQUFpQkMsS0FBakIsRUFBZ0NDLE1BQWhDLEVBQWdEO0FB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QTRDLFVBQTVDO0FBRmMsS0FBbkI7O0FBSUEsVUFBTUksSUFBSSxHQUFHLEtBQUtDLFlBQUwsQ0FBa0JSLGdCQUFFTSxJQUFGLENBQU9KLE9BQVAsRUFBZ0IsTUFBaEIsRUFBd0IsTUFBeEIsRUFBZ0MsY0FBaEMsRUFBZ0QsT0FBaEQsQ0FBbEIsQ0FBYjs7QUFDQSxVQUFNTyxPQUFPLEdBQUcsS0FBS0QsWUFBTCxDQUFrQlQsVUFBbEIsQ0FBaEI7O0FBRUEsV0FBUTs7O1FBR0pRLElBQUksQ0FBQ2IsR0FBTCxDQUFTZ0IsQ0FBQyxJQUFJO0FBQ2QsYUFBUSxzQkFBcUJBLENBQUMsQ0FBQ0MsS0FBTTtFQUMzQ0QsQ0FBQyxDQUFDOUMsSUFBSyxLQUFJOEMsQ0FBQyxDQUFDN0MsSUFBSztDQURaO0FBR0QsS0FKQyxDQUlDOzs7VUFHQzRDLE9BQU8sQ0FBQ2YsR0FBUixDQUFZZ0IsQ0FBQyxJQUFJO0FBQ2pCLGFBQVEsc0JBQXFCQSxDQUFDLENBQUNDLEtBQU07SUFDM0NELENBQUMsQ0FBQzlDLElBQUssS0FBSThDLENBQUMsQ0FBQzdDLElBQUs7R0FEWjtBQUdELEtBSkMsQ0FJQzs7TUFkUDtBQWlCRDs7QUFFTzJDLEVBQUFBLFlBQVIsQ0FBcUJJLElBQXJCLEVBQTJCO0FBQ3pCLFdBQU9DLE1BQU0sQ0FBQ0QsSUFBUCxDQUFZQSxJQUFaLEVBQWtCbEIsR0FBbEIsQ0FBc0I5QixJQUFJLElBQUk7QUFDbkMsYUFBTztBQUFFQSxRQUFBQSxJQUFGO0FBQVErQyxRQUFBQSxLQUFLLEVBQUVDLElBQUksQ0FBQ2hELElBQUQsQ0FBbkI7QUFBMkJDLFFBQUFBLElBQUksRUFBRSxPQUFPK0MsSUFBSSxDQUFDaEQsSUFBRDtBQUE1QyxPQUFQO0FBQ0QsS0FGTSxDQUFQO0FBR0Q7O0FBckh5QiIsInNvdXJjZVJvb3QiOiJEOlxcQ29kaWdvIEJvdHByZXNzXFxib3RwcmVzc1xcbW9kdWxlc1xcY29kZS1lZGl0b3JcXHNyY1xcYmFja2VuZCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNkayBmcm9tICdib3RwcmVzcy9zZGsnXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5cclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuaW1wb3J0IHsgRWRpdGFibGVGaWxlLCBGaWxlVHlwZSwgVHlwaW5nRGVmaW5pdGlvbnMgfSBmcm9tICcuL3R5cGluZ3MnXHJcblxyXG5jb25zdCBGSUxFTkFNRV9SRUdFWCA9IC9eWzAtOWEtekEtWl9cXC0uXSskL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdG9yIHtcclxuICBwcml2YXRlIGJwOiB0eXBlb2Ygc2RrXHJcbiAgcHJpdmF0ZSBfYm90SWQ6IHN0cmluZ1xyXG4gIHByaXZhdGUgX3R5cGluZ3M6IFR5cGluZ0RlZmluaXRpb25zXHJcbiAgcHJpdmF0ZSBfY29uZmlnOiBDb25maWdcclxuXHJcbiAgY29uc3RydWN0b3IoYnA6IHR5cGVvZiBzZGssIGJvdElkOiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKSB7XHJcbiAgICB0aGlzLmJwID0gYnBcclxuICAgIHRoaXMuX2JvdElkID0gYm90SWRcclxuICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZ1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZmV0Y2hGaWxlcygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGFjdGlvbnNHbG9iYWw6IHRoaXMuX2NvbmZpZy5hbGxvd0dsb2JhbCAmJiAoYXdhaXQgdGhpcy5fbG9hZEZpbGVzKCcvYWN0aW9ucycsICdhY3Rpb24nKSksXHJcbiAgICAgIGFjdGlvbnNCb3Q6IGF3YWl0IHRoaXMuX2xvYWRGaWxlcygnL2FjdGlvbnMnLCAnYWN0aW9uJywgdGhpcy5fYm90SWQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBfdmFsaWRhdGVNZXRhZGF0YSh7IG5hbWUsIGJvdElkLCB0eXBlIH06IFBhcnRpYWw8RWRpdGFibGVGaWxlPikge1xyXG4gICAgaWYgKCFib3RJZCB8fCAhYm90SWQubGVuZ3RoKSB7XHJcbiAgICAgIGlmICghdGhpcy5fY29uZmlnLmFsbG93R2xvYmFsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBHbG9iYWwgZmlsZXMgYXJlIHJlc3RyaWN0ZWQsIHBsZWFzZSBjaGVjayB5b3VyIGNvbmZpZ3VyYXRpb25gKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoYm90SWQgIT09IHRoaXMuX2JvdElkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQbGVhc2Ugc3dpdGNoIHRvIHRoZSBjb3JyZWN0IGJvdCB0byBjaGFuZ2UgaXRzIGFjdGlvbnMuYClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlICE9PSAnYWN0aW9uJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZmlsZSB0eXBlIE9ubHkgYWN0aW9ucyBhcmUgYWxsb3dlZCBhdCB0aGUgbW9tZW50JylcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUZJTEVOQU1FX1JFR0VYLnRlc3QobmFtZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlbmFtZSBoYXMgaW52YWxpZCBjaGFyYWN0ZXJzJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIHNhdmVGaWxlKGZpbGU6IEVkaXRhYmxlRmlsZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5fdmFsaWRhdGVNZXRhZGF0YShmaWxlKVxyXG4gICAgY29uc3QgeyBsb2NhdGlvbiwgYm90SWQsIGNvbnRlbnQgfSA9IGZpbGVcclxuICAgIGNvbnN0IGdob3N0ID0gYm90SWQgPyB0aGlzLmJwLmdob3N0LmZvckJvdCh0aGlzLl9ib3RJZCkgOiB0aGlzLmJwLmdob3N0LmZvckdsb2JhbCgpXHJcblxyXG4gICAgcmV0dXJuIGdob3N0LnVwc2VydEZpbGUoJy9hY3Rpb25zJywgbG9jYXRpb24sIGNvbnRlbnQpXHJcbiAgfVxyXG5cclxuICBhc3luYyBsb2FkVHlwaW5ncygpIHtcclxuICAgIGlmICh0aGlzLl90eXBpbmdzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl90eXBpbmdzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2RrVHlwaW5nID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICcvLi4vYm90cHJlc3MuZC5qcycpLCAndXRmLTgnKVxyXG5cclxuICAgIHRoaXMuX3R5cGluZ3MgPSB7XHJcbiAgICAgICdwcm9jZXNzLmQudHMnOiB0aGlzLl9idWlsZFJlc3RyaWN0ZWRQcm9jZXNzVmFycygpLFxyXG4gICAgICAnbm9kZS5kLnRzJzogdGhpcy5fZ2V0Tm9kZVR5cGluZ3MoKS50b1N0cmluZygpLFxyXG4gICAgICAnYm90cHJlc3MuZC50cyc6IHNka1R5cGluZy50b1N0cmluZygpLnJlcGxhY2UoYCdib3RwcmVzcy9zZGsnYCwgYHNka2ApXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3R5cGluZ3NcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2dldE5vZGVUeXBpbmdzKCkge1xyXG4gICAgY29uc3QgZ2V0VHlwaW5nUGF0aCA9IGZvbGRlciA9PiBwYXRoLmpvaW4oX19kaXJuYW1lLCBgLy4uLy4uLyR7Zm9sZGVyfS9AdHlwZXMvbm9kZS9pbmRleC5kLnRzYClcclxuXHJcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhnZXRUeXBpbmdQYXRoKCdub2RlX21vZHVsZXMnKSkpIHtcclxuICAgICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhnZXRUeXBpbmdQYXRoKCdub2RlX21vZHVsZXMnKSwgJ3V0Zi04JylcclxuICAgIH1cclxuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoZ2V0VHlwaW5nUGF0aCgnbm9kZV9wcm9kdWN0aW9uX21vZHVsZXMnKSwgJ3V0Zi04JylcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgX2xvYWRGaWxlcyhyb290Rm9sZGVyOiBzdHJpbmcsIHR5cGU6IEZpbGVUeXBlLCBib3RJZD86IHN0cmluZyk6IFByb21pc2U8RWRpdGFibGVGaWxlW10+IHtcclxuICAgIGNvbnN0IGdob3N0ID0gYm90SWQgPyB0aGlzLmJwLmdob3N0LmZvckJvdChib3RJZCkgOiB0aGlzLmJwLmdob3N0LmZvckdsb2JhbCgpXHJcblxyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKGF3YWl0IGdob3N0LmRpcmVjdG9yeUxpc3Rpbmcocm9vdEZvbGRlciwgJyouanMnKSwgYXN5bmMgKGZpbGVwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBwYXRoLmJhc2VuYW1lKGZpbGVwYXRoKSxcclxuICAgICAgICBsb2NhdGlvbjogZmlsZXBhdGgsXHJcbiAgICAgICAgY29udGVudDogYXdhaXQgZ2hvc3QucmVhZEZpbGVBc1N0cmluZyhyb290Rm9sZGVyLCBmaWxlcGF0aCksXHJcbiAgICAgICAgdHlwZSxcclxuICAgICAgICBib3RJZFxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfYnVpbGRSZXN0cmljdGVkUHJvY2Vzc1ZhcnMoKSB7XHJcbiAgICBjb25zdCBleHBvc2VkRW52ID0ge1xyXG4gICAgICAuLi5fLnBpY2tCeShwcm9jZXNzLmVudiwgKF92YWx1ZSwgbmFtZSkgPT4gbmFtZS5zdGFydHNXaXRoKCdFWFBPU0VEXycpKSxcclxuICAgICAgLi4uXy5waWNrKHByb2Nlc3MuZW52LCAnVFonLCAnTEFORycsICdMQ19BTEwnLCAnTENfQ1RZUEUnKVxyXG4gICAgfVxyXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuX2V4dHJhY3RJbmZvKF8ucGljayhwcm9jZXNzLCAnSE9TVCcsICdQT1JUJywgJ0VYVEVSTkFMX1VSTCcsICdQUk9YWScpKVxyXG4gICAgY29uc3QgZXhwb3NlZCA9IHRoaXMuX2V4dHJhY3RJbmZvKGV4cG9zZWRFbnYpXHJcblxyXG4gICAgcmV0dXJuIGBcclxuICAgIGRlY2xhcmUgdmFyIHByb2Nlc3M6IFJlc3RyaWN0ZWRQcm9jZXNzO1xyXG4gICAgaW50ZXJmYWNlIFJlc3RyaWN0ZWRQcm9jZXNzIHtcclxuICAgICAgJHtyb290Lm1hcCh4ID0+IHtcclxuICAgICAgICByZXR1cm4gYC8qKiBDdXJyZW50IHZhbHVlOiAke3gudmFsdWV9ICovXHJcbiR7eC5uYW1lfTogJHt4LnR5cGV9XHJcbmBcclxuICAgICAgfSl9XHJcblxyXG4gICAgICBlbnY6IHtcclxuICAgICAgICAke2V4cG9zZWQubWFwKHggPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGAvKiogQ3VycmVudCB2YWx1ZTogJHt4LnZhbHVlfSAqL1xyXG4gICR7eC5uYW1lfTogJHt4LnR5cGV9XHJcbiAgYFxyXG4gICAgICAgIH0pfVxyXG4gICAgICB9XHJcbiAgICB9YFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZXh0cmFjdEluZm8oa2V5cykge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGtleXMpLm1hcChuYW1lID0+IHtcclxuICAgICAgcmV0dXJuIHsgbmFtZSwgdmFsdWU6IGtleXNbbmFtZV0sIHR5cGU6IHR5cGVvZiBrZXlzW25hbWVdIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiJdfQ==