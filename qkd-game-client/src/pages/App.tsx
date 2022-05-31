import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Input from '../components/Input';

function App() {
    const headlineText = 'Welcome, agent';
    const [isHeadlinePrinted, setIsHeadlinePrinted] = useState(false);
    const p1 = '<br/><br/>Please choose your codename for today.';
    const [isP1Printed, setIsP1Printed] = useState(false);
    const [isCodenameConfirmed, setIsCodenameConfirmed] = useState(false);
    const p2 = '<br/><br/>Confirmed.';
    const p3 = '<br/><br/>Are you ready for your mission?';
    const [isP3Printed, setIsP3Printed] = useState(false);
    const [isCookiesConfirmed, setIsCookiesConfirmed] = useState(false);
    const navigate = useNavigate();

    const typewriterOptions = {
        delay: 50,
    };

    return (
        <React.Fragment>
            <div className="w-screen h-[141.4vw] max-h-screen max-w-[70.72vh] mx-auto p-8">
                <div className="mx-auto p-6 font-mono shadow-lg w-full h-full">
                    <div className="text-3xl">
                        {isHeadlinePrinted ? (
                            headlineText
                        ) : (
                            <Typewriter
                                options={typewriterOptions}
                                onInit={(typewriter) => {
                                    typewriter
                                        .pauseFor(1000)
                                        .typeString(headlineText)
                                        .callFunction(() =>
                                            setIsHeadlinePrinted(true)
                                        )
                                        .start();
                                }}
                            />
                        )}
                    </div>
                    {isHeadlinePrinted ? (
                        <div className="text-base">
                            {isP1Printed ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: p1 }}
                                ></div>
                            ) : (
                                <Typewriter
                                    options={typewriterOptions}
                                    onInit={(typewriter) => {
                                        typewriter
                                            .typeString(p1)
                                            .pauseFor(1000)
                                            .callFunction(() =>
                                                setIsP1Printed(true)
                                            )
                                            .start();
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        ''
                    )}
                    {isP1Printed ? (
                        <div className="my-8 flex items-center justify-between flex-wrap">
                            <Input
                                disabled={isCodenameConfirmed}
                                type="text"
                                className="my-2 mr-3 w-56 max-w-full px-2"
                            ></Input>
                            <Button
                                type="button"
                                className="my-2"
                                disabled={isCodenameConfirmed}
                                onClick={() => {
                                    setIsCodenameConfirmed(true);
                                }}
                            >
                                Confirm
                            </Button>
                        </div>
                    ) : (
                        ''
                    )}
                    {isCodenameConfirmed ? (
                        <div className="text-base">
                            {isP3Printed ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: p2 + p3,
                                    }}
                                ></div>
                            ) : (
                                <Typewriter
                                    options={typewriterOptions}
                                    onInit={(typewriter) => {
                                        typewriter
                                            .pauseFor(1000)
                                            .typeString(p2)
                                            .pauseFor(1500)
                                            .typeString(p3)
                                            .pauseFor(1000)
                                            .callFunction(() =>
                                                setIsP3Printed(true)
                                            )
                                            .start();
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        ''
                    )}
                    {isP3Printed ? (
                        <React.Fragment>
                            <Checkbox
                                className="my-10"
                                onChange={() => {
                                    setIsCookiesConfirmed(!isCookiesConfirmed);
                                }}
                                defaultChecked={isCookiesConfirmed}
                            >
                                I am ready. I confirm that this application uses
                                necessary cookies for technical purposes. No
                                data will be used for tracking or analytics.
                            </Checkbox>
                            <div className="my-8 flex items-center justify-end flex-wrap">
                                <Button
                                    type="button"
                                    className="my-2"
                                    disabled={!isCookiesConfirmed}
                                    onClick={() => {
                                        // TODO set name correctly
                                        navigate('/lobbies');
                                    }}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </React.Fragment>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

export default App;
