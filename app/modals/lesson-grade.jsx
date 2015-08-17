
'use strict'
require("./lesson-grade.css")
var React = require('react');
var Modal = require('./modal');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var LessonStore = require('../stores/lessonStore');

var _lesson = {
    "Id": "aksdkas;ajf",
    "Title": "Lesson 2",
    "ScoreReq": 80,
    "ShowKeyboard": true,
    "NewKeys": [
        "D",
        "K"
    ],
    "FingerGroupsToShow": [
        "home-key" ],
    "Sections": [
        {
            "Id": "1",
            "Title": "Section 1",
            "Instructions": "Just type whatever is in this section. There are no special instructions, I just want a paragraph here to see what its appearance is and to style it properly.",
            "Work": "dKd"
        },
        {
            "Id": "2",
            "Title": "Section 2",
            "Instructions": "Are you getting tired of this yet? Ha! just wait till you see the next lesson. You'll wish you were still doing this one!",
            "Work": "dd kk"
        }
    ]
};
module.exports = React.createClass({

    getInitialState() {
        return { errorData: LessonStore.getErrorDataUnique(),
            scoreReq: LessonStore.getLesson().ScoreReq,
            score: LessonStore.getScore(),
            allowRedo: LessonStore.getLesson().AllowRedo
        };
    },

    render() {
        return <Modal footer={this.renderButtons()}>
            <div className='lesson-grade' onKeyDown={this.handleKeyDown}>
                <div className='lesson-info'>
                    <table>
                        <caption>Lesson Detail</caption>
                        <tr>
                            <th colSpan='2'>{LessonStore.getLesson().Title}</th>
                        </tr>
                        <tr>
                            <th>Characters</th>
                            <td>{LessonStore.getLessonCharCount()}</td>
                        </tr>
                        <tr>
                            <th>Errors</th>
                            <td>{LessonStore.getTotalErrors()}</td>
                        </tr>
                        <tfoot>
                            <tr>
                                <th>Score</th>
                                <td>{this.state.score}%</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className='error-info'>
                    <table>
                        <caption>Error Detail</caption>
                        <tr>
                            <th>Key</th>
                            <th>Typed</th>
                            <th>Count</th>
                        </tr>
                        {this.renderErrors()}
                        <tfoot>
                            <tr>
                                <td colSpan="2">Total</td>
                                <td>{LessonStore.getTotalErrors()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </Modal>;
    },

    renderErrors() {
        return this.state.errorData.map(this.renderError);
    },

    renderError(err) {
        return <tr>
            <td>{err.correctKey}</td>
            <td>{err.typedKey}</td>
            <td>{err.count}</td>
        </tr>
    },

    renderButtons() {
        return <div>
            {this.renderRestart()}
            {this.renderNext()}
        </div>;
    },

    renderNext() {
        if (this.mayDoNext() === true)
            return <button onClick={this.handleNext}>Next Lesson</button>;
        else
            return null;
    },

    renderRestart() {
        if (this.mayRestart() === true)
            return null;

        return <button onClick={this.handleRestart}>Restart Lesson</button>;
    },

    mayDoNext() {
        return this.state.allowRedo === false || this.state.score >= this.state.scoreReq;
    },

    mayRestart() {
        return this.state.allowRedo === false;
    },

    handleKeyDown(e) {
        e.preventDefault();
        switch (e.keyCode) {
            case 13:
                if (this.mayDoNext() === true)
                    this.handleNext();
                else {
                    if (this.mayRestart() === true)
                        this.handleRestart();
                }
                break;
            case 27:
                if (this.mayRestart() === true)
                    this.handleRestart();
                break;
        }
    },

    handleRestart() {
        var lesson = LessonStore.getLesson();
        AppDispatcher.handleViewAction({
            actionType: 'SET_LESSON',
            lesson: lesson
        }, this.clearModal());
    },

    handleNext() {
        AppDispatcher.handleViewAction({
            actionType: 'SET_LESSON',
            lesson: _lesson
        }, this.clearModal());
    },

    clearModal() {
        AppDispatcher.handleViewAction({
            actionType: 'CLEAR_MODAL'
        });

    }
});
