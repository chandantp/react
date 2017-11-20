import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'; 
import './index.css';

class PicturesList extends React.Component {

    constructor() {
        super()
        this.state = {
            searchKey: '',
            pics: [],
            fetchInProgress: false
        }
    }

    fetchPictures(key) {
        if (!this.state.fetchInProgress && key.length >= 1) {
            console.log("fetchPictures: fetching pics for key = " + key);
            var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?&tagmode=any&tags=" + key + "&jsoncallback=?";
            $.getJSON(flickerAPI, {
                format: "json"
            })
            .done(data => this.setState({ 
                pics: data.items,
                fetchInProgress: false
            }));
        }
    }

    shouldComponentUpdate(np, ns) {
        if (ns.searchKey !== this.state.searchKey) {
            this.fetchPictures(ns.searchKey);
        }
        return true;
    }

    componentDidUpdate() {
        console.log("componentDidUpdate : State = " + 
            this.state.searchKey + " : " + this.state.pics.length + " : " + this.state.fetchInProgress);   
    }

    updateSearchKey(evt) {
        this.setState({
            searchKey: evt.target.value,
            pics: [],
            fetchInProgress: evt.target.value.length >= 1 ? true : false
        });
    }

    render() {
        const rows = []
        this.state.pics.forEach(pic => {
            const tags = pic.tags.replace(/\s/g, ", ");
            rows.push(
                <tr>
                    <td><a href={pic.link} target="_blank"><img src={pic.media.m} alt={pic.author_id} width="30" height="30" /></a></td>
                    <td>{pic.author}</td>
                    <td>{tags}</td>
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
                    <label>Flickr Search: </label>
                    <input type="text" name="searchtext" onChange={evt => this.updateSearchKey(evt)} {...readonlyOpts} />
                    <img id="busy" src="busy.gif" alt={busyText} width="30" height="30" style={{visibility: busyVisibility }} />
                </div>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Picture</th>
                            <th>Author</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
}

ReactDOM.render(
    <PicturesList />,
    document.getElementById('app')
)
