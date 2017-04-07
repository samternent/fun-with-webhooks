import {createStore, getStore} from 'tbg-flux-factory';
import request from 'reqwest';

const defaultData = {
  loading: false,
  hooks: {
    teamwork: [],
    github: [],
    twitter: []
  },
  actionCards: [],
  actions: {
    teamwork: [],
    github: [
      {
        provider: 'github',
        name: 'CREATE.ISSUE'
      }
    ],
    twitter: [
      {
        provider: 'twitter',
        name: 'TWEET'
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
    },
    twitter: {
      name: 'twitter',
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

function postTWhook (name) {
  const { baseURL, auth_token } = authStore.getState()

  return request({
    url: `${baseURL}/webhooks.json`,
    type: 'json',
    method: 'post',
    contentType: 'application/json',
    headers: {
      "Authorization": "BASIC " +  auth_token,
    },
    crossOrigin: true,
    data: JSON.stringify({
        webhook: {
        event: name,
        url: 'http://dth.teamworksam.ultrahook.com/dahook'
      }
    })
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

        postTWhook(action.hook)
        .then((resp) => {
          postAction(action)
          .then(() => {
            const { actionCards } = this.getState()
            actionCards.push(Object.assign({}, action))
            this.setState({actionCards});
          })
          .always( () => {
            this.setState({ loading: false })
          })
        })
      }
    },

    view: {
      addTag(tag) {
        const { action } = this.getState()
        const tags = action.tags.slice(0)

        if (tags.indexOf(tag) > -1) {
          tags.splice(tags.indexOf(tag), 1)
        } else {
          tags.push(tag)
        }

        action.tags = tags

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
