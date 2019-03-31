import {daysBetween} from './daysBetween';

export const getStatus = (a, eta, safety) => {
    if (eta.numDays != 0){
      var lnch = new Date(a.lnch);
      var margin = daysBetween(new Date(eta.date), lnch);
      if (margin > safety){
        return "early";
      } else if (margin == safety){
        return "on time";
      } else if (margin < safety && margin > 0){
        return "at risk";
      } else if (margin <= 0){
        return "late";
      } else {
        return "-";
      }
    } else if (eta.date == "-") {
      return "cancelled"
    } else {
      return "-"
    }
  }