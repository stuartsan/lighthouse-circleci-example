import React, { Component } from "react";
import axios from "axios";
import { withAuthenticator } from "aws-amplify-react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import dog from "./dog.png";
import "./App.css";

Amplify.configure(aws_exports);

const Index = () => (
  <div className="center-align">
    <h2>"k8s for k9s"</h2>
    <p className="flow-text">
      Premium kube training videos for (hu)man's best friend
    </p>
    <p>
      <img
        src={dog}
        className="z-depth-2 responsive-img"
        alt="Literal dog steering the metaphorical ship of container orchestration"
      />
    </p>
  </div>
);

class Dashboard extends Component {
  componentWillMount() {
    axios
      .get("https://hn.algolia.com/api/v1/search?query=dogs")
      .then(response => {
        this.setState({
          hits: response.data.hits
        });
      });
  }
  render() {
    if (!this.state || !this.state.hits || !this.state.hits.length) {
      return null;
    }

    return (
      <ul className="dashboard row">
        {this.state.hits.map(item => (
          <li className="" key={item.objectID}>
            <div className="col s12 m3">
              <div className="card">
                <div className="card-image">
                  <img src="https://picsum.photos/200?image=1025" alt="" />
                  <span className="card-title">{item.title}</span>
                </div>
                <div className="card-action">
                  <a href={item.url}>Learn more</a>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

const App = () => (
  <Router>
    <div className="app">
      <main className="container">
        <nav>
          <div className="nav-wrapper blue">
            <h1>
              <Link to="/" className="brand-logo">
                Kubernetes For Dogs
              </Link>
            </h1>
            <ul id="nav-mobile" className="right ">
              <li>
                <Link to="/dashboard/">
                  <strong>Log in</strong>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Route path="/" exact component={Index} />
        <Route
          path="/dashboard/"
          component={withAuthenticator(Dashboard, true)}
        />
      </main>
      <footer className="page-footer blue darken-4">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">Words</h5>
              <p className="grey-text text-lighten-4">
                NGINX INGRESS doggie treats
              </p>
              <p className="grey-text text-lighten-4">
                ConfigMap + Dog Parks + rolling deploys
              </p>
              <p className="grey-text text-lighten-4">
                Pod stuck in status terminating -- WOOF!
              </p>
            </div>
            <div className="col l4 offset-l2 s12">
              <h5 className="white-text">Links</h5>
              <ul>
                <li>
                  <a
                    className="grey-text text-lighten-3"
                    href="https://github.com/stuartsan/lh-cci"
                  >
                    Hi this is not a real website it is a demo used in another
                    project, click here to learn more!
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">© undefined is not a function</div>
        </div>
      </footer>
    </div>
  </Router>
);

export default App;
