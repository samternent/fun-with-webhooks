import {createStore, getStore} from 'tbg-flux-factory';
import request from 'reqwest';

var authStore = getStore('auth');

function fetchTWhooks () {
  const { baseURL, auth_token } = authStore.getState()

  return request({
    url: `${baseURL}/webhooks/events.json`,
    type: 'json',
    method: 'get',
    contentType: 'application/json',
    headers: {
      "Authorization": "BASIC " +  auth_token,
    },
    crossOrigin: true,
  })
}

function fetchTWtags () {
  const { baseURL, auth_token } = authStore.getState()

  return request({
    url: `${baseURL}/tags.json`,
    type: 'json',
    method: 'get',
    contentType: 'application/json',
    headers: {
      "Authorization": "BASIC " +  auth_token,
    },
    crossOrigin: true,
  })
}

const demo = createStore({
  name: 'demo',
  data: {
    loading: false,
    hooks: {
      teamwork: [],
      github: []
    },
    providers: {
      teamwork: {
        name: 'teamwork',
        hooks: [],
        tags: [],
      },
      github: {
        name: 'github',
        hooks: []
      }
    },
    provider: null,
    action: {
      provider: null,
      hook: null,
      tags: [],
      action: null
    }
  },
  actions: {
    server: {
      getHooks(provider) {
        this.setState({ loading: true })

        if (provider === 'teamwork') {
          fetchTWhooks()
          .then((resp) => {
            const { providers } = this.getState()

            providers.teamwork.hooks = resp.events

            this.setState({ providers })
          })
          .always( () => {
            this.setState({ loading: false })
          })
        }
      },

      getTags(provider) {
        this.setState({ loading: true })

        if (provider === 'teamwork') {
          fetchTWtags()
          .then((resp) => {
            const { providers } = this.getState()

            providers.teamwork.tags = resp.tags

            this.setState({ providers })
          })
          .always( () => {
            this.setState({ loading: false })
          })
        }
      }
    },

    view: {
      addTag(tag) {
        const { action } = this.getState()

        if (action.tags.indexOf(tag) > -1) {
          action.tags.splice(action.tags.indexOf(tag), 1)
        } else {
          action.tags.push(tag)
        }

        this.setState({action: Object.assign({}, action) })
      },

      setHook(hook) {
        const { action } = this.getState()

        action.hook = hook

        this.setState({action: Object.assign({}, action) })
      }
    }
  }
});

export default demo;
