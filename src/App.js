import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useAxios from './hooks/useAxios';
import axios from 'axios';
import Env from './Env';

function App() {

    // Custom Hooks
    const [setUsersSurveysApi, usersSurveysLoading, usersSurveysResponse, usersSurveysErrors] = useAxios();

    // States
    const [codeInput, setCodeInput] = useState('');

    // Use Effects
    useEffect(() => {
        axios.defaults.baseURL = Env.apiUrl;
    }, []);

    // Functions
    const codeInputFormSubmit = (e) => {
        e.preventDefault();

        setUsersSurveysApi({
            url: 'users-surveys?code=' + codeInput
        });
    }

    return (
        <div className="container py-5">
            <form className="border rounded d-flex p-3 mb-3" onSubmit={codeInputFormSubmit}>
                <input className="flex-grow-1 border me-3 rounded px-3" value={codeInput} onChange={e => setCodeInput(e.target.value)} />
                <button className="btn btn-secondary">SUBMIT</button>
            </form>
            {
                usersSurveysErrors && (
                    Object.keys(usersSurveysErrors).map(errorKey => (
                        <p className="text-danger" key={errorKey}>{usersSurveysErrors[errorKey][0]}</p>
                    ))
                )
            }
            {
                usersSurveysLoading ?
                    <p>LOADING...</p>
                    :
                    <div>
                        {
                            usersSurveysResponse.map(userSurvey => (
                                <div className="border p-3 rounded mb-3" key={userSurvey.id}>
                                    {/* User */}
                                    <div className="mb-3">
                                        <p className="mb-0"><b>User:</b></p>
                                        <div className="ps-3">
                                            <p className="mb-0">{userSurvey.user.name}</p>
                                        </div>
                                    </div>

                                    {/* Survey */}
                                    <div className="mb-3">
                                        <p className="mb-0"><b>Survey:</b></p>
                                        <div className="ps-3">
                                            <p className="mb-0">Code: {userSurvey.survey.code}</p>
                                            <p className="mb-0">Name: {userSurvey.survey.name}</p>
                                            <p className="mb-0">Questions:</p>
                                            <div className="ps-3">
                                                {
                                                    userSurvey.survey.questions.map(question => (
                                                        <div key={question.id}>
                                                            <p className="mb-0"><b>{question.label}</b></p>
                                                            {
                                                                question.type == 'qcm' ?
                                                                    <div className="ps-3">
                                                                        {
                                                                            userSurvey.answers_grouped[question.id] && (
                                                                                question.options.map(option => (
                                                                                    <div key={option.id}>
                                                                                        <p className="mb-0"><b>{option.label}</b></p>
                                                                                        <div className="ps-3">
                                                                                            <p className="mb-0">{userSurvey.answers_grouped?.[question.id]?.[option.id]?.value_boolean ? 'true' : 'false'}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            )
                                                                        }
                                                                    </div>
                                                                    :
                                                                    <div className="ps-3">
                                                                        <p className="mb-0">{userSurvey.answers_grouped[question.id]?.['']?.value_integer}</p>
                                                                    </div>
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
            }
        </div>
    );
}

export default App;
