import {getVariables} from './getVars';
import {daysBetween} from './daysBetween';

export const getETA = (a, riskLevelDefaults, riskLevelOptions)  => {
    const aCopy = JSON.parse(JSON.stringify(a));
    const t = getVariables(riskLevelDefaults, riskLevelOptions)
    return calcETA(aCopy,t)
}

// Calculate time from Consolidator to Port based on transport type
function getTimeToPort(tm1, t){
    if (tm1 == "AIR"){
      return t.CtoPA;
    } else {
      return t.CtoPB;
    };
  }
  
  // Calculate time from Port to Customer based on transport type
  function getTimeToCustomer(tm2, dm, t){
    if (dm == "DC"){
      if (tm2 == "AIR"){
        return t.PtoDCA + t.DCtoC;
      } else if (tm2 == "TRUCK") {
        return t.PtoDCT + t.DCtoC;
      } else {
        return t.PtoDCR + t.DCtoC;
      }
    } else if (dm == "DRS"){
      if (tm2 == "AIR"){
        return t.PtoDRSA;
      } else if (tm2 == "TRUCK") {
        return t.PtoDRST;
      } else {
        return t.PtoDRSR;
      }
    };
  }
  
  // Calculate the ETA based on current location
  function calcETA(a, t) {
    var date;
    var eta = {
      date: new Date(),
      numDays: 0,
      daysBetween: 0,
    }
  
    console.log(a);
    // No dates registered
    if (a.gac == '-' && a.dsm != "FALSE"){
      eta.date = "-";
    } 
    // DSM is true
    else if (a.dsm === "TRUE"){
      eta.date = "-";
    }
    // Currently arrived at consolidator
    else if (a.ogac == '-'){
      eta.numDays = t.CWait + getTimeToPort(a.tm1, t) + t.PWait + getTimeToCustomer(a.tm2, a.dm, t);
      date = new Date(a.gac);
      eta.date = new Date(date.setDate(date.getDate()+eta.numDays));
    } 
    // Currently left consolidator 
    else if (a.p == '-'){
      eta.numDays = getTimeToPort(a.tm1, t) + t.PWait + getTimeToCustomer(a.tm2, a.dm, t);
      date = new Date(a.ogac);
      eta.date = new Date(date.setDate(date.getDate()+eta.numDays));
    } 
    // Currently arrived at port
    else if (a.actual == '-'){
      eta.numDays = t.PWait + getTimeToCustomer(a.tm2, a.dm, t);
      date = new Date(a.p);
      eta.date = new Date(date.setDate(date.getDate()+eta.numDays));
    }
    eta.daysBetween = daysBetween(new Date(eta.date), new Date(a.lnch));
    console.log(eta);
    return eta;
  }