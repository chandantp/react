import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class UserList extends React.Component {

    constructor() {
        super()
        this.state = {
            searchKey: '',
            users: [],
            fetchInProgress: false
        }
    }

    fetchUsers(key) {
        if (!this.state.fetchInProgress && key.length >= 3) {
            console.log("fetchUsers: fetching users for key = " + key);
            fetch("https://api.github.com/search/users?page=1&per_page=100&q=" + key)
                .then(response => {
                    if (!response.ok) {
                        alert("API error: " + response.statusText);
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then(response => response.json())
                .then(result => {
                    this.setState({ 
                        users: result.items,
                        fetchInProgress: false
                    });
                    console.log("fetchUsers: users.length = " + result.items.length + " for key = " + key);
                }).catch(function(error) {
                    console.log(error);
                });
        }
    }

    shouldComponentUpdate(np, ns) {
        if (ns.searchKey !== this.state.searchKey) {
            this.fetchUsers(ns.searchKey);
        }
        return true;
    }

    componentDidUpdate() {
        console.log("componentDidUpdate : State = " + 
            this.state.searchKey + " : " + this.state.users.length + " : " + this.state.fetchInProgress);   
    }

    updateSearchKey(evt) {
        this.setState({
            searchKey: evt.target.value,
            users: [],
            fetchInProgress: evt.target.value.length >= 3 ? true : false
        });
    }

    render() {
        const rows = []
        this.state.users.forEach(user => {
            rows.push(
                <tr key={user.login} >
                    <td><img src={user.avatar_url} alt={user.login} width="30" height="30" /></td>
                    <td>{user.login}</td>
                    <td>{user.type}</td>
                    <td>{user.score}</td>
                </tr>
            );
        });

        const busyText = this.state.fetchInProgress ? "busy" : "notbusy";
        const busyVisibility = this.state.fetchInProgress ? "visible" : "hidden";
        const readonlyOpts = {};
        if (this.state.fetchInProgress) {
            readonlyOpts['readOnly'] = 'readOnly';
        }

        return (
            <div>
                <div>
                    <label>Search Github Users: </label>
                    <input type="text" name="searchtext" onChange={evt => this.updateSearchKey(evt)} {...readonlyOpts} />
                    <img id="busy" src="busy.gif" alt={busyText} width="30" height="30" style={{visibility: busyVisibility }} />
                </div>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Login</th>
                            <th>Type</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
}

ReactDOM.render(
    <UserList />,
    document.getElementById('app')
)
