import React, { Component } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from 'axios';
import Card from './card';
import './card.css';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            page: 1,
            per_page: 10,
            hasMore: true,
        }
    }

    componentDidMount() {
        this.getPhotoList();
    }

    /*
    ** called the API and send @params, page and page_size
    */
    getPhotoList = () => {
        Axios.get('https://api.instantwebtools.net/v1/passenger?page=' + this.state.page + '&size=' + this.state.per_page
        )
            .then((res) => {
                this.setState({ list: res && res.data.data, apiError: false });
            })
            .catch((error) => {
                console.log('error', error)
            })
    }

    /*
    ** when scrollbar go to down, then this function and update the API params
    */
    fetchMoreData = () => {
        if (this.state.list.length < 50) {
            this.setState({ per_page: this.state.per_page + 10 }, () => {
                this.getPhotoList();
            })
        }
        else {
            this.setState({ hasMore: false });
        }
    }

    render() {
        return (
            <div className="margin-style">
                <div className="button-position">
                    <button className="button-style" onClick={() => this.props.history.push('/task/new')}>
                        Go to Task List
                </button>
                </div>
                <InfiniteScroll
                    dataLength={this.state.per_page}
                    next={() => this.fetchMoreData('pending')}
                    hasMore={this.state.hasMore}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <Card
                        list={this.state.list}
                        clickOnPhoto={this.clickOnPhotoHandler}
                    />
                </InfiniteScroll>
            </div>
        )
    }
}
