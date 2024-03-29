import React, { useState } from 'react';
import { FaDice } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import IconButton from '../components/IconButton';
import Input from '../components/Input';
import PaperStack from '../components/PaperStack';
import CodenameList from '../helper/CodenameList';
import User from '../models/User';
import UserService from '../services/UserService';

function App() {
    const userService = new UserService();
    const codenameList = new CodenameList();
    const [codename, setCodename] = useState('');
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
    const smallPause = 1000;
    const mediumPause = 1500;
    const longPause = 3000;

    const typewriterOptions = {
        delay: 50,
    };

    // TODO deactivate confirm name button if input is 0 long.
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO handle validation in a seperate function.
        if (codename && isCookiesConfirmed) {
            // TODO error handling, e.g. user exists.
            userService.create(new User(codename)).then((token) => {
                navigate('/lobbies');
            });
        }
    }

    return (
        <form
            className="w-full h-auto min-h-screen p-8 flex flex-col"
            onSubmit={(event) => handleSubmit(event)}
        >
            <PaperStack className="flex-auto mx-auto p-6 font-mono">
                <div className="text-3xl">
                    {isHeadlinePrinted ? (
                        headlineText
                    ) : (
                        <Typewriter
                            options={typewriterOptions}
                            onInit={(typewriter) => {
                                typewriter
                                    .pauseFor(longPause)
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
                            <div dangerouslySetInnerHTML={{ __html: p1 }}></div>
                        ) : (
                            <Typewriter
                                options={typewriterOptions}
                                onInit={(typewriter) => {
                                    typewriter
                                        .typeString(p1)
                                        .pauseFor(smallPause)
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
                            value={codename}
                            onChange={(event) =>
                                setCodename(event.target.value)
                            }
                            disabled={isCodenameConfirmed}
                            type="text"
                            className="my-2 mr-3 w-56 max-w-full px-2"
                        ></Input>
                        <IconButton
                            className="h-10 w-10 p-0 mr-auto"
                            disabled={isCodenameConfirmed}
                            onClick={() => {
                                setCodename(codenameList.getRandomCodename());
                            }}
                        >
                            <FaDice
                                size={25}
                                color={
                                    isCodenameConfirmed ? '#98a0b1' : '#3c485c'
                                }
                            ></FaDice>
                        </IconButton>
                        <Button
                            type="button"
                            className="my-2"
                            disabled={
                                isCodenameConfirmed || codename.length === 0
                            }
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
                                        .pauseFor(smallPause)
                                        .typeString(p2)
                                        .pauseFor(mediumPause)
                                        .typeString(p3)
                                        .pauseFor(smallPause)
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
                            necessary cookies for technical purposes. No data
                            will be used for tracking or analytics.
                        </Checkbox>
                        <div className="my-8 flex items-center justify-end flex-wrap">
                            <Button
                                type="submit"
                                className="my-2"
                                disabled={!isCookiesConfirmed}
                            >
                                Confirm
                            </Button>
                        </div>
                    </React.Fragment>
                ) : (
                    ''
                )}
            </PaperStack>
        </form>
    );
}

export default App;
