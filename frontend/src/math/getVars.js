import constants from "./constants";
import defaults from "./defaults";
import decisions from "./decisions";

export const getVariables = (rld, rlo) => {
  
    let cold = 0;
    let colo = 0;
    if (rld === 'high'){
        cold = 0;
    } else if (rld === 'medium'){
        cold = 2;
    } else if (rld === 'low'){
        cold = 1;
    }
    if (rlo === 'high'){
        colo = 0;
    } else if (rlo === 'medium'){
        colo = 2;
    } else if (rlo === 'low'){
        colo = 1;
    }

    // Get all constants from spreadsheet
    let times = {};
    for (let i = 0; i <= 2; i++){
        times[constants[i][3]] = constants[i][2];
    }
    for (let i = 0; i <= 3; i++){
        times[defaults[i][3]] = defaults[i][cold];
    }
    for (let i = 0; i <= 3; i++){
        times[decisions[i][3]] = decisions[i][colo];
    }
    return times;
}