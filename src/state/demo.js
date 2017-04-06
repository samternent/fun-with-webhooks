import {createStore, getStore} from 'tbg-flux-factory';
import request from 'reqwest';

const defaultData = {
  loading: false,
  hooks: {
    teamwork: [],
    github: []
  },
  actionCards: [],
  actions: {
    teamwork: [],
    github: [
      {
        provider: 'github',
        name: 'CREATE.ISSUE',
        fields: {
          title: '',
          body: '',
          labels: [],
        }
      }
    ]
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
    action: null,
    actionProvider: null
  }
};


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

function postAction (data) {
  return request({
    url: '/action',
    type: 'json',
    method: 'post',
    contentType: 'application/json',
    data: JSON.stringify(data)
  })
}

function fetchActions () {
  return request({
    url: '/actions',
    type: 'json',
    method: 'get',
    contentType: 'application/json'
  })
}

const demo = createStore({
  name: 'demo',
  data: Object.assign({}, defaultData),
  actions: {
    server: {
      getHooks(provider) {
        this.setState({ loading: true })
        var action = provider || this.getState().action.provider

        if (action === 'teamwork') {
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

      getActions() {
        this.setState({ loading: true })

        fetchActions()
        .then((resp) => {
          this.setState({ actionCards: resp.actions })
        })
        .always( () => {
          this.setState({ loading: false })
        })
      },

      getTags(provider) {
        this.setState({ loading: true })
        var action = provider || this.getState().action.provider

        if (action === 'teamwork') {
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
      },

      postAction() {
        this.setState({ loading: true })

        const {action} = this.getState()

        postAction(action)
        .then((resp) => {
          const { actionCards } = this.getState()
          actionCards.push(action)
          this.setState({actionCards});
        })
        .always( () => {
          this.setState({ loading: false })
        })
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
      },

      setActionProvider(provider) {
        const { action } = this.getState()

        action.actionProvider = provider

        this.setState({action: Object.assign({}, action) })
      },

      setAction(actionType) {
        const { action } = this.getState()

        action.action = actionType

        this.setState({action: Object.assign({}, action) })
      }
    }
  }
});

export default demo;
