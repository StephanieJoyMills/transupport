import {getVariables} from './getVars';
import {getETA} from './getETA';
import {daysBetween} from './daysBetween';


export const getSuggestedDecisions = (a, eta, customerPriority, accountPriority, riskLevelDefaults, riskLevelOptions) => {
    let t = getVariables(riskLevelDefaults, riskLevelOptions);
    var sugD1;
    var sugD2;
    
    if (customerPriority == "TRUE" || accountPriority == "TRUE"){
      t['SM'] = 7;
    }
    
    var lnch = new Date(a.lnch);
    var margin = t.SM - daysBetween(new Date(eta.date), lnch);
    
    var ctl1 = getTm1(a, t);
    var ctl2 = getTm2(a, t);
    var ctl = ctl1 + ctl2;
    
    if (a.tm1 === '-'){
      if (a.dm === "DC"){
        if (margin <= 0){
          sugD1 = "BOAT";
          sugD2 = "RAIL";
        } else if  (margin <= (ctl2 - t.PtoDCT)){
          sugD1 = "BOAT";
          sugD2 = "TRUCK";
        } else if (margin <= (ctl2 - t.PtoDCA)){
          sugD1 = "BOAT";
          sugD2 = "AIR";
        } else if (margin <= (ctl2 - t.CtoPA)){
          sugD1 = "AIR";
          sugD2 = "RAIL";
        } else if (margin <= (ctl - t.CtoPA - t.PtoDCT)){
          sugD1 = "AIR";
          sugD2 = "TRUCK";
        } else if (margin <= (ctl - t.CtoPA - t.PtoDCA)){
          sugD1 = "AIR";
          sugD2 = "AIR";
        } else {
          sugD1 = "INFEASIBLE";
          sugD2 = "INFEASIBLE";
        }
      } else if (a.dm === "DRS"){
        if (margin <= 0){
          sugD1 = "BOAT";
          sugD2 = "RAIL";
        } else if  (margin <= (ctl2 - t.PtoDRST)){
          sugD1 = "BOAT";
          sugD2 = "TRUCK";
        } else if (margin <= (ctl2 - t.PtoDRSA)){
          sugD1 = "BOAT";
          sugD2 = "AIR";
        } else if (margin <= (ctl2 - t.CtoPA)){
          sugD1 = "AIR";
          sugD2 = "RAIL";
        } else if (margin <= (ctl - t.CtoPA - t.PtoDRST)){
          sugD1 = "AIR";
          sugD2 = "TRUCK";
        } else if (margin <= (ctl - t.CtoPA - t.PtoDRSA)){
          sugD1 = "AIR";
          sugD2 = "AIR";
        } else {
          sugD1 = "INFEASIBLE";
          sugD2 = "INFEASIBLE";
        }
      } else {
        sugD1 = "NA";
        sugD2 = "NA";
      }
    } else if (a.tm2 === '-') {
      if (a.dm === "DC"){
        if (margin <= 0){
          sugD1 = a.tm1;
          sugD2 = "RAIL";
        } else if (margin <= (ctl2 - t.PtoDCT)){
          sugD1 = a.tm1;
          sugD2 = "TRUCK";
        } else if (margin <= (ctl2 - t.PtoDCA)){
          sugD1 = a.tm1;
          sugD2 = "AIR";
        } else {
          sugD1 = a.tm1;
          sugD2 = "INFEASIBLE";
        }
      } else if (a.dm === "DRS"){
        if (margin <= 0){
          sugD1 = a.tm1;
          sugD2 = "RAIL";
        } else if (margin <= (ctl2 - t.PtoDRST)){
          sugD1 = "NA";
          sugD2 = a.tm1;
        } else if (margin <= (ctl2 - t.PtoDRSA)){
          sugD1 = a.tm1;
          sugD2 = "AIR";
        } else {
          sugD1 = "INFEASIBLE";
          sugD2 = "INFEASIBLE";
        }
      } else {
        sugD1 = "NA";
        sugD2 = "NA";
      }
    } else {
      sugD1 = a.tm1;
      sugD2 = a.tm2;
    }
    a['tm1']=sugD1;
    a['tm2']=sugD2;
    var sugETA = getETA(a, riskLevelDefaults, riskLevelOptions);
    var suggestions = {
      d1:sugD1,
      d2:sugD2,
      eta:sugETA,
    }
    return suggestions
  }
  
  function getCurrentTripLength(a, t){
    var length = 0;
    if (a.tm1 == "AIR"){
      length = length + t.CtoPA;
    } else {
      length = length + t.CtoPB;
    }
    if (a.dm == "DC"){
      if (a.tm2 == "AIR"){
        length = length + t.PtoDCA;
      } else if (a.tm2 == "TRUCK"){
        length = length + t.PtoDCT;
      } else {
        length = length + t.PtoDCR;
      }
    } else if (a.dm == "DRS"){
      if (a.tm2 == "AIR"){
        length = length + t.PtoDCA;
      } else if (a.tm2 == "TRUCK"){
        length = length + t.PtoDCT;
      } else {
        length = length + t.PtoDCR;
      }
    }
    return length;
  }
  
  function getTm1(a, t){
    if (a.tm1 == "AIR"){
      return t.CtoPA;
    } else {
      return t.CtoPB;
    }
  }
  
  function getTm2(a, t){
    if (a.dm == "DC"){
      if (a.tm2 == "AIR"){
        return t.PtoDCA;
      } else if (a.tm2 == "TRUCK"){
        return t.PtoDCT;
      } else {
        return t.PtoDCR;
      }
    } else if (a.dm == "DRS"){
      if (a.tm2 == "AIR"){
        return t.PtoDCA;
      } else if (a.tm2 == "TRUCK"){
        return t.PtoDCT;
      } else {
        return t.PtoDCR;
      }
    }
  }
  
