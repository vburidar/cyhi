import React from 'react';
import Tone from 'tone';
import {useState} from 'react'
import ApiRequester from './Requester';
import ScoreBuilder from './ScoreBuilder';
import { useEffect } from 'react';
import { Button, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
    successTypo: {
        color: '#156134',
    },
  }));

export default function Exercise(){
    const [midi, setMidi] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [done, setDone] = useState(false);
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [scoreBuilder] = useState(new ScoreBuilder('G'));
    const classes = useStyles();

    useEffect(() => {
        let param = window.location.pathname.split('/');
        let url = '/exercise'
        if (param[1] && param[2] && param[3]){
            url += '/' + param[1] + '/' + param[2] + '/' + param[3];
        } 
        const apiRequester = new ApiRequester('GET', url, {})
        apiRequester.call()
        .then(response => response.json())
        .then(data => {
            if (data.exercise === undefined){
                setError(true);
            } else {
                scoreBuilder.setArmor(data.param.keySig[0])
                scoreBuilder.build(data)
                setMidi(data.midi);
                setData(data);
            }
        })
        .catch(e => console.log(e));
    }, []);

    const playMidi = () => {
        const synths =[];
        const now = Tone.now() + 0.5
		midi.tracks.forEach(track => {
			const synth = new Tone.PolySynth(10, Tone.Synth, {
				envelope : {
				    attack : 0.02,
				    decay : 0.1,
					sustain : 0.3,
					release : 1
				}
			}).toMaster()
			synths.push(synth)
			track.notes.forEach(note => {
			    synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity)
		    })
		})
    }

    const sendAnswer = () => {
        const apiRequester = new ApiRequester('GET', '/exercise/answer', {})
        apiRequester.addParams({answer: scoreBuilder.answerUser, exerciseId: data.id});
        apiRequester.call()
        .then(response => response.json())
        .then(body => {
            setDone(true);
            scoreBuilder.setAnswer(body.pitch);
            setSuccess(body.pitch === scoreBuilder.answerUser.pitch);
            scoreBuilder.build(data);
        });
    }

    const up = () => {
        setAnswered(true);
        if (scoreBuilder.answerUser === 0){
            scoreBuilder.setAnswerUser(64)
        } else {
            scoreBuilder.upAnswerUser();
        }
        scoreBuilder.build(data);
        console.log('answerUser =', scoreBuilder.answerUser);
    }

    const down = () => {
        setAnswered(true);
        if (scoreBuilder.answerUser === 0){
            scoreBuilder.setAnswerUser(60);
        } else {
            scoreBuilder.downAnswerUser();
        }
        scoreBuilder.build(data);
        console.log('answerUser =', scoreBuilder.answerUser);
    }

    const sharp =() => {
        scoreBuilder.answerUser.setAccident('sharp', scoreBuilder.armor);
        scoreBuilder.build(data);
        console.log('answerUser =', scoreBuilder.answerUser);
    }

    const flat =() => {
        scoreBuilder.answerUser.setAccident('flat', scoreBuilder.armor);
        scoreBuilder.build(data);
        console.log('answerUser =', scoreBuilder.answerUser);
    }

    const natural = () => {
        scoreBuilder.answerUser.setAccident('natural', scoreBuilder.armor);
        scoreBuilder.build(data);
        console.log('answerUser =', scoreBuilder.answerUser);
    }

    return(
        <div>
            <div id="Exercise"></div>
            {!error && !done && <div id="control">
            <Button className={classes.button} onClick={playMidi} variant="contained">Play Music</Button>
            <Button className={classes.button} onClick={up} variant="contained">Up</Button>
            <Button className={classes.button} onClick={down} variant="contained">Down</Button>
            <Button className={classes.button} onClick={sharp} variant="contained">Sharp</Button>
            <Button className={classes.button} onClick={flat} variant="contained">Flat</Button>
            <Button className={classes.button} onClick={natural} variant="contained">Natural</Button>
            </div>}
            <div id="validate">
            { answered && !done && <Button onClick={sendAnswer} variant="contained" color="primary">Validate</Button>}
            {done && success && <Typography className={classes.successTypo}><b>Congratulation you found the right pitch!</b></Typography>}
            {done && !success && <Typography>Not this time. Don't give up!</Typography>}
            {error && <Typography>There was a problem and this exercise could note be printed</Typography>}
            {(error || done) && <Button className={classes.button} onClick={() =>window.location.reload(false)}>Next Exercise</Button>}
            </div>
        </div>
    )
}