import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Users from './pages/Users';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div id="App">
                <HashRouter>
                    <Switch>
                        <Layout>
                            <Route exact path="/" component={Home} />
                            <Route path="/users" component={Users} />
                        </Layout>
                    </Switch>
                </HashRouter>
            </div>
        )
    }
}

export default App;
