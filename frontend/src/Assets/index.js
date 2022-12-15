import axios from 'axios';
import background from './bg-small.jpg';
axios.defaults.withCredentials = true;

export const bg = background;

export const hooker = (field, hook) => {
    return hook((state) => state[field]);
};

// 30 seconds timeout set
export const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 1000 * 30
});

export const RTFTemplate = `<h2 style="text-align: justify">Robert Conels</h2><p style="text-align: justify"><strong>Place: NewYork,HIMA</strong></p><p style="text-align: justify"><strong>Age: 45</strong></p><p style="text-align: justify"><strong>Diagnosis: oTrefRt</strong></p><p style="text-align: justify"><strong>Last Checkup: 04/11/2022</strong></p><p style="text-align: justify"><strong>Status: 4</strong></p><h4 style="text-align: justify"><strong>Primary Stage</strong></h4><ul><li><p style="text-align: justify"><strong>Diagnosed with TFRT</strong></p></li><li><p style="text-align: justify"><strong>Started Treatment on 4th May</strong></p></li><li><p style="text-align: justify"><strong>Statuscode 6</strong></p></li></ul><h4 style="text-align: justify"><strong>Secondary Stage</strong></h4><ul><li><p style="text-align: justify"><strong>Major progress</strong></p></li><li><p style="text-align: justify"><strong>Stauscode 2</strong></p></li><li><p style="text-align: justify"><strong>Stage 5 Entered</strong></p></li><li><p style="text-align: justify"><strong>Decreased Medication </strong></p></li></ul><h4 style="text-align: justify"><strong>Tertiary Stage</strong></h4><ul><li><p style="text-align: justify"><strong>Improved Health</strong></p></li><li><p style="text-align: justify"><strong>Statuscodes cleared</strong></p></li></ul><p style="text-align: justify"></p><hr><blockquote><p style="text-align: center">Discharged and cleared Case ! </p><p style="text-align: center">© 2022 <strong>medic-log</strong></p></blockquote>`;