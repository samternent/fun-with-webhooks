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

const demo = createStore({
  name: 'demo',
  data: {
    loading: false,
    twhooks: [],
  },
  actions: {
    server: {
      getTWhooks() {
        this.setState({ loading: true })

        fetchTWhooks()
        .then((resp) => {
          this.setState({ twhooks: resp.events })
        })
        .always( () => {
          this.setState({ loading: false })
        })
      }
    }
  }
});

export default demo;
