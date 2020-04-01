import React from 'react'
import ApiRequester from './Requester';
import buildScore from './ScoreBuilder';
import buildMidi from './MidiBuilder.ts';
import { useEffect } from 'react';

export default function Exercise(){

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
        .then(data => buildScore(data))
        .then(data => buildMidi(data))
        .catch(e => console.log(e));
    }, []);

    return(
        <div id="Exercise"></div>
    )
}