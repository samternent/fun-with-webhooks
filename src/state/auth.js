import {createStore} from 'tbg-flux-factory';
import request from 'reqwest';


function authenticate(baseURL, auth_token) {
  return request({
    url: `${baseURL}/authenticate.json`,
    type: 'json',
    method: 'get',
    contentType: 'application/json',
    headers: {
      "Authorization": "BASIC " +  auth_token,
    },
    crossOrigin: true,
  })
}

function setServerSession (baseURL, auth_token) {
  return request({
    url: '/api/setSession',
    type: 'json',
    method: 'post',
    data: {
      baseURL: baseURL,
      auth_token: auth_token
    }
  })
}

const authStore = createStore({
  name: 'auth',
  data: {
    loading: true,
    loggedIn: false,
    baseURL: null,
    auth_token: null,
    account: {},
  },
  actions: {
    server: {
      login({teamname, APIKey}) {
        const baseURL = `http${window.dev ? '' : 's'}://${teamname}.teamwork.${window.dev ? 'dev' : 'com'}`;
        const auth_token = new Buffer(APIKey + ":xxx").toString("base64");

        this.setState({ loading: true })

        authenticate(baseURL, auth_token)
        .then((resp) => {
          localStorage.setItem('baseURL', baseURL)
          localStorage.setItem('auth_token', auth_token)

          this.setState({ baseURL, auth_token, loggedIn: true, account: resp.account })

          setServerSession( baseURL, auth_token)
        })
        .always(() => {
          this.setState({ loading: false })
        })
      },
      logout() {
        localStorage.removeItem('baseURL')
        localStorage.removeItem('auth_token')

        this.setState({ baseURL: null, auth_token: null, loggedIn: false, loading: false })
      },
      getSession() {
        const baseURL = localStorage.getItem("baseURL");
        const auth_token = localStorage.getItem("auth_token");

        if (!baseURL || !auth_token) return this.setState({ loading: false });

        this.setState({ loading: true })

        authenticate(baseURL, auth_token)
        .then((resp) => {
          this.setState({ baseURL, auth_token, loggedIn: true, account: resp.account })

          setServerSession(baseURL, auth_token)
        })
        .always(() => {
          this.setState({ loading: false })
        })
      }
    }
  }
});

export default authStore;
