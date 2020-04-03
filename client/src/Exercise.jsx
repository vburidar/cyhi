import React from 'react';
import Tone from 'tone';
import {useState} from 'react'
import ApiRequester from './Requester';
import ScoreBuilder from './ScoreBuilder';
import { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { isAccidental } from './PitchConverter';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

export default function Exercise(){
    const [midi, setMidi] = useState(null);
    const [answer, setAnswer] = useState(0);
    const [done, setDone] = useState(false);
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [scoreBuilder, setScoreBuilder] = useState(new ScoreBuilder('G'));
    const classes = useStyles();

    useEffect(() => {
        let param = window.location.pathname.split('/');
        let url = '/exercise'
        console.log(param);
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
                scoreBuilder.build(data, 0)
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
        apiRequester.addParams({answer: answer, exerciseId: data.id});
        apiRequester.call()
        .then(response => response.json())
        .then(data => {
            setDone(true);
            setSuccess(data.pitch === answer);
        });
    }

    const up = () => {
        let tmpAnswer = answer;
        if (answer === 0){
            setAnswer(64)
            scoreBuilder.build(data, 64);
        } else {
            tmpAnswer += 1;
            let armor = parseInt(data.param.keySig[0]);
            if (isNaN(armor)){
                armor = 0;
            }
            while (isAccidental(tmpAnswer, armor)){
                console.log('here');
                tmpAnswer += 1;
            }
            setAnswer(tmpAnswer);
            console.log('before build score')
            scoreBuilder.build(data, tmpAnswer);
        }
    }

    const down = () => {
        let tmpAnswer = answer;
        if (answer === 0){
            setAnswer(64)
            scoreBuilder.build(data, 64);
        } else {
            tmpAnswer -= 1;
            let armor = parseInt(data.param.keySig[0]);
            if (isNaN(armor)){
                armor = 0;
            }
            while (isAccidental(tmpAnswer, armor) && tmpAnswer > 0){
                console.log('here');
                tmpAnswer -= 1;
            }
            setAnswer(tmpAnswer);
            console.log('before build score')
            scoreBuilder.build(data, tmpAnswer);
        }
    }

    const sharp =() => {

    }

    const flat =() => {

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
            </div>}
            <div id="validate">
            {answer !== 0 && !done && <Button onClick={sendAnswer} variant="contained" color="primary">Validate</Button>}
            {done && success && <Typography>Congratulation!</Typography>}
            {done && !success && <Typography>Try Again</Typography>}
            {error && <Typography>There was a problem and this exercise could note be printed</Typography>}
            {(error || done) && <Button className={classes.button} onClick={() =>window.location.reload(false)}>Next Exercise</Button>}
            </div>
        </div>
    )
}