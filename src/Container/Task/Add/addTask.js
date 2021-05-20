import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as action from '../Action';
import { Row, Col, Button } from 'reactstrap';
import './AddEdit.css';

const AddTitleComponent = (props) => {
    const [title, setTitle] = useState('');
    const [list, setList] = useState([]);
    const [isAdd, setAdd] = useState(false);
    const [counter, setCounter] = useState(120);
    const [status, setStatus] = useState("");

    /*
    ** when status or counter values update, then this function call and start the timer
    */
    useEffect(() => {
        let counterId;
        if (status === "working") {
            counterId = setTimeout(() => {
                setCounter(counter => {
                    if (counter !== 0) {
                        const updatedCounter = counter - 1;
                        return updatedCounter;
                    }
                    return 0;
                });
            }, 1000);
        }

        return () => {
            clearTimeout(counterId);
        };
    }, [counter, status]);

    /*
    ** when list is update into Redux, then this function call and set the lates list values
    */
    useEffect(() => {
        if (props.list) {
            setList(props.list);
        }
    }, [props.list]);

    /*
    ** start timer function call and set the initial values of timer
    */
    const startTimer = (e) => {
        e.preventDefault();
        setStatus("working");
        setCounter(120);
        setAdd(true);
    };

    /*
   ** save the title and call addNewTask() method and updated the Redux store
   */
    const saveHandler = (e) => {
        e.preventDefault();
        props.addNewTask({ title: title, time: counter !== 0 ? true : false });
        setTitle('');
        setAdd(false);
        setCounter(120);
    }

    /*
   ** if don't want add the title then, call this function
   */
    const cancelHandler = (e) => {
        e.preventDefault();
        setTitle('');
        setAdd(false);
        setCounter(120);
    }

    return (
        <div>
            <div style={{ padding: '4%' }}>
                <div >
                    <form >
                        <Row>
                            <Col>
                                <button onClick={(e) => startTimer(e)}>Add</button>
                            </Col>
                        </Row>
                        {isAdd && (
                            <Row>
                                <Col>
                                    <textarea rows="4" cols="50"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    {`Timer: ${counter}`}
                                </Col>
                            </Row>
                        )}
                        <Row>
                        </Row>
                        {isAdd && (
                            <Row>
                                <Col className="add-style">
                                    <Button style={{ backgroundColor: '#6384f9', width: '18%' }}
                                        onClick={(e) => saveHandler(e)}
                                    >Add</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                     <Button style={{ backgroundColor: '#6384f9' }}
                                        onClick={(e) => cancelHandler(e)}
                                    >Cancel</Button>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col className="col-12">
                                <table className="table-style">
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                    </tr>
                                    {list && list.map((val, index) => {
                                        return (
                                            <tr key={index} className={`${val.time ? 'row-green' : 'row-red'}`}>
                                                <td>{index + 1}</td>
                                                <td>{val.title}</td>
                                            </tr>
                                        )
                                    })}
                                </table>
                            </Col>
                        </Row>
                    </form>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        list: state.task.taskList,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        ...action
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTitleComponent);
